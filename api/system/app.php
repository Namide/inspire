<?php
// https://github.com/klein/klein.php
$klein = new \Klein\Klein();

function sendSuccess(&$response, &$data, $subject, $action,
                     $user = ['name' => 'Guest'])
{
    if (CORS) {
        $response->header('Access-Control-Allow-Origin', CORS);
    }
    
    $json = [
        'success' => true,
        'data' => $data,
        'meta' => [
            'subject' => $subject,
            'action' => $action,
            'user' => $user,
            'time' => microtime(true) - START_TIME.' sec'
        ]
    ];

    $response->json($json);
}

function sendError(&$response, $message = '')
{
    if (CORS) {
        $response->header('Access-Control-Allow-Origin', CORS);
    }
    
    $json = [
        'success' => false,
        'message' => $message,
        'meta' => [
            'time' => microtime(true) - START_TIME.' sec'
        ]
    ];

    $response->json($json);
}

function getUser($token = false)
{
    if ($token) {
        $userManager = new \Inspire\Database\UserManager();
        return $userManager->getUserByToken($token);
    }

    return ['name' => 'Guest', 'role' => 0];
}
// Get routes
$klein->respond('GET', API_URL_REL.'/',
    function($request, $response, $service) {
    try {
        $data = [
            'post' => API_URL_REL.'/posts',
            'group' => API_URL_REL.'/groups',
            'item' => API_URL_REL.'/item/{uid}',
            'rss' => API_URL_REL.'/rss'
        ];

        sendSuccess($response, $data, 'routes', 'get');
    } catch (Exception $ex) {
        sendError($response, $ex->getMessage());
    }
});

/*
 * AUTH
 */
$klein->with(API_URL_REL.'/auth',
    function () use ($klein) {
    $klein->respond('POST', '/signin',
        function ($request, $response, $service) {
        try {
            $mail = $request->param('mail');
            $pass = $request->param('pass');

            if (empty($mail) || empty($pass))
                    throw new \Exception('"mail" and "pass" required');


            $userManager = new \Inspire\Database\UserManager();
            $user        = $userManager->getUserBySignIn($mail, $pass);

            $userMetaData = [
                'name' => $user['name'],
                'mail' => $user['mail'],
                'role' => $user['role']
            ];

            sendSuccess($response, $user, 'auth', 'signin', $userMetaData);
        } catch (Exception $ex) {
            sendError($response, $ex->getMessage());
        }
    });

    $klein->respond('GET', '/signout',
        function ($request, $response, $service) {
        try {
            $headers = $request->headers();
            $token   = $headers['X-Access-Token'];

            $userManager = new \Inspire\Database\UserManager();
            $user        = $userManager->signout($token);

            sendSuccess($response, $user, 'auth', 'signout', $user);
        } catch (Exception $ex) {
            sendError($response, $ex->getMessage());
        }
    });
});


/*
 * USER
 */
$klein->with(API_URL_REL.'/users',
    function () use ($klein) {
    $klein->respond('POST', '/add',
        function ($request, $response, $service) {
        try {
            $mail = trim($request->param('mail'));
            $name = trim($request->param('name'));
            $role = trim($request->param('role'));

            if (empty($mail) || empty($name))
                    throw new \Exception('"mail" and "name" required');

            if (empty($role)) $role = 1;

            $headers     = $request->headers();
            $userManager = new \Inspire\Database\UserManager();

            $newUserData = [
                'mail' => $mail,
                'name' => $name,
                'role' => $role
            ];
            $user        = empty($headers['X-Access-Token']) ? getUser() : getUser($headers['X-Access-Token']);
            $newUser     = $userManager->addUser($newUserData, $user);

            sendSuccess($response, $newUser, 'users', 'add', $user);
        } catch (Exception $ex) {
            sendError($response, $ex->getMessage());
        }
    });

    $klein->respond('POST', '/delete',
        function ($request, $response, $service) {
        try {
            $mail = trim($request->param('mail'));

            if (empty($mail)) throw new \Exception('"mail" required');

            $headers     = $request->headers();
            $userManager = new \Inspire\Database\UserManager();
            $user        = empty($headers['X-Access-Token']) ? getUser() : getUser($headers['X-Access-Token']);

            $userManager->deleteUser($mail, $user);
            $data = ['mail' => $mail];

            sendSuccess($response, $data, 'users', 'delete', $user);
        } catch (Exception $ex) {
            sendError($response, $ex->getMessage());
        }
    });
});

