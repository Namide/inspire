<?php

namespace Inspire\Database;

/**
 * Description of TagManager
 *
 * @author Damien Doussaud (namide.com)
 */
class TagManager extends \Inspire\Database\DataManager
{
    public function getTags($filter = [])
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

        $select = 'SELECT uid.id AS `uid` '
                .' GROUP_CONCAT(DISTINCT tag.name) AS `tags`,'
                .' GROUP_CONCAT(DISTINCT type.name) AS `types`';

        $request = $select.$rq['from'].$rq['join']
            .$rq['where'].$rq['group'].$having.$rq['order']
            .' LIMIT :limit OFFSET :offset';
        $posts   = $this->_database->FETCH_ALL($request, $binds);

        foreach ($posts as &$post) {
            self::clearOutputPost($post);
        }

        // return $request;

        return $posts;
    }

    public function getTagID($tagName)
    {
        $name = trim($tagName);

        if (empty($name)) {
            throw new \Exception('A tag must be not empty');
        }

        $request = 'SELECT `id` FROM `tag` WHERE lower(`name`) = lower(:name)';
        $binds   = [[':name', $name, \PDO::PARAM_STR]];
        $tag     = $this->_database->FETCH($request, $binds);

        if ($tag == false) {
            $request = 'INSERT INTO `tag` (`name`) VALUES (:name)';
            $tag     = $this->_database->EXECUTE($request, $binds);

            return $this->_database->GET_LAST_INSERT_ID();
        }

        return $tag['id'];
    }

    public function addTags($itemUID, array $tagList)
    {
        foreach ($tagList as $tagName) {
            $name = trim($tagName);
            if (!empty($name)) {
                $tagId   = $this->getTagID($name);
                $request = 'INSERT INTO `tag_join` (`item_uid`, `tag_id`) VALUES (:item_uid, :tag_id)';
                $binds   = [
                    [':tag_id', $tagId, \PDO::PARAM_INT],
                    [':item_uid', $itemUID, \PDO::PARAM_INT]
                ];
                $this->_database->EXECUTE($request, $binds);
            }
        }
    }

    public function removeTagsOfItem($itemUID)
    {
        $request = 'DELETE FROM `tag_join` WHERE `item_uid` = :item_uid';
        $binds   = [
            [':item_uid', $itemUID, \PDO::PARAM_INT]
        ];
        $this->_database->EXECUTE($request, $binds);
    }

    public function cleanTags()
    {
        $request = 'DELETE FROM `tag` WHERE (NOT EXISTS (SELECT * FROM `tag_join` WHERE tag.id = tag_join.tag_id))';
        $this->_database->EXECUTE($request);
    }
}