<?php

// https://github.com/klein/klein.php
$klein = new \Klein\Klein();

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
                'name' => 'routes'
            )
        );
    }
    catch (Exception $ex)
    {
        $data = array(
            'success' => false,
            'message' => $ex->getMessage()
        );
    }
    
    $response->json($data);
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
                'name' => 'posts'
            )
        );
    }
    catch (Exception $ex)
    {
        $data = array(
            'success' => false,
            'message' => $ex->getMessage()
        );
    }

    $response->json($data);
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
                'name' => 'post'
            )
        );
    }
    catch (Exception $ex)
    {
        $data = array(
            'success' => false,
            'message' => $ex->getMessage()
        );
    }

    $response->json($data);
});

$klein->respond('GET', API_URL . '/files/[i:id]', function ($request, $response, $service, $app)
{
    // Todo
    $response->file($path, $filename = null);
    // $response->json($data);
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
        'message' => 'Error ' . $code
    );
    
    $router->response()->json($data);
});

$klein->dispatch();