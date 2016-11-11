<?php
include('model.php');
ini_set('auto_detect_line_endings', true);
header('Content-Type: application/json');

function read_csv($file_name)
{
    $csv = [];
    $csv_file = fopen($file_name, 'r');
    if ($csv_file !== false)
    {
        while (($row = fgetcsv($csv_file)) !== false)
        {
            $csv[] = $row;
        }
    }
    fclose($csv_file);
    return $csv;
}

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
                $managers = read_csv('../data/manager.txt');
                foreach ($managers as $manager) {
                    if ($POST['email'] == $manager[0]) {
                        if ($POST['password'] == $manager[1]) {
                            session_start();
                            $_SESSION['user_id'] = $manager[0];
                            $_SESSION['manager'] = true;
                            // Return manager id on success
                            echo json_encode([
                                'err' => false,
                                'id' => $manager[0],
                                'redirect' => 'processing.htm'
                            ]);
                        } else {
                            // Return error if password is wrong
                            echo json_encode([
                                'err' => true,
                                'message' => 'Invalid password'
                            ]);
                        }
                    }
                    return;
                }
                echo json_encode([
                    'err' => true,
                    'message' => 'Username is not registered in system'
                ]);
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
                        session_start();
                        $_SESSION['user_id'] = $customer->email;
                        $_SESSION['manager'] = false;
                        // Return customer id on success
                        echo json_encode([
                            'err' => false,
                            'id' => $customer->id,
                            'redirect' => 'buying.htm'
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
