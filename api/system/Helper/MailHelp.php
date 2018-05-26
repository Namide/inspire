<?php

namespace Inspire\Helper;

/**
 * Description of MailHelp
 *
 * @author Damien Doussaud (namide.com)
 */
class MailHelp
{
    static function sendMail($to, $subject, $message)
    {
        $from = 'no-reply@' . parse_url(FRONT_URL_ABS, PHP_URL_HOST);
        
        $headers = [];
        $headers['From'] = 'Inspire <' . $from . '>';
        $headers['To'] = $to;
        $headers['Reply-To'] = ADMIN_MAIL;
        $headers['X-Mailer'] = 'PHP/' . phpversion();
        $headers['Content-type'] = 'text/html; charset=utf-8';
        $headers['MIME-Version'] = '1.0';
        $headers['Date'] = date("r (T)");
        
        $body = '<html><head>'
            . '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'
            . '<title>' . $subject . '</title>'
            . '</head><body>' . $message . '</body></html>';
        
        if(!@mail($to, $subject, $body, $headers))
            throw new \Exception(error_get_last()['message']);
        
        return true;
    }
}
