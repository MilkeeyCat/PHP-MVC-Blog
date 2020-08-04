<?php

namespace app\controllers;

class CommentsController extends \app\core\Controller
{
    public function addAction()
    {

        $model = $this->loadModel('comments');
        $data = json_decode(file_get_contents('php://input'), true);

        preg_match('/(?P<articleId>[0-9])+$/', $_SERVER['HTTP_REFERER'], $matches);
        $data['articleId'] = $matches['articleId'];

        !intval(@$data['replyTo']) ? $data['replyTo'] = 'NULL' : true;

        $errors = [];

        if (!$data['name'] || trim($data['name']) == '') {
            $errors[] = 'Please enter your name';
        }
        if (!$data['email'] || trim($data['email']) == '') {
            $errors[] = 'Please enter your email address';
        }
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Please enter correct email address';
        }
        if (!$data['comment'] || trim($data['comment']) == '') {
            $errors[] = 'Please enter your comment text';
        }
        if (!$data['articleId']) {
            $errors[] = 'Unknown error';
        }



        if (empty($errors)) {

            $result = $model->createComment($data);
            beautifyDate($result);
            getAvatarByEmail($result);

            echo json_encode(['status' => 200, 'comment' => $result[0]]);
        } else {
            http_response_code(400);
            echo json_encode(['status' => 400, 'message' => $errors[0]]);
        }
    }

    public function showAction()
    {
        $model = $this->loadModel('comments');

        $comments = $model->getCommentsToArticle($this->route['articleId']);

        echo json_encode($comments);
    }
}