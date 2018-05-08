<?php

namespace Inspire\Database;

/**
 * Description of TagManager
 *
 * @author Damien Doussaud (namide.com)
 */
class TagManager extends \Inspire\Database\DataManager
{
    public function getTagID($tagName)
    {
        $name = trim($tagName);
        
        if (empty($name))
            throw new \Exception('A tag must be not empty');
            
        $request = 'SELECT `id` FROM `tag` WHERE lower(`name`) = lower(:name)';
        $binds = array(array(':name', $name, \PDO::PARAM_STR));
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
            $name = trim($tagName);
            if (!empty($name))
            {
                $tagId = $this->getTagID($name);
                $request = 'INSERT INTO `tag_join` (`item_uid`, `tag_id`) VALUES (:item_uid, :tag_id)';
                $binds = array(
                    array(':tag_id', $tagId, \PDO::PARAM_INT),
                    array(':item_uid', $itemUID, \PDO::PARAM_INT)
                );
                $this->_database->EXECUTE($request, $binds);
            }
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
}
