<?php $UPLOADS_DIR = "";
$filename = $_SERVER['HTTP_X_FILENAME'];

if ($filename) {
	file_put_contents($UPLOADS_DIR . $filename, file_get_contents('php://input'));
} ?>