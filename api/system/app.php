<?php


// https://github.com/klein/klein.php
$klein = new \Klein\Klein();

function send(&$response, &$data)
{
    if (CORS)
        $response->header('Access-Control-Allow-Origin', CORS);

    $response->json($data);
}

function getUser($token = false)
{
    if ($token)
    {
        $userManager = new \Inspire\Database\UserManager();
        return $userManager->getUserByToken($token);
    }
    
    return [ 'name' => 'Guest', 'role' => 0 ];
}

function getErrorData($message = '')
{
    return [
        'success' => false,
        'message' => $message,
        'meta' => array(
            'time' => microtime(true) - START_TIME . ' sec'
        )
    ];
}

// Get routes
$klein->respond('GET', API_URL_REL . '/', function($request, $response, $service)
{
    try
    {
        $data = array(
            'success' => true,
            'data' => array(
                'post' => API_URL_REL . '/posts',
                'group' => API_URL_REL . '/groups',
                'item' => API_URL_REL . '/item/{uid}',
                'rss' => API_URL_REL . '/rss'
            ),
            'meta' => array(
                'subject' => 'routes',
                'action' => 'get',
                'time' => microtime(true) - START_TIME . ' sec'
            )
        );
    }
    catch (Exception $ex)
    {
        $data = getErrorData($ex->getMessage());
    }
    
    send($response, $data);
});

/*
 * AUTH
 */
$klein->with(API_URL_REL . '/auth', function () use ($klein)
{
    $klein->respond('POST', '/signin', function ($request, $response, $service)
    {
        try
        {
            $mail = $request->param('mail');
            $pass = $request->param('pass');
        
            if (empty($mail) || empty($pass))
                throw new \Exception('"mail" and "pass" required');
            
          
            $userManager = new \Inspire\Database\UserManager();
            $user = $userManager->getUserBySignIn($mail, $pass);
            $userMetaData = $user;
            unset($userMetaData['token']);
            $data = array(
                'success' => true,
                'data' => $user,
                'meta' => array(
                    'subject' => 'user',
                    'action' => 'signin',
                    'user' => $userMetaData,
                    'time' => microtime(true) - START_TIME . ' sec'
                )
            );
        }
        catch (Exception $ex)
        {
            $data = getErrorData($ex->getMessage());
        }

        send($response, $data);
    });
    
    $klein->respond('GET', '/signout', function ($request, $response, $service)
    {
        try
        {
            $headers = $request->headers();
            $token = $headers['X-Access-Token'];
        
            $userManager = new \Inspire\Database\UserManager();
            $user = $userManager->signout($token);
            $data = array(
                'success' => true,
                'data' => $user,
                'meta' => array(
                    'subject' => 'user',
                    'action' => 'signout',
                    'user' => $user,
                    'time' => microtime(true) - START_TIME . ' sec'
                )
            );
        }
        catch (Exception $ex)
        {
            $data = getErrorData($ex->getMessage());
        }

        send($response, $data);
    });
    
    /*$klein->respond('GET', '/testtoken', function ($request, $response) use ($inspireJwt) {
        try {
            $headers = $request->headers();
            $data=$inspireJwt->dumptoken($headers['X-Access-Token']);
        } catch (Exception $ex) {
            $data = array(
                'success' => false,
                'message' => $ex->getMessage(),
                );
        }
        send($response, $data);
    });*/
    
    /*$klein->respond('GET', '/exemple', function ($request, $response) {
        echo 'exemple';
    });*/
});


/*
 * USER
 */
