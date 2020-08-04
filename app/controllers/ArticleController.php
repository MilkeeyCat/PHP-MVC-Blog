<?php

namespace app\controllers;

class ArticleController extends \app\core\Controller
{
	public function mainAction()
	{
		$model = $this->loadModel('main');
		$commentsModel = $this->loadModel('comments');

		$articleId = $this->route['id'];

		$model->incrementPostViews($articleId);

		$post = @$model->getPostById($articleId)[0];

		$popularPosts = $model->getPopularPosts(4);

        $categories = $model->getCategories();

        $samePostsByCategory = $model->getPostsByCategory($articleId, $post['category_id'], 3);

		foreach ($samePostsByCategory as $catPost) {
		    $catPost['text'] = mb_substr($post['text'], 0, 26) . '...';
        }

		if(empty($post)) {
			$this->view->path = 'errors/404/article_404';
			$this->view->render();
		}

		$this->view->render([
		    'categories' => $categories,
			'popularPosts' => $popularPosts,
			'post' => $post,
            'samePostsByCategory' => $samePostsByCategory,
		]);
	}
}