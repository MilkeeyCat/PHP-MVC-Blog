<?php

namespace app\models;

class Comments extends \app\core\Model
{
    public function createComment($data)
    {
        extract($data);

        $ip = $_SERVER['REMOTE_ADDR'];

        $result = $this->db->row("
        INSERT INTO `comments` (`name`, `email`, `text`, `ip`, `article_id`, `reply_to`) VALUES('$name', '$email', '$comment', '$ip', $articleId, $replyTo)");

        return $this->db->row('SELECT * FROM `comments` ORDER BY `id` DESC LIMIT 1;');
    }

    public function getCommentsToArticle($articleId)
    {
        $result = $this->db->row("
        SELECT * FROM `comments` WHERE `article_id` = $articleId;");

        getAvatarByEmail($result);
        beautifyDate($result);

        return $result;
    }
}