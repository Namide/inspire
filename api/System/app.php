<?php

// use \Inspire\Helper\JsonHelp;

// https://github.com/klein/klein.php
$klein = new \Klein\Klein();

$klein->respond('GET', API_URL . '/', function()
{
    $data = array(
        'success' => 1,
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

    \Inspire\Helper\JsonHelp::PRINT_FROM_ARRAY($data);
});

$klein->respond('GET', API_URL . '/posts', function()
{
    $postManager = new \Inspire\Database\PostManager();
    $posts = $postManager->getPosts();
    $data = array(
        'success' => 1,
        'data' => $posts,
        'meta' => array(
            'name' => 'posts'
        )
    );

    \Inspire\Helper\JsonHelp::PRINT_FROM_ARRAY($data);
});

$klein->respond('POST', API_URL . '/posts', function($request, $response, $service, $app)
{
    $params = $request->paramsPost();
    
    $postManager = new \Inspire\Database\PostManager();
    $post = $postManager->addPost($params);
    
    
    $data = array(
        'success' => 1,
        'data' => $post,
        'meta' => array(
            'name' => 'post'
        )
    );

    \Inspire\Helper\JsonHelp::PRINT_FROM_ARRAY($data);
});

$klein->respond('GET', API_URL . '/posts/[i:id]', function ($request)
{
    $postManager = new \Inspire\Database\PostManager();
    $id = $request->param('id');
    $post = $postManager->getPost($id);
    
    $data = array(
        'success' => 1,
        'data' => $post,
        'meta' => array(
            'name' => 'posts'
        )
    );

    \Inspire\Helper\JsonHelp::PRINT_FROM_ARRAY($data);
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
$klein->onHttpError(function ($request)
{
     $data = array(
        'success' => 0,
        'message' => 'URL not found'
    );

    \Inspire\Helper\JsonHelp::PRINT_FROM_ARRAY($data);
});

$klein->dispatch();
