<?php

// TIMER
define('START_TIME', microtime(true));

// URL
define('FRONT_URL_ABS', 'http://localhost:8080');
define('ADMIN_URL_ABS', FRONT_URL_ABS . '/admin');
define('API_URL_ABS', 'http://inspire.local/api');

define('API_URL_REL', parse_url(API_URL_ABS, PHP_URL_PATH));

// PATH
define('API_PATH', __DIR__);
define('DATA_PATH', __DIR__ . '/data');

// Database
define('DB_FILE', DATA_PATH . '/list.sqlite');
define('DB_DSN_DATAS', 'sqlite:' . DB_FILE);
define('DB_USER', null);
define('DB_PASS', null);
define('DB_OPTIONS', null);

// Files
define('MAX_FILE_SIZE', 1000000); // Octets
define('THUMB_PIXELS', 512 * 1024);

// Params
define('CORS', FRONT_URL_ABS); // URL or false

// Add memory for ColorExtractor (very expensive tool)
ini_set('memory_limit', '-1');