// Get posts
$klein->respond('GET', API_URL_REL.'/posts/[*:trailing]?',
    function ($request, $response, $service) {
    try {
        $headers = $request->headers();
        $user    = empty($headers['X-Access-Token']) ? getUser() : getUser($headers['X-Access-Token']);

        $argsStr = $request->param('trailing');
        $rawList = explode('/', $argsStr);

        // Fix array with 1 empty cell
        if (count($rawList) === 1 && empty($rawList[0])) unset($rawList[0]);

        if (count($rawList) % 2 === 1)
                throw new Exception('List of data after posts must be pair');

        $argObj = [];
        for ($i = 0; $i < count($rawList); $i += 2) {
            $key      = $rawList[$i];
            $rawValue = $rawList[$i + 1];
            switch ($key) {
                case 'tags':
                    $value = explode(',', $rawValue);
                    break;
                case 'types':
                    $value = explode(',', $rawValue);
                    break;
                case 'notags':
                    $value = explode(',', $rawValue);
                    break;
                case 'notypes':
                    $value = explode(',', $rawValue);
                    break;
                case 'limit':
                    $value = (int) $rawValue;
                    break;
                case 'offset':
                    $value = (int) $rawValue;
                    break;
                default:
                    throw new Exception('Arguments after "posts" must be only '
                    .'"tags", "types", "notags", "notypes", "limit" and "offset", "'
                    .$key.'" not accepted');
            }

            $argObj[$key] = $value;
        }

        $postManager = new \Inspire\Database\PostManager();
        $posts       = $postManager->getPosts($argObj);

        sendSuccess($response, $posts, 'posts', 'get', $user);
    } catch (Exception $ex) {
        sendError($response, $ex->getMessage());
    }
});

// Add post
$klein->respond('POST', API_URL_REL.'/posts/add',
    function($request, $response, $service) {
    try {
        $headers = $request->headers();
        $user    = empty($headers['X-Access-Token']) ? getUser() : getUser($headers['X-Access-Token']);

        $postManager = new \Inspire\Database\PostManager();

        $params = $request->params();

        // Save file
        if (!empty($_FILES['content_file'])) {
            $fileData               = $postManager->saveFile($_FILES['content_file']);
            $params['content_file'] = Inspire\Helper\JsonHelp::FROM_ARRAY($fileData);
        }

        // Save thumb
        if (!empty($_FILES['thumb'])) {
            $thumbData       = $postManager->saveThumb($_FILES['thumb']);
            $params['thumb'] = Inspire\Helper\JsonHelp::FROM_ARRAY($thumbData);
        }
        // Create thumb from file
        elseif (!empty($fileData) && !empty(strpos($fileData['type'], 'image') !== false)) {
            $thumbData       = $postManager->createThumbFromImage(DATA_PATH.$fileData['path']);
            $params['thumb'] = Inspire\Helper\JsonHelp::FROM_ARRAY($thumbData);
        }

        $post = $postManager->addPost($params);

        sendSuccess($response, $post, 'posts', 'add', $user);
    } catch (Exception $ex) {
        sendError($response, $ex->getMessage());
    }
});


// Update post
$klein->respond('POST', API_URL_REL.'/posts/edit/[i:uid]',
    function($request, $response, $service) {
    try {
        $headers = $request->headers();
        $user    = empty($headers['X-Access-Token']) ? getUser() : getUser($headers['X-Access-Token']);

        $postManager = new \Inspire\Database\PostManager();
        // $params = $request->paramsPost();
        $uid         = $request->param('uid');


        $params = $request->params();

        // Update file
        if (!empty($_FILES['content_file'])) {
            $postManager->removeFile($uid);
            $fileData               = $postManager->saveFile($_FILES['content_file']);
            $params['content_file'] = Inspire\Helper\JsonHelp::FROM_ARRAY($fileData);
        }

        // Update thumb
        if (!empty($_FILES['thumb'])) {
            $postManager->removeThumb($uid);
            $thumbData       = $postManager->saveThumb($_FILES['thumb']);
            $params['thumb'] = Inspire\Helper\JsonHelp::FROM_ARRAY($thumbData);
        }
        // Update thumb from file
        elseif (!empty($fileData) && !empty(strpos($fileData['type'], 'image') !== false)) {
            $postManager->removeThumb($uid);
            $thumbData       = $postManager->createThumbFromImage(DATA_PATH.$fileData['path']);
            $params['thumb'] = Inspire\Helper\JsonHelp::FROM_ARRAY($thumbData);
        }

        // Update post
        $post = $postManager->updatePost($uid, $params);

        sendSuccess($response, $post, 'posts', 'edit', $user);
    } catch (Exception $ex) {
        sendError($response, $ex->getMessage());
    }
});

