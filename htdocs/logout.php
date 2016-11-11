<?php

session_start();
if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'err' => false,
        'id' => $_SESSION['user_id']
    ]);
    unset($_SESSION['user_id']);
    unset($_SESSION['manager']);
} else {
    echo json_encode([
        'err' => false,
        'message' => 'User not logged in'
    ]);
}
