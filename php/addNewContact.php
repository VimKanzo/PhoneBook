<?php
include "config.php";

$full_name = $_GET['full_name'];
$email = $_GET['email'];
$phone = $_GET['phone'];
$address = $_GET['address'];
$validate = true;
$validationError = array();

if ($full_name === '') {
    $validate = false;
    $validationError[] = array(
        'target' => 'full_name_error', 
        'error'  => 'Full name is required'
    );
}

if ($email === '') {
    $validate = false;
    $validationError[] = array(
        'target' => 'email_error', 
        'error'  => 'Email Id is required'
    );
}

if ($phone !== '' && !is_numeric($phone)) {
    $validate = false;
    $validationError[] = array(
        'target' => 'phone_error', 
        'error'  => 'Phone number should be in numeric'
    );
}


if ($validate === true && mysql_query(
    "INSERT INTO contacts (full_name, email, phone, address) 
     VALUE('{$full_name}', '{$email}', '{$phone}', '{$address}')"
)) {
    exit(json_encode(array('success' => true, 'msg' => 'Saved!')));
} 

echo json_encode(array(
    'success' => false, 
    'msg'     => 'Error has occurred while entering the contacts into DB', 
    'validationError' => $validationError
));
