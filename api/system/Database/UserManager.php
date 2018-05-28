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

    private function deleteToken($userId)
    {
        $request = 'DELETE FROM `token` WHERE `user_id` = :user_id';
        $binds   = [[':user_id', $userId, \PDO::PARAM_INT]];
        $this->_database->EXECUTE($request, $binds);
    }

    private function createToken($userId)
    {
        $this->deleteToken($userId);
        $signature = sha1($userId.'-'.mt_rand(0xFFFF, 0xFFFFF).'-'.time());
        $expire    = self::getExpire();

        $request = 'INSERT INTO `token` (`signature`, `user_id`, `expire`) VALUES (:signature, :user_id, :expire)';
        $binds   = [
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
        $binds   = [
            [':signature', $token, \PDO::PARAM_STR]
        ];
        $a       = $this->_database->EXECUTE($request, $binds);

        return $this->getUserByToken($token);
    }

    public function getUserById($userId)
    {
        $request = 'SELECT `name`, `role`, `mail` FROM `user` WHERE `id` = :id';
        $binds   = [
            [':id', $userId, \PDO::PARAM_INT]
        ];
        $user    = $this->_database->FETCH($request, $binds);

        if (empty($user)) {
            throw new \Exception('User not found');
        }

        return $user;
    }

    public function getUserBySignIn($mail, $pass)
    {
        $request = 'SELECT `id`, `name`, `role`, `mail`, `pass` FROM `user`'
            .' WHERE lower(`mail`) = lower(:mail)';

        $binds = [
            [':mail', $mail, \PDO::PARAM_STR]
        ];

        $user = $this->_database->FETCH($request, $binds);

        if (!password_verify($pass, $user['pass'])) {
            throw new \Exception('E-mail or password error');
        }

        $token         = $this->createToken($user['id']);
        $user['token'] = $token['signature'];

        return [
            'name' => $user['name'],
            'role' => $user['role'],
            'mail' => $user['mail'],
            'token' => $token['signature']
        ];
    }

    public function getUserByToken($token)
    {
        $request = 'SELECT `name`, `role`, `mail` FROM `user`'
            .' INNER JOIN `token` ON token.user_id = user.id WHERE token.signature = :signature';
        $binds   = [[':signature', $token, \PDO::PARAM_STR]];
        $user    = $this->_database->FETCH($request, $binds);

        if (empty($user)) {
            return ['name' => 'Guest', 'role' => 0];
        }

        return $user;
    }

    private function canEdit($mail, $byUser)
    {
        if ($byUser['role'] < 1) {
            throw new \Exception('You have not privileges to do that');
        }

        if ($byUser['role'] < 4 && strtolower($mail) !== strtolower($byUser['mail'])) {
            throw new \Exception('You do not have permission to edit other users');
        }

        $binds = [[':mail', $mail, \PDO::PARAM_STR]];
        if ($byUser['role'] > 3 && strtolower($mail) !== strtolower($byUser['mail'])) {
            $request = 'SELECT COUNT(*) FROM `user` WHERE role > 3 AND LOWER(mail) != LOWER(:mail)';
            $count   = $this->_database->COUNT($request, $binds);
            if ($count < 1) {
                throw new \Exception('You can not delete the last administrator');
            }
        }
    }

    public function deleteUser($mail, $byUser)
    {
        $this->canEdit($mail, $byUser);

        $binds = [[':mail', $mail, \PDO::PARAM_STR]];
        if ($byUser['role'] > 3) {
            $request = 'SELECT COUNT(*) FROM `user` WHERE role > 3 AND LOWER(mail) != LOWER(:mail)';
            $count   = $this->_database->COUNT($request, $binds);
            
            if ($count < 1) {
                throw new \Exception('You can not delete the last administrator');
            }
        }

        $request = 'DELETE FROM `user` WHERE LOWER(mail) == LOWER(:mail)';
        $this->_database->EXECUTE($request, $binds);
    }

    public function updateUser($data, $byUser)
    {
        throw new \Exception('TODO: use uid');

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

        $message = \Inspire\Vue\MailSignUp::getHtml($name, $mail, $pass);
        \Inspire\Helper\MailHelp::sendMail($mail, 'Inspire subscription',
            $message);

        return $this->getUserById($userId);
    }
}