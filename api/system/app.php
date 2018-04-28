<?php


// https://github.com/klein/klein.php
$klein = new \Klein\Klein();

function send(&$response, &$data)
{
    if (CORS)
        $response->header('Access-Control-Allow-Origin', '*');

    $response->json($data);
}

$klein->respond('GET', API_URL . '/', function($request, $response, $service)
{
    try
    {
        $data = array(
            'success' => true,
            'data' => array(
                'post' => API_URL . '/posts',
                'group' => API_URL . '/groups',
                'item' => API_URL . '/item/{uid}',
                'rss' => API_URL . '/rss'
            ),
            'meta' => array(
                'name' => 'routes',
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

$klein->respond('GET', API_URL . '/posts', function($request, $response, $service)
{
    try
    {
        $postManager = new \Inspire\Database\PostManager();
        $posts = $postManager->getPosts();
        $data = array(
            'success' => true,
            'data' => $posts,
            'meta' => array(
                'name' => 'posts',
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

$klein->respond('POST', API_URL . '/posts', function($request, $response, $service)
{
    try
    {
        $params = $request->paramsPost();
        $postManager = new \Inspire\Database\PostManager();
        $post = $postManager->addPost($params);

        $data = array(
            'success' => true,
            'data' => $post,
            'meta' => array(
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

$klein->respond('PUT', API_URL . '/posts', function($request, $response, $service)
{
    try
    {
        $params = $request->paramsPost();
        $postManager = new \Inspire\Database\PostManager();
        $post = $postManager->updatePost($params);

        $data = array(
            'success' => true,
            'data' => $post,
            'meta' => array(
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

$klein->respond('GET', API_URL . '/posts/[i:id]', function ($request, $response, $service)
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

$klein->respond('GET', API_URL . '/files/[i:id]', function ($request, $response, $service, $app)
{
    // Todo
    if (CORS)
        $response->header('Access-Control-Allow-Origin', '*');

    $response->file($path, $filename = null);
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
    
    $router->response()->json($data);
});

$klein->dispatch();