$klein->with(API_URL_REL . '/users', function () use ($klein)
{
    $klein->respond('POST', '/add', function ($request, $response, $service)
    {
        try
        {
            $mail = trim($request->param('mail'));
            $name = trim($request->param('name'));
            $role = trim($request->param('role'));
        
            if (empty($mail) || empty($name))
                throw new \Exception('"mail" and "name" required');
            
            if (empty($role))
                $role = 1;
            
            $headers = $request->headers();
            $userManager = new \Inspire\Database\UserManager();
            
            $newUserData = [
                'mail' => $mail,
                'name' => $name,
                'role' => $role
            ];
            $user = empty($headers['X-Access-Token']) ? getUser() : getUser($headers['X-Access-Token']);
            $newUser = $userManager->addUser($newUserData, $user);
            $data = [
                'success' => true,
                'data' => $newUser,
                'meta' => array(
                    'subject' => 'user',
                    'action' => 'signup',
                    'user' => $user,
                    'time' => microtime(true) - START_TIME . ' sec'
                )
            ];
        }
        catch (Exception $ex)
        {
            $data = getErrorData($ex->getMessage());
        }

        send($response, $data);
    });
        
    /*$klein->respond('GET', '/testtoken', function ($request, $response) use ($inspireJwt) {
        try {
            $headers = $request->headers();
            $data=$inspireJwt->dumptoken($headers['X-Access-Token']);
        } catch (Exception $ex) {
            $data = array(
                'success' => false,
                'message' => $ex->getMessage(),
                );
        }
        send($response, $data);
    });*/
    
    /*$klein->respond('GET', '/exemple', function ($request, $response) {
        echo 'exemple';
    });*/
});

// Get posts
$klein->respond('GET', API_URL_REL . '/posts/[*:trailing]?', function ($request, $response, $service)
{
    try
    {
        $headers = $request->headers();
        $user = empty($headers['X-Access-Token']) ? getUser() : getUser($headers['X-Access-Token']);
        
        $argsStr = $request->param('trailing');
        $rawList = explode('/', $argsStr);

        // Fix array with 1 empty cell
        if (count($rawList) === 1 && empty($rawList[0]))
            unset($rawList[0]);
        
        if (count($rawList) % 2 === 1)
            throw new Exception('List of data after posts must be pair');

        $argObj = array();
        for ($i = 0; $i < count($rawList); $i += 2)
        {
            $key = $rawList[$i];
            $rawValue = $rawList[$i + 1];
            switch($key)
            {
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
                            . '"tags", "types", "notags", "notypes", "limit" and "offset", "'
                            . $key . '" not accepted');
            }
            
            $argObj[$key] = $value;
        }

        $postManager = new \Inspire\Database\PostManager();
        $posts = $postManager->getPosts($argObj);
        $data = array(
            'success' => true,
            'data' => $posts,
            'meta' => array(
                'subject' => 'posts',
                'action' => 'get',
                'user' => $user,
                'time' => microtime(true) - START_TIME . ' sec'
            )
        );
    }
    catch (Exception $ex)
    {
        $data = getErrorData($ex->getMessage());
    }

    send($response, $data);
});  

// Add post
$klein->respond('POST', API_URL_REL . '/posts', function($request, $response, $service)
{
    try
    {
        $headers = $request->headers();
        $user = empty($headers['X-Access-Token']) ? getUser() : getUser($headers['X-Access-Token']);
        
        $postManager = new \Inspire\Database\PostManager();
        
        $params = $request->params();
        
        // Save file
        if (!empty($_FILES['content_file']))
        {
            $fileData = $postManager->saveFile($_FILES['content_file']);
            $params['content_file'] = Inspire\Helper\JsonHelp::FROM_ARRAY($fileData);
        }
        
        // Save thumb
        if (!empty($_FILES['thumb']))
        {
            $thumbData = $postManager->saveThumb($_FILES['thumb']);
            $params['thumb'] = Inspire\Helper\JsonHelp::FROM_ARRAY($thumbData);
        }
        // Create thumb from file
        elseif (!empty($fileData) && !empty(strpos($fileData['type'], 'image') !== false))
        {
            $thumbData = $postManager->createThumbFromImage(DATA_PATH . $fileData['path']);
            $params['thumb'] = Inspire\Helper\JsonHelp::FROM_ARRAY($thumbData);
        }
           
        
        $post = $postManager->addPost($params);

        $data = array(
            'success' => true,
            'data' => $post,
            'meta' => array(
                'subject' => 'posts',
                'action' => 'add',
                'name' => 'post',
                'user' => $user,
                'time' => microtime(true) - START_TIME . ' sec'
            )
        );
    }
    catch (Exception $ex)
    {
        $data = getErrorData($ex->getMessage());
    }

    send($response, $data);
});