// Delete post
$klein->respond('GET', API_URL_REL.'/posts/delete/[i:uid]',
    function($request, $response, $service) {
    try {
        $headers = $request->headers();
        $user    = empty($headers['X-Access-Token']) ? getUser() : getUser($headers['X-Access-Token']);

        $uid         = $request->param('uid');
        $postManager = new \Inspire\Database\PostManager();
        $postManager->removeThumb($uid);
        $postManager->removeFile($uid);
        $postManager->deletePost($uid);

        $data = ['uid' => $uid];

        sendSuccess($response, $data, 'posts', 'delete', $user);
    } catch (Exception $ex) {
        sendError($response, $ex->getMessage());
    }
});

// Get post
$klein->respond('GET', API_URL_REL.'/posts/[i:id]',
    function ($request, $response, $service) {
    try {
        $headers = $request->headers();
        $user    = empty($headers['X-Access-Token']) ? getUser() : getUser($headers['X-Access-Token']);

        $postManager = new \Inspire\Database\PostManager();
        $id          = $request->param('id');
        $post        = $postManager->getPost($id);

        sendSuccess($response, $post, 'posts', 'get', $user);
    } catch (Exception $ex) {
        sendError($response, $ex->getMessage());
    }
});

// Get file
$klein->respond('GET', API_URL_REL.'/files/[i:uid]',
    function ($request, $response, $service, $app) {
    // Todo
    if (CORS) {
        $response->header('Access-Control-Allow-Origin', CORS);
    }

    try {
        $headers = $request->headers();
        $user    = empty($headers['X-Access-Token']) ? getUser() : getUser($headers['X-Access-Token']);

        $postManager = new \Inspire\Database\PostManager();
        $uid         = $request->param('uid');
        $file        = $postManager->getFile($uid);

        $response->file(DATA_PATH.$file['path'], $file['name']);
    } catch (Exception $ex) {
        sendError($response, $ex->getMessage());
    }
});

// Get distant content
$klein->respond('POST', API_URL_REL.'/distant',
    function ($request, $response, $service, $app) {
    // Todo
    if (CORS) {
        $response->header('Access-Control-Allow-Origin', CORS);
    }

    try {
        $headers = $request->headers();
        $user    = empty($headers['X-Access-Token']) ? getUser() : getUser($headers['X-Access-Token']);

        $params = $request->params();
        if (!empty($params['link'])) {
            $html = file_get_contents($params['link']);
            sendSuccess($response, $html, 'distant', 'get', $user);
        } else {
            throw new \Exception('"link" value is required');
        }
    } catch (Exception $ex) {
        sendError($response, $ex->getMessage());
    }
});

// Get thumb
$klein->respond('GET', API_URL_REL.'/thumbs/[i:uid]',
    function ($request, $response, $service, $app) {
    // Todo
    if (CORS) {
        $response->header('Access-Control-Allow-Origin', CORS);
    }
    
    try {
        $headers = $request->headers();
        $user    = empty($headers['X-Access-Token']) ? getUser() : getUser($headers['X-Access-Token']);

        $postManager = new \Inspire\Database\PostManager();
        $uid         = $request->param('uid');
        $file        = $postManager->getThumb($uid);

        $response->file(DATA_PATH.$file['path'], $file['name']);
    } catch (Exception $ex) {
        sendError($response, $ex->getMessage());
    }
});

// Get config.js
$klein->respond('GET', API_URL_REL.'/config.js',
    function($request, $response, $service) {
    try {
        if (CORS) {
            $response->header('Access-Control-Allow-Origin', CORS);
        }

        $body = Inspire\Vue\ConfigJS::getJs();
        $response->header('Content-Type', 'application/javascript');
        $response->body($body);
    } catch (Exception $ex) {
        sendError($response, $ex->getMessage());
    }
});

$klein->onHttpError(function ($code, $router) {
    $data     = 'Error '.$code;
    $response = $router->response();
    sendError($response, $ex->getMessage());
});

$klein->dispatch();
