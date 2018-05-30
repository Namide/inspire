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
        $hours      = 12;
        $seconds    = 12 * 60 * 60;
        $expireTime = time() + $seconds;

        return date('Y-m-d H:m:s', $expireTime);
    }

    static private function getRandPass($length = 20)
    {
        $alphabet = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";

        $pass        = [];
        $alphaLength = strlen($alphabet) - 1;
        for ($i = 0; $i < $length; $i++) {
            $n      = rand(0, $alphaLength);
            $pass[] = $alphabet[$n];
        }

        return implode($pass);
    }

    private function deleteToken($uid)
    {
        throw new \Exception('TODO: delete token');

        $delete = 'DELETE FROM `token`';
        $where  = ' WHERE `id` = (SELECT `item_id` FROM `uid` WHERE `id` = :uid AND `item_name` = "user")';
        $binds  = [[':uid', $uid, \PDO::PARAM_INT]];
        $this->_database->EXECUTE($delete.$where, $binds);

        $this->deleteUID($uid);
    }

    private function createToken($uid)
    {
        $this->deleteToken($uid);
        $signature = sha1($uid.'-'.mt_rand(0xFFFF, 0xFFFFF).'-'.time());
        $expire    = self::getExpire();

        $request = 'INSERT INTO `token` (`signature`, `user_uid`, `expire`) VALUES (:signature, :uid, :expire)';
        $binds   = [
            [':signature', $signature, \PDO::PARAM_STR],
            [':uid', $uid, \PDO::PARAM_INT],
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
        throw new \Exception('TODO: delete signout');

        $request = 'DELETE FROM `token` WHERE `signature` = :signature';
        $binds   = [
            [':signature', $token, \PDO::PARAM_STR]
        ];
        $a       = $this->_database->EXECUTE($request, $binds);

        return $this->getUserByToken($token);
    }

    public function getUserByUid($uid, $byUser)
    {
        if ($byUser['role'] < 4) {
            throw new \Exception('You do not have permission to see other users');
        }

        $request = 'SELECT uid.id as `uid`, `name`, `role`, `mail` FROM `user`'
            .' INNER JOIN `uid` ON user.id = uid.item_id WHERE uid.id = :uid AND uid.item_name = "user"';
        $binds   = [[':uid', $uid, \PDO::PARAM_INT]];
        $user    = $this->_database->FETCH($request, $binds);

        if (empty($user)) {
            throw new \Exception('User not found');
        }

        return $user;
    }

    public function getUsers($byUser)
    {
        if ($byUser['role'] < 4) {
            throw new \Exception('You do not have permission to see other users');
        }

        $request = 'SELECT uid.id as `uid`, `name`, `role`, `mail` FROM `user`'
            .' INNER JOIN `uid` ON user.id = uid.item_id WHERE uid.item_name = "user"';
        $users   = $this->_database->FETCH_ALL($request);

        if (count($users) < 1) {
            throw new \Exception('Users not found');
        }

        return $users;
    }

    public function getUserBySignIn($mail, $pass)
    {
        $request = 'SELECT uid.id as `uid`, `name`, `pass`, `role`, `mail` FROM `user`'
            .' INNER JOIN `uid` ON user.id = uid.item_id WHERE uid.item_name = "user"'
            .' AND uid.item_name = "user" AND lower(`mail`) = lower(:mail)';
        /*
        $request = 'SELECT id, `name`, `role`, `mail`, `pass` FROM `user`'
            .' WHERE lower(`mail`) = lower(:mail)';
*/
        $binds = [
            [':mail', $mail, \PDO::PARAM_STR]
        ];

        $user = $this->_database->FETCH($request, $binds);

        if (!password_verify($pass, $user['pass'])) {
            throw new \Exception('E-mail or password error');
        }

        $token = $this->createToken($user['uid']);

        return [
            'name' => $user['name'],
            'role' => $user['role'],
            'mail' => $user['mail'],
            'token' => $token['signature']
        ];
    }

    public function getUserByToken($token)
    {
        $request = 'SELECT uid.id as `uid`, `name`, `role`, `mail` FROM `user`'
            .' INNER JOIN `uid` ON user.id = uid.item_id'
            .' INNER JOIN `token` ON token.user_uid = user.id'
            .' WHERE uid.item_name = "user" AND token.signature = :signature';
        $binds   = [[':signature', $token, \PDO::PARAM_STR]];
        $user    = $this->_database->FETCH($request, $binds);

        if (empty($user)) {
            return ['name' => 'Guest', 'role' => 0];
        }

        return $user;
    }

    private function canEdit($user, $byUser)
    {
        if ($byUser['role'] < 1) {
            throw new \Exception('You have not privileges to do that');
        }

        if ($byUser['role'] < 4 && strtolower($user['mail']) !== strtolower($byUser['mail'])) {
            throw new \Exception('You do not have permission to edit other users');
        }

        return true;
    }

    public function deleteUser($uid, $byUser)
    {
        throw new \Exception('TODO: delete user');

        $user = $this->getUserByUid($uid);
        if (empty($user)) {
            throw new \Exception('User not found');
        }

        if (!$this->canEdit($user, $byUser)) {
            throw new \Exception('You can not delete this user');
        }

        throw new \Exception('TODO: Request with UID');
        $binds = [[':uid', $uid, \PDO::PARAM_INT]];
        if ($byUser['role'] > 3) {
            $request = 'SELECT COUNT(*) FROM `user` INNER JOIN `uid` ON user.id = uid.item_id WHERE uid.item_name = "user" AND role > 3 AND uid.id = :uid AND uid.id != ';
            $count   = $this->_database->COUNT($request, $binds);
            
            if ($count < 1) {
                throw new \Exception('You can not delete the last administrator');
            }
        }

        $request = 'DELETE FROM `user` WHERE LOWER(mail) == LOWER(:mail)';
        $this->_database->EXECUTE($request, $binds);

        $this->deleteUID();
    }

    public function updateUser($data, $byUser)
    {
        throw new \Exception('TODO: updateUser');

        $this->canEdit($data['mail'], $byUser);

        if ($byUser['role'] > 3 && !empty($data['role']) && $data['role'] < 4) {
            $binds   = [[':mail', $data['mail'], \PDO::PARAM_STR]];
            $request = 'SELECT COUNT(*) FROM `user` WHERE role > 3 AND LOWER(mail) != LOWER(:mail)';
            $count   = $this->_database->COUNT($request, $binds);

            if ($count < 1) {
                throw new \Exception('You can not downgrade the last administrator');
            }
        }
    }

    public function addUser($data, $byUser)
    {
        if ($byUser['role'] < 2) {
            $request = 'SELECT COUNT(*) FROM `user` WHERE 1';
            $count   = $this->_database->COUNT($request);

            if ($count > 0) {
                throw new \Exception('You do not have permission to add user');
            } else {
                $data['role'] = 4;
            }
        }

        if (empty($data['name']) || empty($data['mail']) || empty($data['role'])) {
            throw new \Exception('"name", "mail" and "role" required');
        }

        $request = 'SELECT COUNT(*) FROM `user` WHERE LOWER(mail) = LOWER(:mail)';
        $binds   = [[':mail', $data['mail'], \PDO::PARAM_STR]];
        $count   = $this->_database->COUNT($request, $binds);
        if ($count > 0) {
            throw new \Exception('This user already exist');
        }

        $name = $data['name'];
        $mail = $data['mail'];
        $role = $data['role'];
        $pass = self::getRandPass();
        $hash = password_hash($pass, PASSWORD_DEFAULT);

        $request = 'INSERT INTO `user` (`name`, `mail`, `pass`, `role`)'
            .' VALUES (:name, :mail, :pass, :role)';
        $binds   = [
            [':name', $name, \PDO::PARAM_STR],
            [':mail', $data['mail'], \PDO::PARAM_STR],
            [':pass', $hash, \PDO::PARAM_STR],
            [':role', $role, \PDO::PARAM_INT]
        ];

        $this->_database->EXECUTE($request, $binds);
        $userId = (integer) $this->_database->GET_LAST_INSERT_ID();
        $uid    = $this->addUID('user', $userId);

        $message = \Inspire\Vue\MailSignUp::getHtml($name, $mail, $pass);
        \Inspire\Helper\MailHelp::sendMail($mail, 'Inspire subscription',
            $message);

        return $this->getUserByUid($uid);
    }
}