// Update post
$klein->respond('POST', API_URL_REL . '/posts/[i:uid]', function($request, $response, $service)
{
    try
    {
        $headers = $request->headers();
        $user = empty($headers['X-Access-Token']) ? getUser() : getUser($headers['X-Access-Token']);
        
        $postManager = new \Inspire\Database\PostManager();
        // $params = $request->paramsPost();
        $uid = $request->param('uid');
        
        
        $params = $request->params();
        
        // Update file
        if (!empty($_FILES['content_file']))
        {
            $postManager->removeFile($uid);
            $fileData = $postManager->saveFile($_FILES['content_file']);
            $params['content_file'] = Inspire\Helper\JsonHelp::FROM_ARRAY($fileData);
        }
        
        // Update thumb
        if (!empty($_FILES['thumb']))
        {
            $postManager->removeThumb($uid);
            $thumbData = $postManager->saveThumb($_FILES['thumb']);
            $params['thumb'] = Inspire\Helper\JsonHelp::FROM_ARRAY($thumbData);
        }
        // Update thumb from file
        elseif (!empty($fileData) && !empty(strpos($fileData['type'], 'image') !== false))
        {
            $postManager->removeThumb($uid);
            $thumbData = $postManager->createThumbFromImage(DATA_PATH . $fileData['path']);
            $params['thumb'] = Inspire\Helper\JsonHelp::FROM_ARRAY($thumbData);
        }
        
        // Update post
        $post = $postManager->updatePost($uid, $params);

        $data = array(
            'success' => true,
            'data' => $post,
            'meta' => array(
                'subject' => 'post',
                'action' => 'edit',
                'user' => $user,
                'time' => microtime(true) - START_TIME . ' sec'
            )
        );
    }
    catch (Exception $ex)
    {
        $data = getErrorData($ex->getMessage());
    }

    send($response, $data);
});

// Delete post
$klein->respond('GET', API_URL_REL . '/posts/delete/[i:uid]', function($request, $response, $service)
{
    try
    {
        $headers = $request->headers();
        $user = empty($headers['X-Access-Token']) ? getUser() : getUser($headers['X-Access-Token']);
        
        $uid = $request->param('uid');
        $postManager = new \Inspire\Database\PostManager();
        $postManager->removeThumb($uid);
        $postManager->removeFile($uid);
        $postManager->deletePost($uid);

        $data = array(
            'success' => true,
            'data' => array('uid' => $uid),
            'meta' => array(
                'subject' => 'post',
                'action' => 'delete',
                'user' => $user,
                'time' => microtime(true) - START_TIME . ' sec'
            )
        );
    }
    catch (Exception $ex)
    {
        $data = getErrorData($ex->getMessage());
    }

    send($response, $data);
});   

// Get post
$klein->respond('GET', API_URL_REL . '/posts/[i:id]', function ($request, $response, $service)
{
    try
    {
        $headers = $request->headers();
        $user = empty($headers['X-Access-Token']) ? getUser() : getUser($headers['X-Access-Token']);
        
        $postManager = new \Inspire\Database\PostManager();
        $id = $request->param('id');
        $post = $postManager->getPost($id);

        $data = array(
            'success' => true,
            'data' => $post,
            'meta' => array(
                'subject' => 'post',
                'action' => 'get',
                'user' => $user,
                'time' => microtime(true) - START_TIME . ' sec'
            )
        );
    }
    catch (Exception $ex)
    {
        $data = getErrorData($ex->getMessage());
    }

    send($response, $data);
});

