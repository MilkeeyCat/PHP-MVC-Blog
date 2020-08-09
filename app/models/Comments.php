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

    private function getBaseComments($articleId, $limit, $startIndex)
    {
        $comments = $this->db->row("SELECT * FROM `comments` WHERE `reply_to` IS NULL AND `article_id` = $articleId ORDER BY `id` DESC LIMIT $startIndex, $limit;");

        foreach ($comments as $comment) {
            $this->getReplies($comment['id'], $comments);
        }

        return $comments;
    }

    private function getReplies($id, &$list)
    {
        $replyComments = $this->db->row("SELECT * FROM `comments` WHERE `reply_to` = $id ORDER BY `id` DESC;");

        foreach ($replyComments as $replyComment) {
            $list[] = $replyComment;

            $this->getReplies($replyComment['id'], $list);
        }
    }

    public function getCommentsToArticle($articleId)
    {
        $page = @$_GET['p'];
        $commentLimit = 10;
        $startIndex = intval($page) * $commentLimit;
        $comments = $this->getBaseComments($articleId, $commentLimit, $startIndex);

        $nextStartIndex = $startIndex + $commentLimit;

        $nextComments = $this->db->row("SELECT * FROM `comments` WHERE `reply_to` IS NULL AND `article_id` = $articleId ORDER BY `id` DESC LIMIT $nextStartIndex, $commentLimit;");

        getAvatarByEmail($comments);
        beautifyDate($comments);

        $result = ['comments' => $comments];

        if (!empty($nextComments) && count($comments) > $commentLimit) {
            $result['next'] = $_SERVER['REDIRECT_URL'] . '?p=' . strval(@$_GET['p'] + 1);
        }

        return $result;
    }
}