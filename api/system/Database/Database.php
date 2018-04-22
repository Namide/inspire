<?php

namespace Inspire\Database;

/**
 * Description of Database
 *
 * @author Damien Doussaud (namide.com)
 */
class Database
{
    private static $_INSTANCE;

    private $_pdo;

    private function __construct()
    {
        if (\Inspire\Helper\FileHelp::IS_EMPTY(DB_FILE))
        {
            \Inspire\Helper\FileHelp::WRITE_PROTECTED_DIR_OF_FILE(DB_FILE);
        }

        try
        {
            $this->_pdo = new \PDO(DB_DSN_DATAS, DB_USER, DB_PASS, DB_OPTIONS);
            $this->_pdo->setAttribute(\PDO::ATTR_EMULATE_PREPARES, 0);
            $this->_pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_SILENT);
        }
        catch (\PDOException $e)
        {
            
        }
    }

    private function __clone()
    {
        
    }

    public static function getInstance()
    {
        if (!isset(self::$_INSTANCE))
        {
            self::$_INSTANCE = new Database();
        }

        return self::$_INSTANCE;
    }

    public function CREATE($name, array $rows)
    {
        $req = 'CREATE TABLE IF NOT EXISTS `' . $name . '` (';
        $req .= 'id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE';

        foreach ($rows as $key => $type)
        {
            $req .= ', `' . $key . '` ' . $type . '';
        }
        $req .= ');';

        $this->EXECUTE($req);
    }

    public function FETCH_ALL($request, array $binds)
    {
        try
        {
            $stmt = $this->_pdo->prepare($request);

            if ($stmt === false)
            {
                return array();
            }

            if ($binds !== null)
            {
                foreach ($binds as $bind)
                {
                    $stmt->bindValue($bind[0], $bind[1], $bind[2]);
                }
            }

            $stmt->execute();
            $arrValues = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            $stmt = null;

            return $arrValues;
        }
        catch (\PDOException $e)
        {
            //if ( _DEBUG ) {
            //	Debug::getInstance()->addError( 'fetch_all() database error: '.$e->getMessage() );
            //}
        }

        return array();
    }

    public function FETCH($request, array $binds)
    {
        try
        {
            $stmt = $this->_pdo->prepare($request);

            if ($stmt === false)
            {
                return array();
            }

            if ($binds !== null)
            {
                foreach ($binds as $bind)
                {
                    $stmt->bindValue($bind[0], $bind[1], $bind[2]);
                }
            }

            $stmt->execute();
            $arrValues = $stmt->fetch(\PDO::FETCH_ASSOC);
            $stmt = null;

            return $arrValues;
        }
        catch (\PDOException $e)
        {
            /* if ( _DEBUG )
              {
              Debug::getInstance()->addError( 'fetch_all() database error: '.$e->getMessage() );
              } */
        }
        return array();
    }

    public function GET_LAST_INSERT_ID()
    {
        return $this->_pdo->lastInsertId();
    }

    public function EXECUTE($request, array $binds = null)
    {
        try
        {
            $stmt = $this->_pdo->prepare($request);
            if ($binds !== null)
            {
                foreach ($binds as $bind)
                {
                    $stmt->bindValue($bind[0], $bind[1], $bind[2]);
                }
            }

            $stmt->execute();
            $stmt = null;

            return true;
        }
        catch (\PDOException $e)
        {
            
        }

        return false;
    }

    public function EXIST($tableName)
    {
        if ($this->_pdo == null)
        {
            return false;
        }

        try
        {
            $sql = 'SELECT 1 FROM `' . $tableName . '` LIMIT 1';

            $att = $this->_pdo->getAttribute(\PDO::ATTR_ERRMODE);
            $this->_pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_SILENT);
            $result = $this->_pdo->query($sql);
            $this->_pdo->setAttribute(\PDO::ATTR_ERRMODE, $att);
        }
        catch (\PDOException $e)
        {
            return false;
        }

        return ($result !== false);
    }
}
