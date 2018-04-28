<?php

namespace Inspire\Database;

function testData($name, $type, &$data, &$rowList, &$binds)
{
    if (isset($data[$name]))
    {
        $rowList[] = $name;
        $binds[] = array(':' . $name, $data[$name], $type);
    }
}

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
        'order' => ' ORDER BY `date` DESC, uid.id DESC',
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
                $this->_database->CREATE($tableName, $rows);
        }
    }
    
    public function updatePost($data)
    {
        $rowList = array();
        $binds = array();
        
        // Get UID
        if (!isset($data['uid']))
        {
            throw new \Exception('UID is needed for update post.');
        }
        else
        {
            $rowList[] = 'uid';
            $binds[] = array(
                ':uid',
                (int) $data[uid],
                \PDO::PARAM_INT
            );
        }
        
        
        self::formatInputData($data, $rowList, $binds);

        
        if (count($binds) < 1)
            throw new \Exception('POST data not founds');
       
        
        $insert = 'UPDATE INTO `post`';
        $join = ' INNER JOIN `uid` ON post.id = uid.item_id';
        $where = ' WHERE uid.id = :uid AND uid.item_name = "post"';
        $rows = ' (`' . implode('`, `', $rowList) . '`)';
        $values = ' VALUES (:' . implode(', :', $rowList) . ')';
        $this->_database->EXECUTE($insert . $join . $where . $rows . $values, $binds);
        
        
        // Add tags
        if (isset($data['tags']))
        {
            $tagList = explode(',', $data['tags']);
            $this->removeTagsOfItem($uid);
            $this->addTags($uid, $tagList);
            $this->cleanTags();
        }
        
        $post = $this->getPost($uid);
        return $post;
    }
    
    public function addPost($data)
    {
        $rowList = array();
        $binds = array();
        
        self::formatInputData($data, $rowList, $binds);
                
        
        if (count($binds) < 1)
            throw new \Exception('POST data not founds');

        
        $insert = 'INSERT INTO `post`';
        $rows = ' (`' . implode('`, `', $rowList) . '`)';
        $values = ' VALUES (:' . implode(', :', $rowList) . ')';
        $this->_database->EXECUTE($insert . $rows . $values, $binds);
        
        // Get post ID and UID
        $postId = (integer) $this->_database->GET_LAST_INSERT_ID();
        $uid = $this->addUID('post', $postId);
        
        // Add tags
        if (isset($data['tags']))
        {
            $tagList = explode(',', $data['tags']);
            $this->addTags($uid, $tagList);
        }
        
        // Return post
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
            throw new \Exception('Post not found.');
        
        self::clearOutputPost($post);
        
        return $post;
    }

    public function getTagID($tagName)
    {
        $request = 'SELECT `id` FROM `tag` WHERE lower(`name`) = lower(:name)';
        $binds = array(array(':name', $tagName, \PDO::PARAM_STR));
        $tag = $this->_database->FETCH($request, $binds);
        
        if ($tag == false)
        {
            $request = 'INSERT INTO `tag` (`name`) VALUES (:name)';
            $tag = $this->_database->EXECUTE($request, $binds);
            
            return $this->_database->GET_LAST_INSERT_ID();
        }
        
        return $tag['id'];
    }
    
    public function addTags($itemUID, array $tagList)
    {
        foreach ($tagList as $tagName)
        {
            $tagId = $this->getTagID($tagName);
            $request = 'INSERT INTO `tag_join` (`item_uid`, `tag_id`) VALUES (:item_uid, :tag_id)';
            $binds = array(
                array(':tag_id', $tagId, \PDO::PARAM_INT),
                array(':item_uid', $itemUID, \PDO::PARAM_INT)
            );
            $this->_database->EXECUTE($request, $binds);
        }
    }
    
    public function removeTagsOfItem($itemUID)
    {
        $request = 'DELETE FROM `tag_join` WHERE `item_uid` = :item_uid';
        $binds = array(
            array(':item_uid', $itemUID, \PDO::PARAM_INT)
        );
        $this->_database->EXECUTE($request, $binds);
    }
    
    public function cleanTags()
    {
        $request = 'DELETE FROM `tag` WHERE (NOT EXISTS (SELECT * FROM `tag_join` WHERE tag.id = tag_join.tag_id))';
        $this->_database->EXECUTE($request);
    }

    public function getPosts()
    {
        $rq = self::$_POST_REQUEST;
        $request = $rq['select'] . $rq['from'] . $rq['join'] . $rq['where'] . $rq['group'] . $rq['order'] . $rq['limit'];
        $posts = $this->_database->FETCH_ALL($request, array());
        
        foreach ($posts as &$post)
            self::clearOutputPost($post);
        
        return $posts;
    }

    public static function getTableRows()
    {
        $id = 'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE';

        return array(
            'post' => array(
                'id ' . $id,
                'title TEXT DEFAULT NULL',
                'description TEXT DEFAULT NULL',
                'date TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
                'thumb TEXT DEFAULT NULL',
                'content_file TEXT DEFAULT NULL',
                'content_text TEXT DEFAULT NULL',
                'content_link TEXT DEFAULT NULL',
                'public BOOLEAN DEFAULT true',
                'score NUMERIC DEFAULT 0'
            ),
            'group' => array(
                'id ' . $id,
                'title TEXT DEFAULT NULL',
                'description TEXT DEFAULT NULL',
                'thumb INTEGER DEFAULT NULL'
            ),
            /*'file' => array(
                'id ' . $id,
                'slug TEXT DEFAULT NULL',
                'title TEXT DEFAULT NULL',
                'location TEXT NOT NULL',
                'type TEXT',
                'charset TEXT',
                'width INTEGER DEFAULT NULL',
                'height INTEGER DEFAULT NULL',
                'size INTEGER DEFAULT NULL',
                'colors TEXT DEFAULT NULL'
            ),*/
            'user' => array(
                'id ' . $id,
                'name TEXT',
                'email TEXT',
                'password TEXT',
                'permission INTEGER'
            ),
            'uid' => array(
                'id ' . $id,
                'item_name TEXT NOT NULL',
                'item_id INTEGER NOT NULL'
            ),
            'tag' => array(
                'id ' . $id,
                'name TEXT NOT NULL'
            ),
            'tag_join' => array(
                'tag_id INTEGER NOT NULL',
                'item_uid INTEGER NOT NULL',
                'PRIMARY KEY (tag_id, item_uid)'
            )
        );
    }
    
    private static function clearOutputPost(&$post)
    {
        $outPost['uid'] = (int) $post['uid'];
        
        self::clearData('title', 'string', $post);
        self::clearData('description', 'string', $post);
        self::clearData('date', 'string', $post);
        self::clearData('thumb', 'string', $post);
        self::clearData('content_file', 'json', $post);
        self::clearData('content_text', 'string', $post);
        self::clearData('content_link', 'string', $post);
        self::clearData('public', 'bool', $post);
        self::clearData('score', 'float', $post);
        self::clearData('tags', 'array', $post);
        self::clearData('types', 'array', $post);
    }
    
    private static function clearData($name, $format, &$data)
    {
        if (empty($data[$name]))
            unset($data[$name]);
        else if ($format == 'bool')
            $data[$name] = (bool) $data[$name];
        else if ($format == 'float')
            $data[$name] = (float) $data[$name];
        else if ($format == 'array')
            $data[$name] = explode(',', $data[$name]);
        else if ($format == 'json')
            $data[$name] = \Inspire\Helper\JsonHelp::TO_ARRAY ($data[$name]);
        else if ($format == 'int')
            $data[$name] = (integer) $data[$name];
        else
            $data[$name] = $data[$name];
    }
    
    private static function formatInputData(&$data, &$rowList, &$binds)
    {
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
        testData('content_text', \PDO::PARAM_STR, $data, $rowList, $binds);
        testData('content_link', \PDO::PARAM_STR, $data, $rowList, $binds);
        testData('public', \PDO::PARAM_INT, $data, $rowList, $binds);
        testData('score', \PDO::PARAM_STR, $data, $rowList, $binds);
        if (isset($data['content_file']))
        {
            $json = \Inspire\Helper\JsonHelp::TO_ARRAY($data['content_file']);
            if (isset($data['base64']) && isset($json['name']))
            {
                $base64 = $data['base64'];
                $json['path'] = \Inspire\Helper\FileHelp::SAVE_FILE($base64, $json['name']);
                $rowList[] = 'content_file';
                $binds[] = array(
                    ':content_file',
                    \Inspire\Helper\JsonHelp::FROM_ARRAY($json),
                    \PDO::PARAM_STR
                );
            }
            else
            {
                throw new \Exception('"base64" and "content_file.name" variables needed for file');
            }
        }
    }
}