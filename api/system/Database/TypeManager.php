<?php

namespace Inspire\Database;

/**
 * Description of TypeManager
 *
 * @author Damien Doussaud (namide.com)
 */
class TypeManager extends \Inspire\Database\DataManager
{

    public function getTypeID($typeName)
    {
        $name = trim($typeName);

        if (empty($name)) {
            throw new \Exception('A type must be not empty');
        }

        $request = 'SELECT `id` FROM `type` WHERE lower(`name`) = lower(:name)';
        $binds   = [[':name', $name, \PDO::PARAM_STR]];
        $type    = $this->_database->FETCH($request, $binds);

        if ($type == false) {
            $request = 'INSERT INTO `type` (`name`) VALUES (:name)';
            $type    = $this->_database->EXECUTE($request, $binds);

            return $this->_database->GET_LAST_INSERT_ID();
        }

        return $type['id'];
    }

    public function addTypes($itemUID, array $typeList)
    {
        foreach ($typeList as $typeName) {
            $name = trim($typeName);
            if (!empty($name)) {
                $typeId  = $this->getTypeID($name);
                $request = 'INSERT INTO `type_join` (`item_uid`, `type_id`) VALUES (:item_uid, :type_id)';
                $binds   = [
                    [':type_id', $typeId, \PDO::PARAM_INT],
                    [':item_uid', $itemUID, \PDO::PARAM_INT]
                ];
                $this->_database->EXECUTE($request, $binds);
            }
        }
    }

    public function removeTypesOfItem($itemUID)
    {
        $request = 'DELETE FROM `type_join` WHERE `item_uid` = :item_uid';
        $binds   = [[':item_uid', $itemUID, \PDO::PARAM_INT]];
        $this->_database->EXECUTE($request, $binds);
    }

    public function cleanTypes()
    {
        $request = 'DELETE FROM `type` WHERE (NOT EXISTS (SELECT * FROM `type_join` WHERE type.id = type_join.type_id))';
        $this->_database->EXECUTE($request);
    }
}