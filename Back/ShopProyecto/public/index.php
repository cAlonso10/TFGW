<?php
require_once __DIR__ . '/../vendor/autoload.php';  
require_once __DIR__ . '/../app/config/database.php';
Database::initialize();
require_once __DIR__ . '/../app/routes/web.php';
?>