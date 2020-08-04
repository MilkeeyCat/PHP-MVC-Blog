<?php

return [
    '(?:\?.*)?' => [
        'controller' => 'main',
        'action' => 'index'
    ],
    'article/(?P<id>[0-9]+)' => [
		'controller' => 'article',
		'action' => 'main'    	
    ],
    'leave-comment' => [
        'controller' => 'comments',
        'action' => 'add'
    ],
    'comments-list/(?P<articleId>[0-9]+)' => [
        'controller' => 'comments',
        'action' => 'show'
    ],
    'about-me' => [
        'controller' => 'main',
        'action' => 'aboutMe'
    ],
    'contact-us' => [
        'controller' => 'main',
        'action' => 'contactUs'
    ],
    'search\?q=(?P<searchQuery>.+)' => [
        'controller' => 'search',
        'action' => 'search'
    ],
    'subscribe' => [
        'controller' => 'subscribe',
        'action' => 'subscribe'
    ]
];
