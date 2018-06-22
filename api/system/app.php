<?php
// https://github.com/klein/klein.php
$klein = new \Klein\Klein();

$routes = [
    'routes' => '/',
    'auth/signin' => 'auth/signin',
    'auth/signout' => 'auth/signout',
    'routes' => '/',
    'routes' => '/',
    'routes' => '/',
    'routes' => '/',
];

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

        \Inspire\Helper\IOHelp::outputSuccess($response, $data, 'routes', 'get');
    } catch (Exception $ex) {
        \Inspire\Helper\IOHelp::outputError($response, $ex->getMessage());
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
            $userMan  = new \Inspire\Database\UserManager();
            $postData = [
                'mail' => ['type' => \Inspire\Helper\IOHelp::TYPE_STR, 'required' => true],
                'pass' => ['type' => \Inspire\Helper\IOHelp::TYPE_STR, 'required' => true]
            ];
            $post     = \Inspire\Helper\IOHelp::getInputPost($request, $postData);
            $user     = $userMan->getUserBySignIn($post['mail'], $post['pass']);

            $userMetaData = [
                'name' => $user['name'],
                'mail' => $user['mail'],
                'role' => $user['role']
            ];

            \Inspire\Helper\IOHelp::outputSuccess($response, $user, 'auth',
                'signin', $userMetaData);
        } catch (Exception $ex) {
            \Inspire\Helper\IOHelp::outputError($response, $ex->getMessage());
        }
    });

    $klein->respond('GET', '/signout',
        function ($request, $response, $service) {
        try {
            $headers = $request->headers();
            $token   = $headers['X-Access-Token'];
            $userMan = new \Inspire\Database\UserManager();
            $user    = $userMan->signout($token);

            \Inspire\Helper\IOHelp::outputSuccess($response, $user, 'auth',
                'signout', $user);
        } catch (Exception $ex) {
            \Inspire\Helper\IOHelp::outputError($response, $ex->getMessage());
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
            $user = \Inspire\Helper\IOHelp::getCurrentUser($request);

            $postData = [
                'name' => ['type' => \Inspire\Helper\IOHelp::TYPE_STR, 'required' => true],
                'mail' => ['type' => \Inspire\Helper\IOHelp::TYPE_STR, 'required' => true],
                'role' => ['type' => \Inspire\Helper\IOHelp::TYPE_INT, 'required' => true],
                'returnPass' => ['type' => \Inspire\Helper\IOHelp::TYPE_BOOL, 'required' => true]
            ];
            $post     = \Inspire\Helper\IOHelp::getInputPost($request, $postData);
            $userMan  = new \Inspire\Database\UserManager();
            $newUser  = $userMan->addUser($post, $user);

            \Inspire\Helper\IOHelp::outputSuccess($response, $newUser, 'users',
                'add', $user);
        } catch (Exception $ex) {
            \Inspire\Helper\IOHelp::outputError($response, $ex->getMessage());
        }
    });

    $klein->respond('POST', '/edit/[i:uid]',
        function ($request, $response, $service) {
        try {
            $user = \Inspire\Helper\IOHelp::getCurrentUser($request);

            $uid      = (int) $request->param('uid');
            $userMan  = new \Inspire\Database\UserManager();
            $postData = [
                'name' => ['type' => \Inspire\Helper\IOHelp::TYPE_STR, 'required' => true],
                'mail' => ['type' => \Inspire\Helper\IOHelp::TYPE_STR, 'required' => true],
                'pass' => ['type' => \Inspire\Helper\IOHelp::TYPE_STR, 'required' => true],
                'role' => ['type' => \Inspire\Helper\IOHelp::TYPE_INT, 'required' => true]
            ];
            $userData = \Inspire\Helper\IOHelp::getInputPost($request, $postData);
            $data     = $userMan->updateUser($uid, $userData, $user);

            \Inspire\Helper\IOHelp::outputSuccess($response, $data, 'users',
                'edit', $user);
        } catch (Exception $ex) {
            \Inspire\Helper\IOHelp::outputError($response, $ex->getMessage());
        }
    });

    $klein->respond('GET', '/delete/[i:uid]',
        function ($request, $response, $service) {
        try {
            $user = \Inspire\Helper\IOHelp::getCurrentUser($request);

            $uid     = (int) $request->param('uid');
            $userMan = new \Inspire\Database\UserManager();
            $userMan->deleteUser($uid, $user);
            $data    = ['uid' => $uid];

            \Inspire\Helper\IOHelp::outputSuccess($response, $data, 'users',
                'delete', $user);
        } catch (Exception $ex) {
            \Inspire\Helper\IOHelp::outputError($response, $ex->getMessage());
        }
    });

    $klein->respond('GET', '/[i:uid]',
        function ($request, $response, $service) {
        try {
            $user = \Inspire\Helper\IOHelp::getCurrentUser($request);

            $userMan = new \Inspire\Database\UserManager();
            $uid     = (int) $request->param('uid');
            $getData = $userMan->getUserByUid($uid, $user);

            \Inspire\Helper\IOHelp::outputSuccess($response, $getData, 'posts',
                'get', $user);
        } catch (Exception $ex) {
            \Inspire\Helper\IOHelp::outputError($response, $ex->getMessage());
        }
    });

    $klein->respond('GET', '',
        function ($request, $response, $service) {
        try {
            $user = \Inspire\Helper\IOHelp::getCurrentUser($request);

            $userMan = new \Inspire\Database\UserManager();
            $uid     = $request->param('uid');
            $users   = $userMan->getUsers($user);

            \Inspire\Helper\IOHelp::outputSuccess($response, $users, 'posts',
                'get', $user);
        } catch (Exception $ex) {
            \Inspire\Helper\IOHelp::outputError($response, $ex->getMessage());
        }
    });
});

