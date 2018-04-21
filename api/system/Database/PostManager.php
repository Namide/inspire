<?php

namespace Inspire\Database;

class PostManager
{
    /**
     * @var Database 
     */
    private $_database;

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
    
    public function addPost($data)
    {
        $binds = array(
            array(
                ':title',
                isset($data['title']) ? $data['title'] : '',
                \PDO::PARAM_STR
            ),
            array(
                ':description',
                isset($data['description']) ? $data['description'] : '',
                \PDO::PARAM_STR
            ),
            array(
                ':date',
                isset($data['date']) ? $data['date'] : null,
                \PDO::PARAM_STR
            ),
            array(
                ':thumb',
                isset($data['thumb']) ? $data['thumb'] : null,
                \PDO::PARAM_INT
            ),
            array(
                ':content_file',
                isset($data['content_file']) ? $data['content_file'] : null,
                \PDO::PARAM_INT
            ),
            array(
                ':content_text',
                isset($data['content_text']) ? $data['content_text'] : null,
                \PDO::PARAM_INT
            ),
            array(
                ':content_link',
                isset($data['content_link']) ? $data['content_link'] : null,
                \PDO::PARAM_INT
            ),
            array(
                ':public',
                isset($data['public']) ? $data['public'] : 0,
                \PDO::PARAM_INT
            ),
            array(
                ':score',
                isset($data['score']) ? $data['score'] : 0,
                \PDO::PARAM_STR
            )
        );
        $insert = 'INSERT INTO `post`';
        $rows = ' (`title`, `description`, `date`, `thumb`, `content_file`, `content_text`, `content_link`, `public`, `score`)';
        $values = ' VALUES (:title, :description, :date, :thumb, :content_file, :content_text, :content_link, :public, :score)';
        $this->_database->EXECUTE($insert . $rows . $values, $binds);
        
        $uid = $this->addUID('post');
        $post = $this->getPost($uid);
        
        return $post;
    }
    
    private function addUID($table)
    {
        $id = (integer)$this->_database->GET_LAST_INSERT_ID();
        $binds = array(
            array(':table', $table, \PDO::PARAM_STR),
            array(':id', $id, \PDO::PARAM_INT)
        );
        $request = 'INSERT INTO `uid` (`item_name`, `item_id`) VALUES(:table, :id)';
        $this->_database->EXECUTE($request, $binds);
        
        $uid = (integer)$this->_database->GET_LAST_INSERT_ID();
        return $uid;
    }
    
    public function getPost($uid)
    {
        $select = 'SELECT uid.id AS `uid`, `title`, `description`, `date`, `thumb`, `content_file`, `content_text`, `content_link`, `public`, `score` FROM `post`';
        $join = ' INNER JOIN `uid` ON post.id = uid.item_id';
        $where = ' WHERE uid.id = :uid AND uid.item_name = "post"';
        $binds = array(array(':uid', $uid, \PDO::PARAM_INT));
        
        $data = $this->_database->FETCH_ALL($select . $join . $where, $binds);
        
        if (count($data) > 0)
        {
            $data = $data[0];
            $data['uid'] = (int) $data['uid'];
            $data['thumb'] = is_null($data['thumb']) ? null : (int) $data['thumb'];
            $data['public'] = is_null($data['public']) ? null : (bool) $data['public'];
            $data['score'] = is_null($data['score']) ? null : (float) $data['score'];
        }
        else
        {
            throw new \Exception('Post not found.');
        }
        
        return $data;
    }
    
    public function getPosts()
    {
        $select = 'SELECT uid.id AS `uid`, `title`, `description`, `date`, `thumb`, `content_file`, `content_text`, `content_link`, `public`, `score` FROM `post`';
        $limit = ' LIMIT 10 OFFSET 15';
        $order = ' ORDER BY `date` ASC, `id` ASC ';
        $join = ' FULL JOIN `id` ON `post.id` = `uid.item_id`';
        
        return $this->_database->FETCH_ALL($select . $order . $limit . $join, array());
    }

    public static function getTableRows()
    {
        return array(
            'post' => array(
                'title' => 'TEXT',
                'description' => 'TEXT',
                'date' => 'TEXT',
                'type' => 'TEXT',
                'tags' => 'TEXT',
                'thumb' => 'INTEGER',
                'content_file' => 'INTEGER',
                'content_text' => 'TEXT',
                'content_link' => 'TEXT',
                'public' => 'INTEGER',
                'score' => 'NUMERIC'
            ),
            'group' => array(
                'title' => 'TEXT',
                'description' => 'TEXT',
                'thumb' => 'INTEGER',
                'selector_tags' => 'TEXT',
                'selector_types' => 'TEXT'
            ),
            'file' => array(
                'slug' => 'TEXT',
                'title' => 'TEXT',
                'location' => 'TEXT',
                'type' => 'TEXT',
                'charset' => 'INTEGER',
                'width' => 'INTEGER',
                'height' => 'TEXT',
                'size' => 'TEXT',
                'colors' => 'INTEGER'
            ),
            'user' => array(
                'name' => 'TEXT',
                'email' => 'TEXT',
                'password' => 'TEXT',
                'permission' => 'INTEGER'
            ),
            'uid' => array(
                'item_name' => 'TEXT',
                'item_id' => 'INTEGER'
            )
        );
    }
}