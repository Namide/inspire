<?php

namespace Inspire\Database;

class PostManager extends \Inspire\Database\DataManager
{

    public function removeFile($uid)
    {
        $request = 'SELECT `content_file` FROM `post`'
            .' INNER JOIN `uid` ON post.id = uid.item_id'
            .' WHERE uid.item_name = "post" AND uid.id = :uid';
        $binds   = [[':uid', $uid, \PDO::PARAM_INT]];
        $post    = $this->_database->FETCH($request, $binds);

        if ($post != false && !empty($post['content_file'])) {
            $fileData = \Inspire\Helper\JsonHelp::TO_ARRAY($post['content_file']);
            $path     = DATA_PATH.$fileData['path'];

            if (\Inspire\Helper\FileHelp::DEL_FILE($path)) {
                $update = 'UPDATE `post`';
                $set    = ' SET `content_file` = null';
                $where  = ' WHERE `id` = (SELECT `item_id` FROM `uid` WHERE `id` = :uid AND `item_name` = "post")';
                $this->_database->EXECUTE($update.$set.$where, $binds);

                return true;
            }
        }

        return false;
    }

    public function removeThumb($uid)
    {
        $request = 'SELECT `thumb` FROM `post`'
            .' INNER JOIN `uid` ON post.id = uid.item_id'
            .' WHERE uid.item_name = "post" AND uid.id = :uid';
        $binds   = [[':uid', $uid, \PDO::PARAM_INT]];
        $post    = $this->_database->FETCH($request, $binds);

        if ($post != false && !empty($post['thumb'])) {
            $fileData = \Inspire\Helper\JsonHelp::TO_ARRAY($post['thumb']);
            $path     = DATA_PATH.$fileData['path'];

            if (\Inspire\Helper\FileHelp::DEL_FILE($path)) {
                $update = 'UPDATE `post`';
                $set    = ' SET `thumb` = null';
                $where  = ' WHERE `id` = (SELECT `item_id` FROM `uid` WHERE `id` = :uid AND `item_name` = "post")';
                $this->_database->EXECUTE($update.$set.$where, $binds);

                return true;
            }
        }

        return false;
    }

    public function deletePost($uid)
    {
        $delete = 'DELETE FROM `post`';
        $where  = ' WHERE `id` = (SELECT `item_id` FROM `uid` WHERE `id` = :uid AND `item_name` = "post")';
        $binds  = [[':uid', $uid, \PDO::PARAM_INT]];
        $this->_database->EXECUTE($delete.$where, $binds);

        $this->deleteUID($uid);

        return true;
    }

    public function updatePost($uid, &$data)
    {
        $rowList = [];
        $binds   = [[':uid', (int) $uid, \PDO::PARAM_INT]];

        self::formatInputData($data, $rowList, $binds);

        if (count($binds) > 1) {
            $update = 'UPDATE `post`';
            $set    = ' SET ';
            foreach ($rowList as $row) {
                $set .= '`'.$row.'` = :'.$row.', ';
            }
            $set   = substr($set, 0, -2);
            $where = ' WHERE `id` = (SELECT uid.item_id FROM `uid` WHERE uid.id = :uid AND uid.item_name = "post")';


            $this->_database->EXECUTE($update.$set.$where, $binds);
        }


        // Update tags
        if (!empty($data['tags'])) {
            $tagList = explode(',', $data['tags']);

            $tagManager = new \Inspire\Database\TagManager();
            $tagManager->removeTagsOfItem($uid);
            $tagManager->addTags($uid, $tagList);
            $tagManager->cleanTags();
        }


        // Update types
        if (!empty($data['types'])) {
            $typeList = explode(',', $data['types']);

            $typeManager = new \Inspire\Database\TypeManager();
            $typeManager->removeTypesOfItem($uid);
            $typeManager->addTypes($uid, $typeList);
            $typeManager->cleanTypes();
        }


        $post = $this->getPost($uid);
        return $post;
    }

    public function createThumbFromImage($image)
    {
        $file = \Inspire\Helper\FileHelp::CREATE_THUMB($image,
                DATA_PATH.'/thumb/'.basename($image));
        $json = [
            'path' => str_replace(DATA_PATH, '', $file)
        ];
        $json = \Inspire\Helper\FileHelp::SET_FILE_DATA($file, $json, true);

        return $json;
    }

