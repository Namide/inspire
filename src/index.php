<?php
/*
// If you need an API in other domain,
// Comment the include line and uncomment and inform the next lines
define('FRONT_URL_ABS', '/');
define('API_URL_ABS', 'https://inspire.local/api');
*/

require_once 'api/config.php';
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Inspire</title>
    <meta name="description" content="Tool to collect and storage or embed datas (URL, images, scripts, files, videos)">
    <link href="<?= FRONT_URL_ABS ?>/assets/css/build.css" rel="stylesheet">
    <script src="<?= API_URL_ABS ?>/config.js"></script>
  </head>
  <body>
    <div id="app"></div>
    <script type="text/javascript" src="<?= FRONT_URL_ABS ?>/assets/js/build.js"></script>
  </body>
</html>

