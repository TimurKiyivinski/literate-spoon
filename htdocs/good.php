<?php
include('model.php');
header('Content-Type: application/json');

// Check session details
session_start();
if (! isset($_SESSION['user_id'])) {
    echo json_encode([
        'err' => true,
        'redirect' => 'login.htm'
    ]);
} else {
    class Good extends Model {
        // XML file
        public static $xml_dir = "../data/goods.xml";
        // XML root tag
        public static $xml_root = "goods";
        // XML child tag
        public static $xml_child = "good";
    }

    $POST = json_decode(file_get_contents('php://input'), true);

    if (isset($POST['method'])) {
        if ($POST['method'] == "add") {
            if (! $_SESSION['manager']) {
                echo json_encode([
                    'err' => true,
                    'message' => 'Access denied'
                ]);
                return;
            }
            if (isset($POST['name']) &&
                isset($POST['price']) &&
                isset($POST['quantity']) &&
                isset($POST['description'])) {
                // Create new goods listing
                $good = new Good();
                $good->id = uniqid(uniqid());
                $good->name = $POST['name'];
                $good->description = $POST['name'];
                $good->price = $POST['price'];
                $good->available = $POST['quantity'];
                $good->hold = 0;
                $good->sold = 0;
                $good->save();
                // Return customer id on success
                echo json_encode([
                    'err' => false,
                    'message' => 'The item has been listed in the system, and the item number is: ' . $good->id
                ]);
            }
        } else if ($POST['method'] == "cart") {
            if (isset($POST['id'])) {
                $good = Good::find($POST['id']);
                if ($good != false) {
                    if ($good->available > 0) {
                        $good->available = $good->available - 1;
                        $good->hold = $good->hold + 1;
                        $good->update();
                        echo json_encode([
                            'err' => false,
                            'data' => [
                                'id' => $good->id,
                                'name' => $good->name,
                                'description' => $good->description,
                                'price' => $good->price,
                                'available' => $good->available,
                                'hold' => $good->hold,
                                'sold' => $good->sold
                            ]
                        ]);
                    } else {
                        echo json_encode([
                            'err' => true,
                            'message' => 'Sorry this item is not available for sale'
                        ]);
                    }
                }
            }
        } else if ($POST['method'] == "remove") {
            if (isset($POST['id']) && isset($POST['quantity'])) {
                $good = Good::find($POST['id']);
                if ($good != false) {
                    $good->available = $good->available + $POST['quantity'];
                    $good->hold = $good->hold - $POST['quantity'];
                    $good->update();
                    echo json_encode([
                        'err' => false,
                        'data' => [
                            'id' => $good->id,
                            'name' => $good->name,
                            'description' => $good->description,
                            'price' => $good->price,
                            'available' => $good->available,
                            'hold' => $good->hold,
                            'sold' => $good->sold
                        ]
                    ]);
                }
            }
        } else if ($POST['method'] == "sell") {
            if (isset($POST['id']) && isset($POST['quantity'])) {
                $good = Good::find($POST['id']);
                if ($good != false) {
                    $good->hold = $good->hold - $POST['quantity'];
                    $good->sold = $good->sold + $POST['quantity'];
                    $good->update();
                    echo json_encode([
                        'err' => false,
                        'data' => [
                            'id' => $good->id,
                            'name' => $good->name,
                            'description' => $good->description,
                            'price' => $good->price,
                            'available' => $good->available,
                            'hold' => $good->hold,
                            'sold' => $good->sold
                        ]
                    ]);
                }
            }
        } else if ($POST['method'] == "process") {
            if (! $_SESSION['manager']) {
                echo json_encode([
                    'err' => true,
                    'message' => 'Access denied'
                ]);
                return;
            }
            $goods = Good::all();
            foreach ($goods as $good) {
                if ($good->available == 0 && $good->hold == 0) {
                    Good::delete($good->id);
                } else {
                    $good->sold = 0;
                    $good->update();
                }
            }
            echo json_encode([
                'err' => false
            ]);
        }
    } else {
        // Default GET method
        $goods = Good::all();
        $data = [];
        foreach($goods as $good) {
            $data[] = [
                'id' => $good->id,
                'name' => $good->name,
                'description' => $good->description,
                'price' => $good->price,
                'available' => $good->available,
                'hold' => $good->hold,
                'sold' => $good->sold
            ];
        }
        echo json_encode([
            'err' => false,
            'data' => $data
        ]);
    }
}
