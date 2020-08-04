<?php

namespace app\controllers;

class SearchController extends \app\core\Controller
{
    public function searchAction()
    {
        $articles = [];
        $this->view->render([
            'articles' =>  $articles
        ]);
    }
}