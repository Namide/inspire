<?php

namespace Inspire\Helper;

/**
 * Description of FileHelp
 *
 * @author Damien Doussaud (namide.com)
 */
class FileHelp
{
    public static function SET_FILE_DATA($file, &$data = [], $colors = false)
    {
        $info = getimagesize($file);

        if (in_array($info[2],
                [IMAGETYPE_GIF, IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_BMP])) {
            if (empty($data['type'])) {
                $data['type'] = mime_content_type($file);
            }

            if (empty($data['name'])) {
                $data['name'] = pathinfo($file, PATHINFO_BASENAME);
            }

            if (empty($data['size'])) {
                $data['size'] = filesize($file);
            }

            $data['width']  = $info[0];
            $data['height'] = $info[1];

            // Extract colors
            if ($colors) {
                $palette       = \League\ColorExtractor\Palette::fromFilename($file);
                $extractor     = new \League\ColorExtractor\ColorExtractor($palette);
                $colors        = $extractor->extract(5);
                $colorIntToHex = function($intColor) {
                    return \League\ColorExtractor\Color::fromIntToHex($intColor,
                            true);
                };
                $data['colors'] = array_map($colorIntToHex, $colors);
            }
        }

        return $data;
    }

    public static function CREATE_THUMB($image, $thumb)
    {
        list($width, $height) = getimagesize($image);

        $thumbDir  = pathinfo($thumb, PATHINFO_DIRNAME);
        $thumbName = self::CLEAN_NAME(pathinfo($thumb, PATHINFO_FILENAME).'.jpg');
        $thumbFile = self::RENAME_IF_EXIST($thumbDir, $thumbName);

        $pixels = $width * $height;
        if ($pixels > THUMB_PIXELS) {
            $mult        = sqrt(THUMB_PIXELS / ($width * $height));
            $thumbWidth  = round($width * $mult);
            $thumbHeight = round($height * $mult);
        } else {
            $thumbWidth  = $width;
            $thumbHeight = $height;
        }

        /*
        if (max($width, $height) <= 512)
        {
            $thumbWidth = $width;
            $thumbHeight = $height;
        } elseif ($width > $height) {
            $thumbWidth = 512;
            $thumbHeight = round(512 * $height / $width);
        } else {
            $thumbHeight = 512;
            $thumbWidth = round(512 * $width / $height);
        }
         */

        self::WRITE_DIR_OF_FILE($thumbFile);
        \WideImage\WideImage::load($image)
            ->resize($thumbWidth, $thumbHeight)
            ->saveToFile($thumbFile, 80);

        return $thumbFile;

        /*
        $imageThumb = imagecreatetruecolor($width, $height);
        $image = imagecreatefromjpeg($thumb);
        imagecopyresampled($imageThumb, $image, 0, 0, 0, 0, $thumbWidth, $thumbHeight, $width, $height);
        imagejpeg($imageThumb, $thumbDir . '/' . $thumbName, 70);

        imagedestroy($imageThumb);
        */
    }

    public static function SAVE_FILE_POST($fileInput, $dir)
    {
        $name = self::CLEAN_NAME($fileInput['name']);
        $file = self::RENAME_IF_EXIST($dir, $name);
        self::WRITE_DIR_OF_FILE($file);

        if ($fileInput['size'] > MAX_FILE_SIZE) {
            throw new \Exception('Each file must be inferior at '.(MAX_FILE_SIZE
            / 1000).'ko');
        }

        // Check error
        switch ($fileInput['error']) {
            case UPLOAD_ERR_INI_SIZE:
                throw new \Exception('The uploaded file exceeds the upload_max_filesize directive in php.ini');
                break;
            case UPLOAD_ERR_FORM_SIZE:
                throw new \Exception('The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form');
                break;
            case UPLOAD_ERR_PARTIAL:
                throw new \Exception('The uploaded file was only partially uploaded');
                break;
            case UPLOAD_ERR_NO_FILE:
                throw new \Exception('No file was uploaded');
                break;
            case UPLOAD_ERR_NO_TMP_DIR:
                throw new \Exception('Missing a temporary folder');
                break;
            case UPLOAD_ERR_CANT_WRITE:
                throw new \Exception('Failed to write file to disk');
                break;
            case UPLOAD_ERR_EXTENSION:
                throw new \Exception('File upload stopped by extension');
                break;
        }

        if (!move_uploaded_file($fileInput['tmp_name'], $file)) {
            throw new \Exception('File upload failure to move from "'.$fileData['tmp_name'].'" to "'.$file.'"');
        }

        return $file;
    }

    public static function RENAME_IF_EXIST($path, $filename)
    {
        $file = "$path/$filename";
        if (!file_exists($file)) {
            return $file;
        }
        
        $fnameNoExt = pathinfo($filename, PATHINFO_FILENAME);
        $ext        = pathinfo($filename, PATHINFO_EXTENSION);

        $i = 1;
        while (file_exists("$path/$fnameNoExt-$i.$ext")) {
            $i++;
        }

        return "$path/$fnameNoExt-$i.$ext";
    }

