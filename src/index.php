<?php
/*
// If you need an API in other domain,
// Comment the include line and uncomment and inform the next lines
define('FRONT_URL_ABS', '/');
define('API_URL_ABS', 'https://inspire.local/api');
*/

include_once('api/config.php');
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Inspire</title>
    <meta name="description" content="Tool to collect and storage or embed datas (URL, images, scripts, files, videos)">
    <!-- <link rel="stylesheet" type="text/css" href="<?= FRONT_URL_ABS ?>/assets/css/style.css"> -->
    <script src="<?= API_URL_ABS ?>/config.js"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
