<?php

namespace Inspire\View;

class ConfigJS
{
    static function getJs()
    {
        $apiURLAbs   = API_URL_ABS;
        $frontURLAbs = FRONT_URL_ABS;
        // $adminURLAbs = ADMIN_URL_ABS;

        $apiURLRel   = API_URL_REL;
        $frontURLRel = parse_url($frontURLAbs, PHP_URL_PATH);
        // $adminURLRel = parse_url($adminURLAbs, PHP_URL_PATH);

        return <<<EOT
var config = {
    api: {
        abs: "$apiURLAbs",
        rel: "$apiURLRel"
    },
    front: {
        abs: "$frontURLAbs",
        rel: "$frontURLRel"
    }
}

// Add config to global variable
if (!window.inspire) window.inspire = { config: config };
else if (!window.inspire.config) window.inspire.config = config;

EOT;
    }
}