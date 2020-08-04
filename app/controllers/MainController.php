<?php

namespace app\controllers;

class MainController extends \app\controllers\BaseRenderController
{
    public function indexAction()
    {
        $model = $this->loadModel('main');

        $mainPost = $model->getPosts()[0];
        $twoPosts = $model->getPosts(2);

        foreach ($twoPosts as &$post) {
            $post['text'] = mb_substr($post['text'], 0, 150) . '...';
        }

        $popularPosts2 = $model->getPosts(4);

        $this->render([
            'title' => 'Main Page',
            'mainPost' => $mainPost,
            'twoPosts' => $twoPosts,
            'popularPosts2' => $popularPosts2
        ]);
    }

    public function aboutMeAction()
    {
        $this->render();
    }
    public function contactUsAction()
    {
        $this->render();
    }
}