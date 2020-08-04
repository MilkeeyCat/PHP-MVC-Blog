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
        $posts = $this->db->row("SELECT * FROM `articles`;");
        $posts = $this->db->row("
			SELECT `articles`.*, `authors`.name author, `authors`.avatar, `authors`.description author_description, `social_network_links`.links
			FROM `articles`
			LEFT JOIN `authors` ON `authors`.id = `articles`.author_id
			LEFT JOIN `social_network_links` ON `social_network_links`.author_id = `authors`.id
			WHERE `articles`.id = $id;");

        return finalizeData($posts);
    }

    public function getPopularPosts($posts_limit = 1)
    {
        $posts = $this->db->row("
            SELECT `articles`.*, `authors`.name author, `social_network_links`.links
            FROM `articles`
            LEFT JOIN `authors` ON `authors`.id = `articles`.author_id
			LEFT JOIN `social_network_links` ON `social_network_links`.author_id = `authors`.id
            ORDER BY `articles`.views DESC
            LIMIT $posts_limit;");

        return finalizeData($posts);
    }

    public function getPostsByCategory($id, $category_id, $posts_limit = 1)
    {

        $posts = $this->db->row("
            SELECT `articles`.*, `authors`.name author, `articles_categories`.name category_name
            FROM `articles`
			LEFT JOIN `authors` ON `authors`.id = `articles`.author_id
			LEFT JOIN `articles_categories` ON `articles_categories`.id = $category_id
			WHERE `articles`.category_id = $category_id
            AND NOT `articles`.id = $id
			ORDER BY `articles`.id DESC
            LIMIT $posts_limit;");

        return finalizeData($posts);
    }

    public function incrementPostViews($id)
    {
        $this->db->row("
        UPDATE `articles` SET views = views + 1 
        WHERE id = $id");
    }
}