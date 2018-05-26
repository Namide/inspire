<?php

namespace Inspire\Database;



/**
 * Description of TagManager
 *
 * @author Damien Doussaud (namide.com)
 */
class UserManager extends \Inspire\Database\DataManager
{
    static private function getExpire()
    {
        $hours = 12;
        $seconds = 12 * 60 * 60;
        $expireTime = time() + $seconds;
        
        return date('Y-m-d H:m:s', $expireTime);
    }
    
    static private function getRandPass($length = 20)
    {
        $alphabet = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";

        $pass = [];
        $alphaLength = strlen($alphabet) - 1;
        for ($i = 0; $i < $length; $i++)
        {
            $n = rand(0, $alphaLength);
            $pass[] = $alphabet[$n];
        }

        return implode($pass);
    }
    
    private function deleteToken($userId)
    {
        $request = 'DELETE FROM `token` WHERE `user_id` = :user_id';
        $binds = [
            [':user_id', $userId, \PDO::PARAM_INT]
        ];
        $this->_database->EXECUTE($request, $binds);
    }
    
    private function createToken($userId)
    {
        $this->deleteToken($userId);
        $signature = sha1($userId . '-' . mt_rand(0xFFFF, 0xFFFFF) . '-' . time());
        $expire = self::getExpire();
        
        $request = 'INSERT INTO `token` (`signature`, `user_id`, `expire`) VALUES (:signature, :user_id, :expire)';
        $binds = [
            [':signature', $signature, \PDO::PARAM_STR],
            [':user_id', $userId, \PDO::PARAM_INT],
            [':expire', $expire, \PDO::PARAM_STR]
        ];
        $this->_database->EXECUTE($request, $binds);

        return [
            'signature' => $signature,
            'expire' => $expire
        ];
    }
    
    public function signout($token)
    {
        $request = 'DELETE FROM `token` WHERE `signature` = :signature';
        $binds = [
            [':signature', $token, \PDO::PARAM_STR]
        ];
        $a = $this->_database->EXECUTE($request, $binds);
        
        return $this->getUserByToken($token);
    }
    
    public function getUserById($userId)
    {
        $request = 'SELECT `name`, `role`, `mail` FROM `user` WHERE `id` = :id';
        $binds = [
            [':id', $userId, \PDO::PARAM_INT]
        ];
        $user = $this->_database->FETCH($request, $binds);
        
        if (empty($user))
            throw new \Exception('User not found');
        
        return $user;
    }
    
    public function getUserBySignIn($mail, $pass)
    {
        $request = 'SELECT `id`, `name`, `role`, `mail` FROM `user`'
            . ' WHERE lower(`mail`) = lower(:mail) AND `pass` = :pass';
        
        $binds = [
            [':mail', $mail, \PDO::PARAM_STR],
            [':pass', $pass, \PDO::PARAM_STR]
        ];
        
        $user = $this->_database->FETCH($request, $binds);
        
        if (empty($user))
            throw new \Exception('E-mail or password error');
        
        $token = $this->createToken($user['id']);
        $user['token'] = $token['signature'];
        unset($user['id']);
        
        return $user;
    }
    
    public function getUserByToken($token)
    {
        $request = 'SELECT `name`, `role`, `mail` FROM `user`'
            . ' INNER JOIN `token` ON token.user_id = user.id WHERE token.signature = :signature';
        $binds = array(array(':signature', $token, \PDO::PARAM_STR));
        $user = $this->_database->FETCH($request, $binds);
        
        if (empty($user))
            return ['name' => 'Guest', 'role' => 0];
        
        return $user;
    }
    
    public function addUser($data, $byUser)
    {
        if ($byUser['role'] < 2)
            throw new Exception('You do not have permission to create user');
        
        if (empty($data['name']) || empty($data['mail']) || empty($data['role']))
            throw new Exception('"name", "mail" and "role" required');
        
        $name = $data['name'];
        $mail = $data['mail'];
        $role = $data['role'];
        $pass = self::getRandPass();
       
        $request = 'INSERT INTO `user` (`name`, `mail`, `pass`, `role`)'
            . ' VALUES (:name, :mail, :pass, :role)';
        $binds = array(
            array(':name', $name, \PDO::PARAM_STR),
            array(':mail', $data['mail'], \PDO::PARAM_STR),
            array(':pass', $pass, \PDO::PARAM_STR),
            array(':role', $role, \PDO::PARAM_INT)
        );
        
        $this->_database->EXECUTE($request, $binds);
        $userId = (integer) $this->_database->GET_LAST_INSERT_ID();
        
        $message = \Inspire\Vue\MailSignUp::getHtml($name, $mail, $pass);
        \Inspire\Helper\MailHelp::sendMail($mail, 'Inspire subscription', $message);
        
        return $this->getUserById($userId);
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
