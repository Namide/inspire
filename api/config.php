<?php

// TIMER
define('START_TIME', microtime(true));

// URL and PATH
define('API_URL', '/api');
define('API_PATH', __DIR__);
define('DATA_URL', '/api/data');
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
