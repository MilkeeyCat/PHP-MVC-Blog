<?php

namespace app\controllers;

class MainController extends \app\core\Controller
{
    public function indexAction()
    {
        $model = $this->loadModel('main');

        $mainPost = $model->getPosts()[0];
        $twoPosts = $model->getPosts(2);

        foreach ($twoPosts as &$post) {
            $post['text'] = mb_substr($post['text'], 0, 150) . '...';
        }

        $categories = $model->getCategories();

        $popularPosts = $model->getPopularPosts(4);

        $popularPosts2 = $model->getPosts(4);

        $this->view->render([
            'title' => 'Main Page',
            'mainPost' => $mainPost,
            'twoPosts' => $twoPosts,
            'categories' => $categories,
            'popularPosts' => $popularPosts,
            'popularPosts2' => $popularPosts2
        ]);
    }

    public function aboutMeAction()
    {
        $this->view->render();
    }
    public function contactUsAction()
    {
        $model = $this->loadModel('main');

        $popularPosts = $model->getPopularPosts(4);

        $this->view->render([
            'popularPosts' => $popularPosts
        ]);
    }
}