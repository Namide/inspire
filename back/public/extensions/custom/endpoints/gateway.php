<?php

use Directus\Application\Http\Request;
use Directus\Application\Http\Response;

return [
    '' => [
        'method' => 'GET',
        'handler' => function (Request $request, Response $response) {

            // Enable only if you are connected
            if (!$this['auth']->check()) {
                return $response->withJson([
                    'error' => [
                        'code' => 300,
                        'message' => 'Not connected'
                    ]
                ]);
            }
            /*if (CORS) {
                $response->header('Access-Control-Allow-Origin', CORS);
            }*/
    
            $link = $request->getParam('link');

            /*return $response->withJson([
                'data' => [
                    $link,
                    'item 2'
                ]
            ]);*/
            if ($link != null) {
                $headers = get_headers($link);
                $html = file_get_contents($link, false);
                // \Inspire\Helper\IOHelp::outputSuccess($response, $html, 'distant', 'get', $user->getData());
                foreach ($headers as $key => $value) {
                    header($value);
                }
                echo $html;
                exit();
            } else {
                return $response->withJson([
                    'error' => ($link == null)
                ]);
            }

            // $html = file_get_contents($params['link']);
            // $body = stream_get_contents(fopen('https://google.fr/', "rb"));
            // return $response->withBody($body);

            /* try {
                $headers = $request->headers();
                $user    = \Inspire\Helper\IOHelp::getCurrentUser($request);
                $params = $request->params();
                if (!empty($params['link'])) {
                    $html = file_get_contents($params['link']);
                    \Inspire\Helper\IOHelp::outputSuccess($response, $html, 'distant',
                        'get', $user->getData());
                } else {
                    throw new \Exception('"link" value is required');
                }
            } catch (Exception $ex) {
                \Inspire\Helper\IOHelp::outputError($response, $ex->getMessage());
            } */

            return $response->withJson([
                'data' => [
                    'item 1',
                    'item 2'
                ]
            ]);
        }
    ]
];