    public static function CLEAN_NAME($name, $charset = 'utf-8')
    {
        $name = html_entity_decode($name, ENT_QUOTES, $charset);
        $name = mb_strtolower($name, $charset);
        $name = str_replace([
            'à', 'â', 'ä', 'á', 'ã', 'å',
            'î', 'ï', 'ì', 'í',
            'ô', 'ö', 'ò', 'ó', 'õ', 'ø',
            'ù', 'û', 'ü', 'ú',
            'é', 'è', 'ê', 'ë',
            'ç', 'ÿ', 'ý', 'ñ',
            'æ', 'œ', 'ß', "'", '’', '“', '”', '«', '»', '–', '—', '€', '$', '&'
            ], [
            'a', 'a', 'a', 'a', 'a', 'a',
            'i', 'i', 'i', 'i',
            'o', 'o', 'o', 'o', 'o', 'o',
            'u', 'u', 'u', 'u',
            'e', 'e', 'e', 'e',
            'c', 'y', 'y', 'n',
            'ae', 'oe', 'ss', '', '', '', '', '', '', '-', '-', 'e', 's', ''
            ], $name
        );

        $name = preg_replace('/([^.a-z0-9]+)/i', '-', $name);
        return $name;
    }

    /**
     * Writes the content in a file.
     * If the directory doesn't exist, it's automatically created.
     * 
     * @param string &$content		Content of the file
     * @param string $fileName		Name of the file
     */
    public static function WRITE_FILE(&$content, $fileName)
    {
        self::WRITE_DIR_OF_FILE($fileName);
        file_put_contents($fileName, $content, LOCK_EX);
    }

    /**
     * Writes recursively the directories of a files if it doesn't exist
     * 
     * @param string $fileName		Name of the file
     */
    public static function WRITE_DIR_OF_FILE($fileName)
    {
        $dir = explode('/', $fileName);
        array_pop($dir);
        self::WRITE_DIR(implode($dir, '/'));
    }

    /**
     * Writes a directory if it doesn't exist.
     * It works recursively.
     * 
     * @param string $dirName		Directory to write
     */
    public static function WRITE_DIR($dirName)
    {
        $path = explode('/', $dirName);

        $dirName = '';
        while (count($path) > 0) {
            $dirName .= $path[0].'/';

            if (!file_exists($dirName)) {
                mkdir($dirName, 0777);
            }

            array_shift($path);
        }
    }

    /**
     * Writes a directory with .htaccess (deny from all) if it doesn't exist.
     * It works recursively.
     * 
     * @param string $dirName		Directory of the .htaccess
     */
    public static function WRITE_PROTECTED_DIR($dirName)
    {
        self::WRITE_DIR($dirName);

        if (!file_exists($dirName.'.htaccess')) {
            $htaccess        = fopen($dirName.'.htaccess', "w");
            $htaccessContent = 'deny from all';
            fwrite($htaccess, $htaccessContent);
            fclose($htaccess);
        }
    }

    /**
     * Writes a directory with .htaccess (deny from all) if it doesn't exist.
     * It works recursively.
     * 
     * @param string $fileName		File beside the .htaccess
     */
    public static function WRITE_PROTECTED_DIR_OF_FILE($fileName)
    {
        $dirArray = explode('/', $fileName);
        array_pop($dirArray);
        $dir      = implode($dirArray, '/');

        self::WRITE_DIR($dir);

        if (!file_exists($dir.'/.htaccess')) {
            $htaccess        = fopen($dir.'/.htaccess', 'w');
            $htaccessContent = 'deny from all';
            fwrite($htaccess, $htaccessContent);
            fclose($htaccess);
        }
    }

