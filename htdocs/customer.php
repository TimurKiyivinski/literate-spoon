<?php
include('model.php');
header('Content-Type: application/json');

class Customer extends Model {
    // XML file
    public static $xml_dir = "../data/customer.xml";
    // XML root tag
    public static $xml_root = "customers";
    // XML child tag
    public static $xml_child = "customer";
}

$POST = json_decode(file_get_contents('php://input'), true);

if (isset($POST['method'])) {
    // POST method handlers for register and login
    if ($POST['method'] == "register") {
        if (isset($POST['email']) &&
            isset($POST['fname']) &&
            isset($POST['lname']) &&
            isset($POST['password']) &&
            isset($POST['phone'])) {
            // Test if email exists
            $test_email = Customer::where('email', $POST['email']);
            if (! $test_email) {
                // Create customer if email is unique
                $customer = new Customer();
                $customer->id = uniqid(uniqid());
                $customer->email = $POST['email'];
                $customer->fname = $POST['fname'];
                $customer->lname = $POST['lname'];
                $customer->password = $POST['password'];
                $customer->phone = $POST['phone'];
                $customer->save();
                // Return customer id on success
                echo json_encode([
                    'err' => false,
                    'id' => $customer->id
                ]);
            } else {
                // Return error if email is not unique
                echo json_encode([
                    'err' => true,
                    'message' => 'Email already registered'
                ]);
            }
        }
    } else if ($POST['method'] == "login") {
        if (isset($POST['email']) &&
            isset($POST['password']) &&
            isset($POST['manager'])) {
            if ($POST['manager']) {
                // Manager login
            } else {
                // Customer login
                $customer = Customer::where('email', $POST['email']);
                if ($customer == false) {
                    // Return error if email is not registered
                    echo json_encode([
                        'err' => true,
                        'message' => 'Email is not registered in system'
                    ]);
                } else {
                    if ($POST['password'] == $customer->password) {
                        // Return customer id on success
                        echo json_encode([
                            'err' => false,
                            'id' => $customer->id
                        ]);
                    } else {
                        // Return error if password is wrong
                        echo json_encode([
                            'err' => true,
                            'message' => 'Invalid password'
                        ]);
                    }
                }
            }
        }
    }
} else {
    // Default GET method
    $customers = Customer::all();
    $data = [];
    foreach($customers as $customer) {
        $data[] = [
            'id' => $customer->id,
            'fname' => $customer->fname,
            'lname' => $customer->lname,
            'email' => $customer->email
        ];
    }
    echo json_encode([
        'err' => false,
        'data' => $data
    ]);
}
