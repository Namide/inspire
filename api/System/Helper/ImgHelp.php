<?php

namespace Inspire\Helper;

/*
 * The MIT License
 *
 * Copyright 2016 Damien Doussaud (namide.com).
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * @author Damien Doussaud (namide.com)
 */
class ImgHelp {

  public static function CREATE_THUMB($file, $thumb, $maxW = 512, $maxH = 512) {
    list($w, $h, $imgType) = getimagesize($file);

    switch ($imgType) {
      case 1: $src = imagecreatefromgif($file);
        break;
      case 2: $src = imagecreatefromjpeg($file);
        break;
      case 3: $src = imagecreatefrompng($file);
        break;
      default: return '';
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