    public function saveThumb($thumbUpload)
    {
        $file = \Inspire\Helper\FileHelp::SAVE_FILE_POST($thumbUpload,
                DATA_PATH.'/thumb/');

        $json = [
            'type' => $thumbUpload['type'],
            'name' => $thumbUpload['name'],
            'size' => $thumbUpload['size'],
            'path' => str_replace(DATA_PATH, '', $file)
        ];

        $json = \Inspire\Helper\FileHelp::SET_FILE_DATA($file, $json, true);

        return $json;
    }

    public function saveFile($fileUpload)
    {
        $file = \Inspire\Helper\FileHelp::SAVE_FILE_POST($fileUpload,
                DATA_PATH.'/'.$fileUpload['type']);

        $json = [
            'type' => $fileUpload['type'],
            'name' => $fileUpload['name'],
            'size' => $fileUpload['size'],
            'path' => str_replace(DATA_PATH, '', $file)
        ];

        $json = \Inspire\Helper\FileHelp::SET_FILE_DATA($file, $json);

        return $json;
    }

    public function addPost($data)
    {
        $rowList = [];
        $binds   = [];

        self::formatInputData($data, $rowList, $binds);
        // self::formatInputFileAndSave($data, $rowList, $binds);


        if (count($binds) < 1) {

            throw new \Exception('POST data not founds');
        }


        $insert = 'INSERT INTO `post`';
        $rows   = ' (`'.implode('`, `', $rowList).'`)';
        $values = ' VALUES (:'.implode(', :', $rowList).')';
        $this->_database->EXECUTE($insert.$rows.$values, $binds);

        // Get post ID and UID
        $postId = (integer) $this->_database->GET_LAST_INSERT_ID();
        $uid    = $this->addUID('post', $postId);

        // Add tags
        if (isset($data['tags'])) {
            $tagList = explode(',', $data['tags']);

            $tagManager = new \Inspire\Database\TagManager();
            $tagManager->addTags($uid, $tagList);
        }

        // Add types
        if (isset($data['types'])) {
            $typeList = explode(',', $data['types']);

            $typeManager = new \Inspire\Database\TypeManager();
            $typeManager->addTypes($uid, $typeList);
        }

        // Return post
        $post = $this->getPost($uid);
        return $post;
    }

    public function getPost($uid)
    {
        $rq      = self::$_POST_REQUEST;
        $where   = ' WHERE uid.id = :uid AND uid.item_name = "post"';
        $request = $rq['select'].$rq['from'].$rq['join'].$where.$rq['group'].$rq['order'].$rq['limit'];
        $binds   = [[':uid', $uid, \PDO::PARAM_INT]];
        $post    = $this->_database->FETCH($request, $binds);

        if ($post == false) {

            throw new \Exception('Post not found.');
        }

        self::clearOutputPost($post);

        return $post;
    }

    public function getFile($uid)
    {
        $select  = 'SELECT `content_file`';
        $from    = ' FROM `post`';
        $where   = ' WHERE uid.id = :uid AND uid.item_name = "post"';
        $join    = ' INNER JOIN `uid` ON post.id = uid.item_id';
        $request = $select.$from.$join.$where;
        $binds   = [[':uid', $uid, \PDO::PARAM_INT]];
        $post    = $this->_database->FETCH($request, $binds);

        if ($post == false || empty($post['content_file'])) {

            throw new \Exception('File of post not found.');
        }

        return \Inspire\Helper\JsonHelp::TO_ARRAY($post['content_file']);
    }

    public function getThumb($uid)
    {
        $select  = 'SELECT `thumb`';
        $from    = ' FROM `post`';
        $where   = ' WHERE uid.id = :uid AND uid.item_name = "post"';
        $join    = ' INNER JOIN `uid` ON post.id = uid.item_id';
        $request = $select.$from.$join.$where;
        $binds   = [[':uid', $uid, \PDO::PARAM_INT]];
        $post    = $this->_database->FETCH($request, $binds);

        if ($post == false || empty($post['thumb'])) {

            throw new \Exception('Thumb of post not found.');
        }

        return \Inspire\Helper\JsonHelp::TO_ARRAY($post['thumb']);
    }

