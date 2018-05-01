<?php

namespace Inspire\Vue;

class ConfigJS
{
    static function getJs()
    {
        $apiURL = API_URL;
        $frontURL = FRONT_URL;
        $adminURL = ADMIN_URL;
        
        return <<<EOT
var config = {
    api: {
        root: "$apiURL"
    },
    front: {
        root: "$frontURL"
    },
    admin: {
        root: "$adminURL"
    }
}

// Add config to global variable
if (!window.inspire) window.inspire = { config: config };
else if (!window.inspire.config) window.inspire.config = config;
EOT;
    }
}
