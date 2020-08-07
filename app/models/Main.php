<?php

namespace app\models;

class Main extends \app\core\Model
{
    public function test()
    {
        return $this->db->row("
        SHOW TABLES;");
    }

    public function getPosts($posts_limit = 1)
    {
        $posts = $this->db->row("
			SELECT `articles`.*, `authors`.name author, `social_network_links`.links 
			FROM `articles`
			LEFT JOIN `authors` ON `authors`.id = `articles`.author_id
			LEFT JOIN `social_network_links` ON `social_network_links`.author_id = `authors`.id
			ORDER BY `articles`.id DESC
			LIMIT $posts_limit;");

        return finalizeData($posts);
    }

    public function getCategories()
    {
        $categories = $this->db->row("SELECT * FROM `articles_categories`;");
        foreach ($categories as &$category) {
            $category['articles_count'] = $this->db->row("SELECT COUNT(`category_id`) as 'articles_count' FROM `articles` WHERE `category_id` = {$category['id']}")[0]['articles_count'];
        }

        return $categories;
    }

    public function getPostById($id)
    {
        $post = $this->db->row("
			SELECT `articles`.*, `authors`.name author, `authors`.avatar, `authors`.description author_description, `social_network_links`.links, `articles_categories`.name category_name
			FROM `articles`
			LEFT JOIN `authors` ON `authors`.id = `articles`.author_id
			LEFT JOIN `social_network_links` ON `social_network_links`.author_id = `authors`.id
			LEFT JOIN `articles_categories` ON `articles_categories`.id = `articles`.category_id
			WHERE `articles`.id = $id;");

        finalizeData($post);

//        exit(debug($post));

        return $post;
    }

    public function getPopularPosts($postsLimit = 1)
    {
        $posts = $this->db->row("
            SELECT `articles`.*, `authors`.name author, `social_network_links`.links
            FROM `articles`
            LEFT JOIN `authors` ON `authors`.id = `articles`.author_id
			LEFT JOIN `social_network_links` ON `social_network_links`.author_id = `authors`.id
            ORDER BY `articles`.views DESC
            LIMIT $postsLimit;");

        return finalizeData($posts);
    }

    public function getPostsByCategory($id, $categoryId, $postsLimit = 1)
    {

        $posts = $this->db->row("
            SELECT `articles`.*, `authors`.name author, `articles_categories`.name category_name
            FROM `articles`
			LEFT JOIN `authors` ON `authors`.id = `articles`.author_id
			LEFT JOIN `articles_categories` ON `articles_categories`.id = $categoryId
			WHERE `articles`.category_id = $categoryId
            AND NOT `articles`.id = $id
			ORDER BY `articles`.id DESC
            LIMIT $postsLimit;");

        return finalizeData($posts);
    }

    public function getPostsByCategoryId($categoryId)
    {
        $posts = $this->db->row("
            SELECT `articles`.*, `authors`.name author, `articles_categories`.name category_name
            FROM `articles`
			LEFT JOIN `authors` ON `authors`.id = `articles`.author_id
			LEFT JOIN `articles_categories` ON `articles_categories`.id = $categoryId
			WHERE `articles`.category_id = $categoryId
			ORDER BY `articles`.id DESC");

        return finalizeData($posts);
    }

    public function incrementPostViews($id)
    {
        $this->db->row("
        UPDATE `articles` SET views = views + 1 
        WHERE id = $id");
    }

    public function searchPosts($query)
    {
        $query = urldecode($query);
        $posts = $this->db->row("
            SELECT * FROM `articles` WHERE `text` LIKE '%$query%' OR `title` LIKE '%$query%';");
//            SELECT * FROM `articles` WHERE `title` LIKE '%$query%';");
//        $postsByTitle = $this->db->row("
//            SELECT `articles`.*, `authors`.name author
//            FROM `articles`
//			LEFT JOIN `authors` ON `authors`.id = `articles`.author_id AND ");

        return $posts;
    }
}