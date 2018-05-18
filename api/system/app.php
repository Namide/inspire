<?php


// https://github.com/klein/klein.php
$klein = new \Klein\Klein();

function send(&$response, &$data)
{
    if (CORS)
        $response->header('Access-Control-Allow-Origin', CORS);

    $response->json($data);
}

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
        $data = array(
            'success' => false,
            'message' => $ex->getMessage(),
            'meta' => array(
                'time' => microtime(true) - START_TIME . ' sec'
            )
        );
    }
    
    send($response, $data);
});

$klein->respond('GET', API_URL_REL . '/posts', function($request, $response, $service)
{
    try
    {
        $postManager = new \Inspire\Database\PostManager();
        $posts = $postManager->getPosts();
        $data = array(
            'success' => true,
            'data' => $posts,
            'meta' => array(
                'subject' => 'posts',
                'action' => 'get',
                'time' => microtime(true) - START_TIME . ' sec'
            )
        );
    }
    catch (Exception $ex)
    {
        $data = array(
            'success' => false,
            'message' => $ex->getMessage(),
            'meta' => array(
                'time' => microtime(true) - START_TIME . ' sec'
            )
        );
    }

    send($response, $data);
});

// Add post
$klein->respond('POST', API_URL_REL . '/posts', function($request, $response, $service)
{
    try
    {
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
                'time' => microtime(true) - START_TIME . ' sec'
            )
        );
    }
    catch (Exception $ex)
    {
        $data = array(
            'success' => false,
            'message' => $ex->getMessage(),
            'meta' => array(
                'time' => microtime(true) - START_TIME . ' sec'
            )
        );
    }

    send($response, $data);
});


// Update
$klein->respond('POST', API_URL_REL . '/posts/[i:uid]', function($request, $response, $service)
{
    try
    {
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
                'time' => microtime(true) - START_TIME . ' sec'
            )
        );
    }
    catch (Exception $ex)
    {
        $data = array(
            'success' => false,
            'message' => $ex->getMessage(),
            'meta' => array(
                'time' => microtime(true) - START_TIME . ' sec'
            )
        );
    }

    send($response, $data);
});


// Delete post
$klein->respond('GET', API_URL_REL . '/posts/delete/[i:uid]', function($request, $response, $service)
{
    try
    {
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
                'time' => microtime(true) - START_TIME . ' sec'
            )
        );
    }
    catch (Exception $ex)
    {
        $data = array(
            'success' => false,
            'message' => $ex->getMessage(),
            'meta' => array(
                'time' => microtime(true) - START_TIME . ' sec'
            )
        );
    }

    send($response, $data);
});

$klein->respond('GET', API_URL_REL . '/posts/[i:id]', function ($request, $response, $service)
{
    try
    {
        $postManager = new \Inspire\Database\PostManager();
        $id = $request->param('id');
        $post = $postManager->getPost($id);

        $data = array(
            'success' => 1,
            'data' => $post,
            'meta' => array(
                'subject' => 'post',
                'action' => 'get',
                'time' => microtime(true) - START_TIME . ' sec'
            )
        );
    }
    catch (Exception $ex)
    {
        $data = array(
            'success' => false,
            'message' => $ex->getMessage(),
            'meta' => array(
                'time' => microtime(true) - START_TIME . ' sec'
            )
        );
    }

    send($response, $data);
});

$klein->respond('GET', API_URL_REL . '/files/[i:uid]', function ($request, $response, $service, $app)
{
    // Todo
    if (CORS)
        $response->header('Access-Control-Allow-Origin', CORS);

    try
    {
        $postManager = new \Inspire\Database\PostManager();
        $uid = $request->param('uid');
        $file = $postManager->getFile($uid);
        
        $response->file( DATA_PATH . $file['path'], $file['name']);
    }
    catch (Exception $ex)
    {
        $data = array(
            'success' => false,
            'message' => $ex->getMessage(),
            'meta' => array(
                'time' => microtime(true) - START_TIME . ' sec'
            )
        );
      
        send($response, $data);
    }
});

$klein->respond('GET', API_URL_REL . '/thumbs/[i:uid]', function ($request, $response, $service, $app)
{
    // Todo
    if (CORS)
        $response->header('Access-Control-Allow-Origin', CORS);

    try
    {
        $postManager = new \Inspire\Database\PostManager();
        $uid = $request->param('uid');
        $file = $postManager->getThumb($uid);
        
        $response->file( DATA_PATH . $file['path'], $file['name']);
    }
    catch (Exception $ex)
    {
        $data = array(
            'success' => false,
            'message' => $ex->getMessage(),
            'meta' => array(
                'time' => microtime(true) - START_TIME . ' sec'
            )
        );
      
        send($response, $data);
    }
});

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
        $data = array(
            'success' => false,
            'message' => $ex->getMessage(),
            'meta' => array(
                'time' => microtime(true) - START_TIME . ' sec'
            )
        );
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
