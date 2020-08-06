<?php

namespace app\controllers;

class SearchController extends \app\controllers\BaseRenderController
{
    public function searchAction()
    {
        $model = $this->loadModel('main');

        $posts = $model->searchPosts($this->route['searchQuery']);

        finalizeData($posts);

        $this->render([
            'posts' =>  $posts
        ], 'article/articlesById');
    }
}