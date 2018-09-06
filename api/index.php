<?php

define('START_TIME', microtime(true));
$configFile = __DIR__.'/config.php';

// Config is created
if (file_exists($configFile)) {
    require_once $configFile;

    // Composer is initialized
    if (file_exists(__DIR__.'/vendor/autoload.php')) {
        require_once __DIR__.'/vendor/autoload.php';
        require_once __DIR__.'/system/app.php';

    // Composer not initialized
    } else {
        if (strstr($_SERVER['REQUEST_URI'], 'api/config.js') !== false) {
            header('Content-Type: application/javascript');
            echo 'alert("You must install composer.phar in the /api directory and run the command \"php composer.phar install\" or \"composer install\");';
        } else {
            header('Content-Type: application/json');
            echo '{"success":false,"message":"You must install composer.phar in the /api directory and run the command \"php composer.phar install\""}';
        }
        exit(0);
    }

// Config not found
} else {
    if (strstr($_SERVER['REQUEST_URI'], 'api/config.js') !== false) {
        header('Content-Type: application/javascript');
        echo 'alert("You must create the file api/config.php from the file api/config.sample.php");';
    } else {
        header('Content-Type: application/json');
        echo '{"success":false,"message":"You must create the file api/config.php from the file api/config.sample.php"}';
    }
    exit(0);
}
