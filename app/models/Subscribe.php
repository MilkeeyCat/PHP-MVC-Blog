<?php

namespace app\models;

class Subscribe extends \app\core\Model
{
    public function subscribe($data)
    {
        extract($data);
        $ip = $_SERVER['REMOTE_ADDR'];
        $this->db->row("INSERT INTO `newsletters_subscribers` (`usename`, `email`, `ip`) VALUES('$username', '$email', '$ip')");
    }
}