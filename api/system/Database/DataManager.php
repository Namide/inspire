<?php

namespace Inspire\Database;

/**
 * Description of DataManager
 *
 * @author Damien Doussaud (namide.com)
 */
class DataManager
{
    /**
     * @var Database 
     */
    protected $_database;

    protected static $_POST_REQUEST = array(
        'select' => 'SELECT uid.id AS `uid`, `title`, `description`,'
            . ' `date`, `thumb`, `content_file`, `content_text`,'
            . ' `content_link`, `public`, `score`,'
            . ' GROUP_CONCAT(DISTINCT tag.name) AS `tags`,'
            . ' GROUP_CONCAT(DISTINCT type.name) AS `types`',
        'from' => ' FROM `post`',
        'join' => ' INNER JOIN `uid` ON post.id = uid.item_id'
            . ' LEFT OUTER JOIN `tag_join` ON tag_join.item_uid = uid.id'
            . ' LEFT OUTER JOIN `tag` ON tag.id = tag_join.tag_id'
            . ' LEFT OUTER JOIN `type_join` ON type_join.item_uid = uid.id'
            . ' LEFT OUTER JOIN `type` ON type.id = type_join.type_id',
        'where' => ' WHERE uid.item_name = "post"',
        'group' => ' GROUP BY post.id',
        'order' => ' ORDER BY `date` DESC, uid.id DESC',
        'limit' => ' LIMIT 100 OFFSET 0'
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
    
    protected function addUID($table, $itemId = null)
    {
        $id = is_null($itemId) ? (integer) $this->_database->GET_LAST_INSERT_ID() : (integer) $itemId;
        
        $binds = array(
            array(':table', $table, \PDO::PARAM_STR),
            array(':id', $id, \PDO::PARAM_INT)
        );
        $request = 'INSERT INTO `uid` (`item_name`, `item_id`) VALUES(:table, :id)';
        $this->_database->EXECUTE($request, $binds);
        
        $uid = (integer) $this->_database->GET_LAST_INSERT_ID();
        return $uid;
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
            ),
            'type' => array(
                'id ' . $id,
                'name TEXT NOT NULL'
            ),
            'type_join' => array(
                'type_id INTEGER NOT NULL',
                'item_uid INTEGER NOT NULL',
                'PRIMARY KEY (type_id, item_uid)'
            )
        );
    }
    
    protected static function clearData($name, $format, &$data)
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
            $data[$name] = \Inspire\Helper\JsonHelp::TO_ARRAY($data[$name]);
        else if ($format == 'int')
            $data[$name] = (integer) $data[$name];
        else
            $data[$name] = $data[$name];
    }
    
    protected static function testData($name, $type, &$data, &$rowList, &$binds)
    {
        if (!empty($data[$name]))
        {
            $rowList[] = $name;
            $binds[] = array(':' . $name, $data[$name], $type);
        }
    }
}
