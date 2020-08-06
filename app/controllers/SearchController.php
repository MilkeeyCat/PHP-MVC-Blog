<?php

namespace app\controllers;

class SearchController extends \app\controllers\BaseRenderController
{
    public function searchAction()
    {
        $model = $this->loadModel('main');

        $searchQuery = $this->route['searchQuery'];

        if($searchQuery === '') {
            $this->view->redirect('/');
        }

        $posts = $model->searchPosts($searchQuery);

        finalizeData($posts);

        $this->render([
            'posts' =>  $posts,
            'searchQuery' => $searchQuery
        ], 'article/articlesById');
    }
}