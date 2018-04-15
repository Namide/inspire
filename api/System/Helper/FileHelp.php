<?php

namespace Inspire\Helper;

/**
 * Description of FileHelp
 *
 * @author Damien Doussaud (namide.com)
 */
class FileHelp
{
    public static $EXTS_IMG_BITMAP = array('.png', '.gif', '.jpg', '.jpeg');
    public static $EXTS_IMG_VECTOR = array('.svg', '.ai', '.eps');
    public static $EXTS_3D = array('.blend', '.3ds', '.obj', '.dxf');
    public static $EXTS_SOUND = array('.mp3', '.flac', '.ogg', '.wav');
    public static $EXTS_VIDEO = array('.mp4', '.avi', '.mpeg', '.mov');
    public static $EXTS_PAGE = array('.pdf', '.ps', '.html', '.xhtml', '.xml');
    public static $EXTS_TEXT = array('.odt', '.txt', '.doc', '.rtf');
    public static $EXTS_ARCHIVE = array('rar', '.gz', '.tar', '.zip', '.7z');
    
    public static function GET_TYPE_BY_EXT($extension)
    {
        $type = '?';

        if (in_array($extension, self::$EXTS_IMG_BITMAP))
        {
            $type = 'img_bitmap';
        }
        elseif (in_array($extension, self::$EXTS_IMG_VECTOR))
        {
            $type = 'img_vector';
        }
        elseif (in_array($extension, self::$EXTS_3D))
        {
            $type = '3d';
        }
        elseif (in_array($extension, self::$EXTS_SOUND))
        {
            $type = 'sound';
        }
        elseif (in_array($extension, self::$EXTS_VIDEO))
        {
            $type = 'video';
        }
        elseif (in_array($extension, self::$EXTS_PAGE))
        {
            $type = 'page';
        }
        elseif (in_array($extension, self::$EXTS_TEXT))
        {
            $type = 'text';
        }
        elseif (in_array($extension, self::$EXTS_ARCHIVE))
        {
            $type = 'archive';
        }

        return $type;
    }

    public static function SAVE_UPLOADED_FILES($name, $destDir)
    {
        $outputFiles = array();

        if (exist($_FILES, $name)) {
          return array('error' => 'The file ' . $name . ' don\'nt exist.');
        }

        $destDir .= date('Y-m') . '/';

        if (FileHelp::IS_EMPTY($destDir)) {
          FileHelp::WRITE_DIR($destDir);
        }

        $fileInput = $_FILES[$name];
        for ($i = 0; $i < count($fileInput['name']); $i++)
        {
            if (!exist($fileInput['name'], $i)) {
                continue;
            }

            if ($fileInput['error'][$i] != UPLOAD_ERR_OK) {
                continue;
            }

            $file = basename($fileInput['name'][$i]);
            $weight = filesize($fileInput['tmp_name'][$i]);
            $extensions = array('.png', '.gif', '.jpg', '.jpeg');
            $extension = strrchr($fileInput['name'][$i], '.');

            if (!in_array($extension, $extensions))
            {
                $return = array('error' => 'You can not upload this file format: ' . $extension);
            }

            if ($weight > MAX_FILE_SIZE)
            {
                $return = array('error' => 'Each file must be inferior at ' . (MAX_FILE_SIZE / 1000) . 'ko');
            }

            $newNams = date('Y-m-d_H-i-s') . '_' . FileHelp::CLEAN_NAME($file);
            $newFile = $newNams . $extension;

            if (move_uploaded_file($fileInput['tmp_name'][$i], $destDir . $newFile))
            {
                $type = self::GET_TYPE_BY_EXT($extension);
                $resume = '';

                // CREATE THUMB
                if ($type === 'img_bitmap') {
                ImgHelp::CREATE_THUMB($destDir . $newFile, $destDir . $thumb);
                $resume = $newFile . '_thumb.jpg';
                }

                $outputFiles[] = array(
                    'type' => $type,
                    'value' => $newFile,
                    'resume' => $resume
                );
            }
            else
            {
                return array('error' => 'File content upload failure');
            }
        }

        return $outputFiles;
    }

