<?php

namespace Inspire\Database;

class PostManager
{
    /**
     * @var Database 
     */
    private $_database;
    
    private static $_POST_REQUEST = array(
        'select' => 'SELECT uid.id AS `uid`, `title`, `description`,'
            . ' `date`, `thumb`, `content_file`, `content_text`,'
            . ' `content_link`, `public`, `score`,'
            . ' GROUP_CONCAT(tag.name, ",") AS `tags`',
        'from' => ' FROM `post`',
        'join' => ' INNER JOIN `uid` ON post.id = uid.item_id'
            . ' LEFT OUTER JOIN `tag_join` ON tag_join.item_uid = uid.id'
            . ' LEFT OUTER JOIN `tag` ON tag.id = tag_join.tag_id',
        'where' => ' WHERE uid.item_name = "post"',
        'group' => ' GROUP BY post.id',
        'order' => ' ORDER BY `date` ASC, uid.id ASC',
        'limit' => ' LIMIT 10 OFFSET 0'
    );

    function __construct()
    {
        $this->_init();
    }
    
    private function _init()
    {
        $this->_database = \Inspire\Database\Database::getInstance();
        if (!$this->_database->EXIST('post'))
        {
            $tableRows = $this->getTableRows();
            foreach ($tableRows as $tableName => $rows)
            {
                $this->_database->CREATE($tableName, $rows);
            }
        }
    }
    
    public function addTags($postID, $tags)
    {
        
    }
    
    public function addPost($data)
    {
        $rowList = array();
        $binds = array();
        
        function testData($name, $type, &$data, &$rowList, &$binds)
        {
            if (isset($data[$name]))
            {
                $rowList[] = $name;
                $binds[] = array(
                    ':' . $name,
                    $data[$name],
                    $type
                );
            }
        }
        
        // Format date
        if (isset($data['date']))
        {
            $timestamp = strtotime($data['date']);
            $data['date'] = date( "Y-m-d H:m:s", $timestamp);
        }
        
        testData('title', \PDO::PARAM_STR, $data, $rowList, $binds);
        testData('description', \PDO::PARAM_STR, $data, $rowList, $binds);
        testData('date', \PDO::PARAM_STR, $data, $rowList, $binds);
        testData('thumb', \PDO::PARAM_INT, $data, $rowList, $binds);
        testData('title', \PDO::PARAM_STR, $data, $rowList, $binds);
        testData('content_file', \PDO::PARAM_INT, $data, $rowList, $binds);
        testData('content_text', \PDO::PARAM_STR, $data, $rowList, $binds);
        testData('content_link', \PDO::PARAM_INT, $data, $rowList, $binds);
        testData('public', \PDO::PARAM_INT, $data, $rowList, $binds);
        testData('score', \PDO::PARAM_STR, $data, $rowList, $binds);

        $insert = 'INSERT INTO `post`';
        $rows = ' (`' . implode('`, `', $rowList) . '`)';
        $values = ' VALUES (:' . implode(', :', $rowList) . ')';
        $this->_database->EXECUTE($insert . $rows . $values, $binds);
        
        $postId = (integer) $this->_database->GET_LAST_INSERT_ID();
        $uid = $this->addUID('post', $postId);
        $post = $this->getPost($uid);
        
        return $post;
    }
    
    private function addUID($table, $postId = null)
    {
        $id = is_null($postId) ? (integer) $this->_database->GET_LAST_INSERT_ID() : (integer) $postId;
        
        $binds = array(
            array(':table', $table, \PDO::PARAM_STR),
            array(':id', $id, \PDO::PARAM_INT)
        );
        $request = 'INSERT INTO `uid` (`item_name`, `item_id`) VALUES(:table, :id)';
        $this->_database->EXECUTE($request, $binds);
        
        $uid = (integer) $this->_database->GET_LAST_INSERT_ID();
        return $uid;
    }
    
    public function getPost($uid)
    {
        $rq = self::$_POST_REQUEST;
        $where = ' WHERE uid.id = :uid AND uid.item_name = "post"';
        $request = $rq['select'] . $rq['from'] . $rq['join'] . $where . $rq['group'] . $rq['order'] . $rq['limit'];
        $binds = array(array(':uid', $uid, \PDO::PARAM_INT));
        $post = $this->_database->FETCH($request, $binds);
        
        if ($post == false)
            throw new \Exception('Post not found (UID = ' . $uid . ').');
        
        self::clearPost($post);
        
        return $post;
    }
    
    public function getPosts()
    {
        $rq = self::$_POST_REQUEST;
        $request = $rq['select'] . $rq['from'] . $rq['join'] . $rq['where'] . $rq['group'] . $rq['order'] . $rq['limit'];
        $posts = $this->_database->FETCH_ALL($request, array());
        
        if (count($posts) < 1)
            throw new \Exception('Post not found.');
        
        foreach ($posts as &$post)
            self::clearPost($post);
        
        return $posts;
    }

    public static function getTableRows()
    {
        return array(
            'post' => array(
                'title' => 'TEXT DEFAULT NULL',
                'description' => 'TEXT DEFAULT NULL',
                'date' => 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
                'thumb' => 'INTEGER DEFAULT NULL',
                'content_file' => 'INTEGER DEFAULT NULL',
                'content_text' => 'TEXT DEFAULT NULL',
                'content_link' => 'TEXT DEFAULT NULL',
                'public' => 'BOOLEAN DEFAULT true',
                'score' => 'NUMERIC DEFAULT 0'
            ),
            'group' => array(
                'title' => 'TEXT DEFAULT NULL',
                'description' => 'TEXT DEFAULT NULL',
                'thumb' => 'INTEGER DEFAULT NULL'
            ),
            'file' => array(
                'slug' => 'TEXT DEFAULT NULL',
                'title' => 'TEXT DEFAULT NULL',
                'location' => 'TEXT NOT NULL',
                'type' => 'TEXT',
                'charset' => 'TEXT',
                'width' => 'INTEGER DEFAULT NULL',
                'height' => 'INTEGER DEFAULT NULL',
                'size' => 'INTEGER DEFAULT NULL',
                'colors' => 'TEXT DEFAULT NULL'
            ),
            'user' => array(
                'name' => 'TEXT',
                'email' => 'TEXT',
                'password' => 'TEXT',
                'permission' => 'INTEGER'
            ),
            'uid' => array(
                'item_name' => 'TEXT NOT NULL',
                'item_id' => 'INTEGER NOT NULL'
            ),
            'tag' => array(
                'name' => 'TEXT NOT NULL'
            ),
            'tag_join' => array(
                'tag_id' => 'INTEGER NOT NULL',
                'item_uid' => 'INTEGER NOT NULL'
            )
        );
    }
    
    private static function clearPost(&$post)
    {
        $post['uid'] = (int) $post['uid'];
        
        if (is_null($post['thumb'])) unset($post['thumb']);
        else $post['thumb'] = (integer) $post['thumb'];
       
        if (is_null($post['content_file'])) unset($post['content_file']);
        else $post['content_file'] = $post['content_file'];
       
        if (is_null($post['content_text'])) unset($post['content_text']);
        else $post['content_text'] = $post['content_text'];
       
        if (is_null($post['content_link'])) unset($post['content_link']);
        else $post['content_link'] = $post['content_link'];
        
        if (is_null($post['public'])) unset($post['public']);
        else $post['public'] = (bool) $post['public'];
        
        if (is_null($post['score'])) unset($post['score']);
        else $post['score'] = (float) $post['score'];
        
        if (is_null($post['tags'])) unset($post['tags']);
        else $post['tags'] = explode(',', $post['tags']);
    }
}