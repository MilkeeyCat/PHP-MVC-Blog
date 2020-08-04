<?php

namespace app\controllers;

class BaseRenderController extends \app\core\Controller
{
    public function render($vars = [])
    {
        $model = $this->loadModel('main');

        $categories = $model->getCategories();
        $popularPosts = $model->getPopularPosts(4);

        $this->view->render(array_merge([
            'categories' => $categories,
            'popularPosts' => $popularPosts
        ], $vars));
    }
}