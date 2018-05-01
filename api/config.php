<?php

// TIMER
define('START_TIME', microtime(true));

// URL and PATH
define('FRONT_URL', 'http://localhost:8080');
define('ADMIN_URL', FRONT_URL . '/admin');
define('API_URL', 'http://inspire.local/api');
define('API_URL_REL', '/api');

define('API_PATH', __DIR__);
define('DATA_PATH', __DIR__ . '/data');

// Database
define('DB_FILE', DATA_PATH . '/list.sqlite');
define('DB_DSN_DATAS', 'sqlite:' . DB_FILE);
define('DB_USER', null);
define('DB_PASS', null);
define('DB_OPTIONS', null);

// Files
define('MAX_FILE_SIZE', 1000000);

// Params
define('CORS', true);
