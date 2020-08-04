<?php

function finalizeData($posts)
{
    foreach ($posts as &$post) {
        $post['text'] = mb_substr($post['text'], 0, 160) . '...';
        $post['pub_date'] = date("F j Y", strtotime($post['pub_date']));
        @$post['links'] = json_decode($post['links'], true);
    }

    return $posts;
}

function beautifyDate(&$data, $pubDateFieldName = 'pub_date')
{
    foreach ($data as &$dataItem) {
        $dataItem[$pubDateFieldName] = date("F j Y", strtotime($dataItem[$pubDateFieldName]));
    }

    return $data;
}

function getAvatarByEmail(&$data, $emailAddressFieldName = 'email')
{
    foreach ($data as &$dataItem) {
        $dataItem['avatar'] = 'http://gravatar.com/avatar/' . md5(strtolower(trim($dataItem[$emailAddressFieldName])));
    }

    return $data;
}