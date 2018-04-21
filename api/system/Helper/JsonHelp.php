<?php

namespace Inspire\Helper;

/**
 * Description of JsonHelp
 *
 * @author Damien Doussaud (namide.com)
 */
class JsonHelp
{
    public static function GET_ERROR($msg)
    {
        $arr = array('error' => $msg);
        return JsonHelp::FROM_ARRAY($arr);
    }

    public static function TO_ARRAY($str)
    {
        return json_decode($str, true);
    }

    public static function FROM_ARRAY(array $datas)
    {
        $datas = self::TO_UTF8($datas);
        $out = json_encode($datas);

        switch (json_last_error())
        {
            case JSON_ERROR_NONE:
                break;
            case JSON_ERROR_DEPTH:
                return self::GET_ERROR('JSON error: Maximum stack depth exceeded.');
                break;
            case JSON_ERROR_STATE_MISMATCH:
                return self::GET_ERROR('JSON error: Underflow or the modes mismatch.');
                break;
            case JSON_ERROR_CTRL_CHAR:
                return self::GET_ERROR('JSON error: Unexpected control character found.');
                break;
            case JSON_ERROR_SYNTAX:
                return self::GET_ERROR('JSON error: Syntax error, malformed JSON.');
                break;
            case JSON_ERROR_UTF8:
                return self::GET_ERROR('JSON error: Malformed UTF-8 characters, possibly incorrectly encoded.');
                break;
            default:
                return self::GET_ERROR('JSON error: Unknown error.');
                break;
        }

        return $out;
    }

    public static function PRINT_FROM_ARRAY(array $data)
    {
        header('Content-Type: application/json');
        echo self::FROM_ARRAY($data);
        exit(0);
    }

    /**
     * Recursive convertor to URF8 for array
     * 
     * @param array|string $data
     * @return array|string
     */
    public static function TO_UTF8($data)
    {
        if (is_array($data))
        {
            foreach ($data as $key => $value)
            {
                $data[$key] = self::TO_UTF8($value);
            }

            return $data;
        }

        return ($data === '') ? '' : utf8_encode($data);
    }

}
