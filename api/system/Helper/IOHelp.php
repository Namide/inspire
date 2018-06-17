<?php
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Inspire\Helper;

/**
 * @author Damien Doussaud (namide.com)
 */
class IOHelp
{
    const TYPE_INT = 0;
    const TYPE_STR = 1;
    const TYPE_ARRAY = 2;

    /*private static function isAssociative(array $arr)
    {
        if (array() === $arr) {
            return false;
        }

        return array_keys($arr) !== range(0, count($arr) - 1);
    }

    private static function formatFilter(array $filters)
    {
        if (!self::isAssociative($filters)) {
            $newFilter = [];
            foreach ($filters as $value){
                $newFilter[$value] = [
                    '' => self::TYPE_STR,
                    '' => self::TYPE_STR
                ];
            }
            $filters = $newFilter;
        } else {
            foreach ($filters as $key => $value){
                if (empty($value['required'])) {
                    $value['required'] = true;
                }
                if (empty($value['type'])) {
                    $value['type'] = self::TYPE_STR;
                }
                $filters[$key] = $value;
            }
        }

        return $filters;
    }*/
    
    private static function formatValue($value, &$data)
    {
        $value = trim($value);
        switch ($data['type']) {
            case self::TYPE_INT:
                return (int) $value;
                break;
            case self::TYPE_ARRAY:
                return explode(',', $value);
                break;
            case self::TYPE_STR:
                return $value;
                break;
            default:
                return $value;
                break;
        }
    }

    private static function injectValue(&$out, &$request, $key, &$data)
    {
        if (!empty($request->param($key))) {
            $value = $request->param($key);
            $out[$key] = self::formatValue($value, $data);
        } elseif ($data['required']) {
            throw new \Exception('"'.$key.'" required');
        }
    }

    public static function outputSuccess(&$response, &$data, $subject, $action, $user = ['name' => 'Guest'])
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

    public static function outputError(&$response, $message = '')
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

    public static function getCurrentUser(&$request)
    {
        $headers = $request->headers();
        
        if (empty($headers['X-Access-Token'])) {
            return ['name' => 'Guest', 'role' => 0];
        }

        $token = $headers['X-Access-Token'];
        $userMan = new \Inspire\Database\UserManager();
        return $userMan->getUserByToken($token);
    }

    public static function getInputPost(&$request, &$filters)
    {
        // $filters = self::formatFilter($filters);
        $out = [];
        foreach ($filters as $key => $data) {
            self::injectValue($out, $request, $key, $data);
        }

        return $out;
    }

    public static function getInputTrail(&$request, $filters)
    {
        // $filters = self::formatFilter($filters);
        $argsStr = $request->param('trailing');
        $rawList = explode('/', $argsStr);

        // Fix array with 1 empty cell
        if (count($rawList) === 1 && empty($rawList[0])) {
            unset($rawList[0]);
        }

        if (count($rawList) % 2 === 1) {
            throw new \Exception('Filter trail must be a list of pair (keys, values)');
        }

        $out = [];
        for ($i = 0; $i < count($rawList); $i += 2) {
            $key   = $rawList[$i];
            $value = $rawList[$i + 1];

            if (!empty($filters[$key])) {
                $out[$key] = self::formatValue($value, $filters[$key]);
            } else {
                throw new \Exception('Filters must be only "'
                    .implode('", "', array_keys($filters)).'": "'
                    .$key.'" not accepted');
            }
        }

        return $out;
    }
}