// Get post
$klein->respond('GET', API_URL_REL.'/post/[i:id]',
    function ($request, $response, $service) {
    try {
        $headers = $request->headers();
        $user    = \Inspire\Helper\IOHelp::getCurrentUser($request);

        $postManager = new \Inspire\Database\PostManager();
        $id          = $request->param('id');
        $post        = $postManager->getPost($id);

        \Inspire\Helper\IOHelp::outputSuccess($response, $post, 'posts', 'get',
            $user);
    } catch (Exception $ex) {
        \Inspire\Helper\IOHelp::outputError($response, $ex->getMessage());
    }
});

// Get posts
$klein->respond('GET', API_URL_REL.'/posts/[*:trailing]?',
    function ($request, $response, $service) {
    try {
        $user = \Inspire\Helper\IOHelp::getCurrentUser($request);

        $filters = [
            'tags' => ['type' => \Inspire\Helper\IOHelp::TYPE_ARRAY, 'required' => false],
            'types' => ['type' => \Inspire\Helper\IOHelp::TYPE_ARRAY, 'required' => false],
            'notags' => ['type' => \Inspire\Helper\IOHelp::TYPE_ARRAY, 'required' => false],
            'notypes' => ['type' => \Inspire\Helper\IOHelp::TYPE_ARRAY, 'required' => false],
            'limit' => ['type' => \Inspire\Helper\IOHelp::TYPE_INT, 'required' => false],
            'offset' => ['type' => \Inspire\Helper\IOHelp::TYPE_INT, 'required' => false]
        ];
        
        $argObj      = \Inspire\Helper\IOHelp::getInputTrail($request, $filters);
        $postManager = new \Inspire\Database\PostManager();
        $posts       = $postManager->getPosts($argObj);

        \Inspire\Helper\IOHelp::outputSuccess($response, $posts, 'posts', 'get',
            $user);
    } catch (Exception $ex) {
        \Inspire\Helper\IOHelp::outputError($response, $ex->getMessage());
    }
});

// Add post
$klein->respond('POST', API_URL_REL.'/posts/add',
    function($request, $response, $service) {
    try {
        $headers = $request->headers();
        $user    = \Inspire\Helper\IOHelp::getCurrentUser($request);

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

        \Inspire\Helper\IOHelp::outputSuccess($response, $post, 'posts', 'add',
            $user);
    } catch (Exception $ex) {
        \Inspire\Helper\IOHelp::outputError($response, $ex->getMessage());
    }
});


// Update post
$klein->respond('POST', API_URL_REL.'/posts/edit/[i:uid]',
    function($request, $response, $service) {
    try {
        $headers = $request->headers();
        $user    = \Inspire\Helper\IOHelp::getCurrentUser($request);

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

        \Inspire\Helper\IOHelp::outputSuccess($response, $post, 'posts', 'edit',
            $user);
    } catch (Exception $ex) {
        \Inspire\Helper\IOHelp::outputError($response, $ex->getMessage());
    }
});

// Delete post
$klein->respond('GET', API_URL_REL.'/posts/delete/[i:uid]',
    function($request, $response, $service) {
    try {
        $headers = $request->headers();
        $user    = \Inspire\Helper\IOHelp::getCurrentUser($request);

        $uid         = $request->param('uid');
        $postManager = new \Inspire\Database\PostManager();
        $postManager->removeThumb($uid);
        $postManager->removeFile($uid);
        $postManager->deletePost($uid);

        $data = ['uid' => $uid];

        \Inspire\Helper\IOHelp::outputSuccess($response, $data, 'posts',
            'delete', $user);
    } catch (Exception $ex) {
        \Inspire\Helper\IOHelp::outputError($response, $ex->getMessage());
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
        $user    = \Inspire\Helper\IOHelp::getCurrentUser($request);

        $postManager = new \Inspire\Database\PostManager();
        $uid         = $request->param('uid');
        $file        = $postManager->getFile($uid);

        $response->file(DATA_PATH.$file['path'], $file['name']);
    } catch (Exception $ex) {
        \Inspire\Helper\IOHelp::outputError($response, $ex->getMessage());
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
        $user    = \Inspire\Helper\IOHelp::getCurrentUser($request);

        $params = $request->params();
        if (!empty($params['link'])) {
            $html = file_get_contents($params['link']);
            \Inspire\Helper\IOHelp::outputSuccess($response, $html, 'distant',
                'get', $user);
        } else {
            throw new \Exception('"link" value is required');
        }
    } catch (Exception $ex) {
        \Inspire\Helper\IOHelp::outputError($response, $ex->getMessage());
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
        $user    = \Inspire\Helper\IOHelp::getCurrentUser($request);

        $postManager = new \Inspire\Database\PostManager();
        $uid         = $request->param('uid');
        $file        = $postManager->getThumb($uid);

        $response->file(DATA_PATH.$file['path'], $file['name']);
    } catch (Exception $ex) {
        \Inspire\Helper\IOHelp::outputError($response, $ex->getMessage());
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
        \Inspire\Helper\IOHelp::outputError($response, $ex->getMessage());
    }
});

$klein->onHttpError(function ($code, $router) {
    $data     = 'Error '.$code;
    $response = $router->response();
    \Inspire\Helper\IOHelp::outputError($response, $data);
});

$klein->dispatch();