    /**
     * Size of the directory in octets
     * 
     * @param string $dir		Directory to mesure
     * @return float			Size of the directory in octet
     */
    public static function GET_DIR_SIZE($dirName)
    {
        $size = 0;
        foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dirName)) as $file)
            $size += $file->getSize();

        return $size;
    }

    /**
     * Size of the directory in string with type (bytes, kilo-bytes...)
     * 
     * @param string $dirName				Directory to mesure
     * @param int $round				Number to float
     * @return string					Formated size of the directory
     */
    public static function GET_FORMATED_DIR_SIZE($dirName, $round = 2)
    {
        $size = self::GET_DIR_SIZE($dirName);

        //Size must be bytes!
        $sizes = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        for ($i = 0; $size > 1024 && $i < count($sizes) - 1; $i++) {
            $size /= 1024;
        }

        return round($size, $round).' '.$sizes[$i];
    }

    /**
     * Delete a directory and his content
     * 
     * @param string $dirName		Directory to delete		
     * @return int					true on success or false on failure			
     */
    public static function DEL_DIR_RECURSIVLY($dirName)
    {
        if (!file_exists($dirName)) return 0;

        $files = array_diff(scandir($dirName), ['.', '..']);
        foreach ($files as $file) {
            if (is_dir($dirName.'/'.$file)) {
                self::DEL_DIR_RECURSIVLY($dirName.'/'.$file);
            } elseif (!unlink($dirName.'/'.$file)) {
                throw new \Exception(error_get_last()['message']);
            }
        }

        return rmdir($dirName);
    }

    /**
     * Delete file
     * 
     * @param type $file				Path of file to delete
     * @param type $recursEmptyDir		Delete containers directories empty
     * @return boolean					File successfull deleted
     */
    public static function DEL_FILE($file, $recursEmptyDir = false)
    {
        if (!file_exists($file))
            return false;

        if (unlink($file)) {
            if ($recursEmptyDir) {
                $dir = $file;
                do {
                    $dir = explode('/', $dir);

                    if (count($dir) < 1) {
                        return true;
                    }

                    array_pop($dir);
                    $dir = implode('/', $dir);
                    self::DEL_EMPTY_DIR_RECURSIVLY($dir);
                }
                while (self::IS_EMPTY($dir));
            }

            return true;
        } else {
            throw new \Exception(error_get_last()['message']);
        }

        return false;
    }

    /**
     * Is the directory empty
     * 
     * @param type $dir			Directtory to test
     * @return int				Is deleted	
     */
    public static function IS_EMPTY($dir)
    {
        if (!file_exists($dir)) {
            return true;
        }

        if (is_file($dir)) {
            return true;
        }
        
        $files = array_diff(scandir($dir), ['.', '..', '.DS_Store', 'Thumbs.db']);
        return count($files) < 1;
    }

    /**
     * Delete all files and directories and return the number of file deleted
     * 
     * @param string $dirName		Directory to delete
     * @return int					Number of files deleted (without directories)
     */
    public static function DEL_EMPTY_DIR_RECURSIVLY($dirName)
    {
        $numChilds = 0;

        if (!file_exists($dirName)) {
            return 0;
        }
        if (is_file($dirName)) {
            return 1;
        }
        
        $files = array_diff(scandir($dirName), ['.', '..', '.DS_Store', 'Thumbs.db']);
        foreach ($files as $file) {
            if (is_dir($dirName.'/'.$file)) {
                $numChilds += self::DEL_EMPTY_DIR_RECURSIVLY($dirName.'/'.$file);
            } else {
                $numChilds++;
            }
        }

        if ($numChilds < 1) {
            rmdir($dirName);
        }
        
        return $numChilds;
    }

    /**
     * Copy the recursivly the directory ($dir2copy) to the directory ($dir2paste)
     * 
     * @param string $dir2copy		Original directory
     * @param string $dir2paste		New directory
     */
    /*public static function COPY_DIR_RECURSIVLY($dir2copy, $dir2paste)
    {
        if (is_dir($dir2copy))
        {
            if ($dh = opendir($dir2copy))
            {
                while (($file = readdir($dh)) !== false)
                {
                    if (!is_dir($dir2paste)) {
                    mkdir($dir2paste, 0777);
                    }

                    if (is_dir($dir2copy . $file) && $file != '..' && $file != '.')
                    {
                        $this->COPY_DIR_RECURSIVLY($dir2copy . $file . '/', $dir2paste . $file . '/');
                    }
                    elseif ($file != '..' && $file != '.')
                    {
                        copy($dir2copy . $file, $dir2paste . $file);
                    }
                }

                closedir($dh);
            }
        }
    }*/

    /**
     * Copy the directory ($dir2copy) to the directory ($dir2paste) for type.
     * Ex for copy without php:
     * COPY_DIR_RECURSIVLY_WITHOUT_TYPES( 'original/dir', 'new/dir', ['php', 'php4', 'php5'] );
     * 
     * @param string $dir2copy		Original directory
     * @param string $dir2paste		New directory
     * @param array $extentions		Exceptions list
     */
    /*public static function COPY_DIR_RECURSIVLY_WITHOUT_TYPES($dir2copy, $dir2paste, array $extentions = null)
    {
        if ($extentions === null)
            $extentions = [];

        if (is_dir($dir2copy))
        {
            if ($dh = opendir($dir2copy))
            {
                while (($file = readdir($dh)) !== false)
                {
                    if (!is_dir($dir2paste))
                        mkdir($dir2paste, 0777);

                    if (is_dir($dir2copy . $file) && $file != '..' && $file != '.')
                    {
                        self::COPY_DIR_RECURSIVLYWithoutPhpFiles($dir2copy . $file . '/', $dir2paste . $file . '/');
                    }
                    elseif ($file != '..' && $file != '.')
                    {
                        $ok = true;
                        foreach ($extentions as $ext)
                        {
                            $l = count($ext);

                            if (strtolower(substr(strrchr($file, '.'), 1)) === $ext)
                                $ok = false;
                        }

                        if ($ok)
                            copy($dir2copy . $file, $dir2paste . $file);
                    }
                }

                closedir($dh);
            }
        }
    }*/
}