    public function getPosts($filter = [])
    {
        $rq = self::$_POST_REQUEST;

        $limit  = empty($filter['limit']) ? 100 : (int) $filter['limit'];
        $offset = empty($filter['offset']) ? 0 : (int) $filter['offset'];

        $binds = [
            [':limit', $limit, \PDO::PARAM_INT],
            [':offset', $offset, \PDO::PARAM_INT]
        ];

        $tags    = empty($filter['tags']) ? [] : (array) $filter['tags'];
        $notags  = empty($filter['notags']) ? [] : (array) $filter['notags'];
        $types   = empty($filter['types']) ? [] : (array) $filter['types'];
        $notypes = empty($filter['notypes']) ? [] : (array) $filter['notypes'];

        $codeId  = 0;
        $havings = [];
        foreach ($tags as $tag) {
            $code      = ':data'.++$codeId;
            $binds[]   = [$code, $tag, \PDO::PARAM_STR];
            $havings[] = '(\',\' || LOWER(tags) || \',\') LIKE (\'%,\' || LOWER('.$code.') || \',%\')';
        }
        foreach ($types as $type) {
            $code      = ':data'.++$codeId;
            $binds[]   = [$code, $type, \PDO::PARAM_STR];
            $havings[] = '(\',\' || LOWER(types) || \',\') LIKE (\'%,\' || LOWER('.$code.') || \',%\')';
        }
        foreach ($notags as $tag) {
            $code      = ':data'.++$codeId;
            $binds[]   = [$code, $tag, \PDO::PARAM_STR];
            $havings[] = '(\',\' || LOWER(tags) || \',\') NOT LIKE ((\'%,\' || LOWER('.$code.') || \',%\'))';
        }
        foreach ($notypes as $type) {
            $code      = ':data'.++$codeId;
            $binds[]   = [$code, $type, \PDO::PARAM_STR];
            $havings[] = '(\',\' || LOWER(types) || \',\') NOT LIKE ((\'%,\' || LOWER('.$code.') || \',%\'))';
        }

        if (count($havings) > 0) {
            $having = ' HAVING '.implode(' AND ', $havings);
        } else {
            $having = '';
        }

        $request = $rq['select'].$rq['from'].$rq['join']
            .$rq['where'].$rq['group'].$having.$rq['order']
            .' LIMIT :limit OFFSET :offset';
        $posts   = $this->_database->FETCH_ALL($request, $binds);

        foreach ($posts as &$post) {
            self::clearOutputPost($post);
        }

        // return $request;

        return $posts;
    }

    private static function clearOutputPost(&$post)
    {
        $outPost['uid'] = (int) $post['uid'];

        self::clearData('title', 'string', $post);
        self::clearData('description', 'string', $post);
        self::clearData('date', 'string', $post);
        self::clearData('thumb', 'json', $post);
        self::clearData('content_file', 'json', $post);
        self::clearData('content_text', 'string', $post);
        self::clearData('content_link', 'string', $post);
        self::clearData('public', 'bool', $post);
        self::clearData('score', 'float', $post);
        self::clearData('tags', 'array', $post);
        self::clearData('types', 'array', $post);
    }

    /*private static function formatInputFileAndSave(&$data, &$rowList, &$binds)
    {
        if (!empty($data['content_file']))
        {
            $json = \Inspire\Helper\JsonHelp::TO_ARRAY($data['content_file']);
            if (!empty($data['base64']) && !empty($json['name']))
            {
                $base64 = $data['base64'];
                $type = \Inspire\Helper\FileHelp::GET_TYPE($json['name']);
                $file = \Inspire\Helper\FileHelp::SAVE_FILE_BASE64($base64, $json['name'], DATA_PATH . '/' . $type);
                $json['path'] = str_replace(DATA_PATH, '', $file);
                $rowList[] = 'content_file';
                $binds[] = [
                    ':content_file',
                    \Inspire\Helper\JsonHelp::FROM_ARRAY($json),
                    \PDO::PARAM_STR
                ];
            }
            else
            {
                throw new \Exception('"base64" and "content_file.name" variables needed for file');
            }
        }
    }*/

    private static function formatInputData(&$data, &$rowList, &$binds)
    {
        // Format date
        if (!empty($data['date'])) {
            $timestamp    = strtotime($data['date']);
            $data['date'] = date('Y-m-d H:m:s', $timestamp);
        }

        self::testData('title', \PDO::PARAM_STR, $data, $rowList, $binds);
        self::testData('description', \PDO::PARAM_STR, $data, $rowList, $binds);
        self::testData('date', \PDO::PARAM_STR, $data, $rowList, $binds);
        self::testData('thumb', \PDO::PARAM_STR, $data, $rowList, $binds);
        self::testData('title', \PDO::PARAM_STR, $data, $rowList, $binds);
        self::testData('content_text', \PDO::PARAM_STR, $data, $rowList, $binds);
        self::testData('content_link', \PDO::PARAM_STR, $data, $rowList, $binds);
        self::testData('content_file', \PDO::PARAM_STR, $data, $rowList, $binds);
        self::testData('public', \PDO::PARAM_INT, $data, $rowList, $binds);
        self::testData('score', \PDO::PARAM_STR, $data, $rowList, $binds);
    }
}