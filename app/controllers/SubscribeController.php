<?php

namespace app\controllers;

class SubscribeController extends \app\core\Controller
{
    public function subscribeAction()
    {
        $model = $this->loadModel('subscribe');
        $data = json_decode(file_get_contents('php://input'), true);

        $errors = [];

        if (!$data['username'] || trim($data['username']) == '') {
            $errors[] = 'Please enter your name';
        }
        if (!$data['email'] || trim($data['email']) == '') {
            $errors[] = 'Please enter your email address';
        }
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Please enter correct email address';
        }

        if(empty($errors)) {
            $model->subscribe($data);

            echo json_encode(['status' => 200, 'message' => 'User is successfully subscribed!']);
        } else {
            echo json_encode(['status' => 400, 'message' => $errors[0]]);
        }
    }
}