<?php

namespace Inspire\Database;

/**
 * Description of User
 *
 * @author Damien Doussaud (namide.com)
 */
class User
{
    /**
     *
     * @var int
     */
    public $uid;

    /**
     *
     * @var string
     */
    public $name;

    /**
     *
     * @var int
     */
    public $role;

    /**
     *
     * @var string
     */
    public $mail;

    /**
     *
     * @var string
     */
    public $token;

    /**
     *
     * @var string
     */
    public $pass;

    public static $ROLE_GUEST = 0;
    public static $ROLE_SUBSCRIBER = 1;
    public static $ROLE_AUTHOR = 2;
    public static $ROLE_EDITOR = 3;
    public static $ROLE_ADMIN = 4;
    
    public function __construct($data = [])
    {
        $this->setByData($data);
    }

    /**
     *
     * @param array $data
     */
    public function setByData($data)
    {
        $this->uid = empty($data['uid']) ? -1 : ((int) $data['uid']);
        $this->name = empty($data['name']) ? 'Guest' : ($data['name']);
        $this->role = empty($data['role']) ? self::$ROLE_GUEST : ((int) $data['role']);
        $this->mail = empty($data['mail']) ? NULL : $data['mail'];
        $this->token = empty($data['token']) ? NULL : $data['token'];
        $this->pass = empty($data['pass']) ? NULL : $data['pass'];
    }

    /**
     *
     * @return array
     */
    public function getData()
    {
        $data = [];
        
        if (!empty($this->uid) && $this->uid > -1) {
            $data['uid'] = $this->uid;
        }

        if (!empty($this->name)) {
            $data['name'] = $this->name;
        }

        if (!empty($this->mail)) {
            $data['mail'] = $this->mail;
        }

        if (!empty($this->token)) {
            $data['token'] = $this->token;
        }

        if (!empty($this->pass)) {
            $data['pass'] = $this->pass;
        }

        return $data;
    }
}
