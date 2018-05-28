<?php

namespace Inspire\Helper;

/**
 * @author Damien Doussaud (namide.com)
 */
class ImgHelp
{

    public static function CREATE_THUMB($file, $thumb, $maxW = 512, $maxH = 512)
    {
        list($w, $h, $imgType) = getimagesize($file);

        switch ($imgType) {
            case 1:
                $src = imagecreatefromgif($file);
                break;
            case 2:
                $src = imagecreatefromjpeg($file);
                break;
            case 3:
                $src = imagecreatefrompng($file);
                break;
            default:
                return '';
                break;
        }

        $ratioX = $maxW / $w;
        $ratioY = $maxH / $h;

        if (($w <= $maxW) && ($h <= $maxH)) {
            $thumbW = $w;
            $thumbH = $h;
        } elseif (($ratioX * $h) < $maxH) {
            $thumbH = ceil($ratioX * $h);
            $thumbW = $maxW;
        } else {
            $thumbW = ceil($ratioY * $w);
            $thumbH = $maxH;
        }

        $tmp = imagecreatetruecolor($thumbW, $thumbH);

        // Check if this image is PNG or GIF, then set if transparent
        if (($imgType == 1) || ($imgType == 3)) {
            imagealphablending($tmp, false);
            imagesavealpha($tmp, true);
            $transparent = imagecolorallocatealpha($tmp, 255, 255, 255, 127);
            imagefilledrectangle($tmp, 0, 0, $thumbW, $thumbH, $transparent);
        }

        imagecopyresampled($tmp, $src, 0, 0, 0, 0, $thumbW, $thumbH, $w, $h);

        imagejpeg($tmp, $newFile, 90);
        imagedestroy($tmp);
        imagedestroy($src);
    }
}