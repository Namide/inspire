<?php
$configFile = __DIR__.'/config.php';
if (file_exists($configFile)) {
    require_once $configFile;
    require_once __DIR__.'/vendor/autoload.php';
    require_once __DIR__.'/system/app.php';
} else {
    header('Content-Type: application/json');
    echo '{"success":false,"message":"You must create the file api/config.php from the file api/config.sample.php"}';
    exit(0);
}