    public static function CLEAN_NAME($name, $charset = 'utf-8')
    {
        $name = html_entity_decode($name, ENT_QUOTES, $charset);
        $name = mb_strtolower($name, $charset);
        $name = str_replace(
            array(
            'à', 'â', 'ä', 'á', 'ã', 'å',
            'î', 'ï', 'ì', 'í',
            'ô', 'ö', 'ò', 'ó', 'õ', 'ø',
            'ù', 'û', 'ü', 'ú',
            'é', 'è', 'ê', 'ë',
            'ç', 'ÿ', 'ý', 'ñ',
            'æ', 'œ', 'ß', "'", '’', '“', '”', '«', '»', '–', '—', '€', '$', '&'
            ), array(
            'a', 'a', 'a', 'a', 'a', 'a',
            'i', 'i', 'i', 'i',
            'o', 'o', 'o', 'o', 'o', 'o',
            'u', 'u', 'u', 'u',
            'e', 'e', 'e', 'e',
            'c', 'y', 'y', 'n',
            'ae', 'oe', 'ss', '', '', '', '', '', '', '-', '-', 'e', 's', ''
            ), $name
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
    public static function WRITE_DIR_OF_FILE($fileName) {
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
        while (count($path) > 0)
        {
            $dirName .= $path[0] . '/';
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

        if (!file_exists($dirName . '.htaccess')) {
            $htaccess = fopen($dirName . '.htaccess', "w");
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
        $dir = implode($dirArray, '/');
        
        self::WRITE_DIR($dir);

        if (!file_exists($dir . '/.htaccess')) {
            $htaccess = fopen($dir . '/.htaccess', 'w');
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
        foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dirName)) as $file) {
            $size += $file->getSize();
        }
        return $size;
    }

    /**
     * Size of the directory in string with type (bytes, kilo-bytes...)
     * 
     * @param string $dirName				Directory to mesure
     * @param int $round				Number to float
     * @return string					Formated size of the directory
     */
    public static function GET_FORMATET_DIR_SIZE($dirName, $round = 2)
    {
        $size = self::GET_DIR_SIZE($dirName);

        //Size must be bytes!
        $sizes = array('B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB');
        for ($i = 0; $size > 1024 && $i < count($sizes) - 1; $i++)
            $size /= 1024;

        return round($size, $round) . ' ' . $sizes[$i];
    }

    /**
     * Delete a directory and his content
     * 
     * @param string $dirName		Directory to delete		
     * @return int					true on success or false on failure			
     */
    public static function DEL_DIR_RECURSIVLY($dirName)
    {
        if (!file_exists($dirName)) {
            return 0;
        }

        $files = array_diff(scandir($dirName), array('.', '..'));
        foreach ($files as $file) {
            if (is_dir($dirName . '/' . $file)) {
            self::DEL_DIR_RECURSIVLY($dirName . '/' . $file);
            } else {
            unlink($dirName . '/' . $file);
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
        {
            return false;
        }
        unlink($file);

        if ($recursEmptyDir)
        {
            $dir = $file;
            do {
                $dir = explode('/', $dir);
                if (count($dir) < 1)
                    return true;
                array_pop($dir);
                $dir = implode('/', $dir);
                self::DEL_EMPTY_DIR_RECURSIVLY($dir);
            }
            while (self::IS_EMPTY($dir));
        }

        return true;
    }

    /**
     * Is the directory empty
     * 
     * @param type $dir			Directtory to test
     * @return int				Is deleted	
     */
    public static function IS_EMPTY($dir)
    {
        if (!file_exists($dir))
        {
            return true;
        }

        if (is_file($dir))
        {
            return true;
        }

        $files = array_diff(scandir($dir), array('.', '..', '.DS_Store', 'Thumbs.db'));
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

        if (!file_exists($dirName))
        {
            return 0;
        }
        if (is_file($dirName))
        {
            return 1;
        }

        $files = array_diff(scandir($dirName), array('.', '..', '.DS_Store', 'Thumbs.db'));
        foreach ($files as $file)
        {
            if (is_dir($dirName . '/' . $file))
            {
                $numChilds += self::DEL_EMPTY_DIR_RECURSIVLY($dirName . '/' . $file);
            }
            else
            {
                $numChilds++;
            }
        }

        if ($numChilds < 1)
        {
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
    public static function COPY_DIR_RECURSIVLY($dir2copy, $dir2paste)
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
    }

    /**
     * Copy the directory ($dir2copy) to the directory ($dir2paste) for type.
     * Ex for copy without php:
     * COPY_DIR_RECURSIVLY_WITHOUT_TYPES( 'original/dir', 'new/dir', array('php', 'php4', 'php5') );
     * 
     * @param string $dir2copy		Original directory
     * @param string $dir2paste		New directory
     * @param array $extentions		Exceptions list
     */
    public static function COPY_DIR_RECURSIVLY_WITHOUT_TYPES($dir2copy, $dir2paste, array $extentions = null)
    {
        if ($extentions === null)
        {
            $extentions = array();
        }

        if (is_dir($dir2copy))
        {

            if ($dh = opendir($dir2copy))
            {
                while (($file = readdir($dh)) !== false)
                {
                    if (!is_dir($dir2paste))
                    {
                        mkdir($dir2paste, 0777);
                    }

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
                            {
                                $ok = false;
                            }
                        }

                        if ($ok)
                        {
                            copy($dir2copy . $file, $dir2paste . $file);
                        }
                    }
                }

                closedir($dh);
            }
        }
    }
}
