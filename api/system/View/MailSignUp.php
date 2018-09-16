<?php

namespace Inspire\View;

class MailSignUp
{
    static function getHtml($name, $mail, $pass)
    {
        $siteURL  = FRONT_URL_ABS;
        $adminURL = ADMIN_URL_ABS;

        return <<<EOT

<h1>Hello $name!</h1>
<p>
    You have been registered to the web site
    <a href="$siteURL" target="_blank">$siteURL</a>.
</p>
<p>
    You can now create your own content by the admin area
    <a href="$adminURL" target="_blank">$adminURL</a> with your 
    login:
</p>
<ul>
    <li><strong>E-mail: </strong>$mail</li>
    <li><strong>Password: </strong>$pass</li>
</ul>
<p>
    Regards
</p>

EOT;
    }
}