// Get file
$klein->respond('GET', API_URL_REL . '/files/[i:uid]', function ($request, $response, $service, $app)
{
    // Todo
    if (CORS)
        $response->header('Access-Control-Allow-Origin', CORS);

    try
    {
        $headers = $request->headers();
        $user = empty($headers['X-Access-Token']) ? getUser() : getUser($headers['X-Access-Token']);
        
        $postManager = new \Inspire\Database\PostManager();
        $uid = $request->param('uid');
        $file = $postManager->getFile($uid);
        
        $response->file(DATA_PATH . $file['path'], $file['name']);
    }
    catch (Exception $ex)
    {
        $data = getErrorData($ex->getMessage());
        send($response, $data);
    }
});

// Get distant content
$klein->respond('POST', API_URL_REL . '/distant-link', function ($request, $response, $service, $app)
{
    // Todo
    if (CORS)
        $response->header('Access-Control-Allow-Origin', CORS);

    try
    {
        $headers = $request->headers();
        $user = empty($headers['X-Access-Token']) ? getUser() : getUser($headers['X-Access-Token']);
        
        $params = $request->params();
        if (!empty($params['link']))
        {
            $html = file_get_contents($params['link']);
            $data = array(
                'success' => true,
                'data' => $html,
                'meta' => array(
                    'subject' => 'distant',
                    'action' => 'get',
                    'user' => $user,
                    'time' => microtime(true) - START_TIME . ' sec'
                )
            );
        }
        else
        {
            throw new \Exception('"link" value is required');
        }
    }
    catch (Exception $ex)
    {
        $data = getErrorData($ex->getMessage());
    }
    
    send($response, $data);
});

// Get thumb
$klein->respond('GET', API_URL_REL . '/thumbs/[i:uid]', function ($request, $response, $service, $app)
{
    // Todo
    if (CORS)
        $response->header('Access-Control-Allow-Origin', CORS);

    try
    {
        $headers = $request->headers();
        $user = empty($headers['X-Access-Token']) ? getUser() : getUser($headers['X-Access-Token']);
        
        $postManager = new \Inspire\Database\PostManager();
        $uid = $request->param('uid');
        $file = $postManager->getThumb($uid);
        
        $response->file( DATA_PATH . $file['path'], $file['name']);
    }
    catch (Exception $ex)
    {
        $data = getErrorData($ex->getMessage());
        send($response, $data);
    }
});

// Get config.js
$klein->respond('GET', API_URL_REL . '/config.js', function($request, $response, $service)
{
    try
    {
        if (CORS)
            $response->header('Access-Control-Allow-Origin', CORS);
        
        $body = Inspire\Vue\ConfigJS::getJs();
        $response->header('Content-Type', 'application/javascript');
        $response->body($body);
    }
    catch (Exception $ex)
    {
        $data = getErrorData($ex->getMessage());
        send($response, $data);
    }
});

/* $klein->respond('POST', '/posts', $callback);
$klein->respond('PUT', '/posts/[i:id]', $callback);
$klein->respond('DELETE', '/posts/[i:id]', $callback);
$klein->respond('OPTIONS', null, $callback);*/

// To match multiple request methods:
// $klein->respond(array('POST','GET'), $route, $callback);

// Or you might want to handle the requests in the same place
/*$klein->respond('/posts/[create|edit:action]?/[i:id]?', function ($request, $response) {
    switch ($request->action) {
        //
    }
});*/

/*
$klein->respond('*', function ()
{
    $data = array(
        'success' => 0,
        'message' => 'URL not found'
    );

    \Inspire\Helper\JsonHelp::PRINT_FROM_ARRAY($data);
});
*/
$klein->onHttpError(function ($code, $router)
{
    $data = array(
        'success' => false,
        'message' => 'Error ' . $code,
        'meta' => array(
            'time' => microtime(true) - START_TIME . ' sec'
        )
    );
    
    $response = $router->response();
    send($response, $data);
});

$klein->dispatch();
