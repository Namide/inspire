<?php

namespace Inspire\Helper;

/**
 * Test and apply the commands from ITEM datas.
 * Can add, set, delete or get items and datas from database.
 *
 * @author Damien Doussaud (namide.com)
 */
class InputHelp
{
    private $_private           = false;
    private static $_INPUT_TYPE = INPUT_POST; // INPUT_GET or INPUT_POST

    function __construct($private = false)
    {
        $this->_private = $private;
    }
    
    /*
     * Test if command is ask (get items, add item...).
     *
     * @return boolean  true if command is asked, false otherwise.
     */
    public function has_command()
    {

        if (self::$_INPUT_TYPE === INPUT_POST) {
            return !empty($_POST) && count($_POST) > 0;
        } elseif (self::$_INPUT_TYPE === INPUT_GET) {
            return !empty($_GET) && count($_GET) > 0;
        }

        return trigger_error(
            'Use only INPUT_GET or INPUT_POST for the static InputHelp::_INPUT_TYPE',
            E_USER_ERROR
        );
    }

    /**
     * Apply the command and get the result in JSON format.
     *
     * @return string   JSON result of the command.
     */
    public function apply_command()
    {

        $args = array(
            'item' => FILTER_SANITIZE_STRING,
            'content' => FILTER_SANITIZE_STRING,
            'word' => FILTER_SANITIZE_STRING
        );

        $input = filter_input_array(self::$_INPUT_TYPE, $args);
        if (!isset($input)) {
            $input = [];
        }

        if (!empty($input['item'])) {

            return $this->appy_command_item(JsonHelp::TO_ARRAY(html_entity_decode($input['item'])));

            // TODO
        } elseif (false) {

        } elseif (false) {
            
        }

        return [];
    }

    private function appy_command_item($data)
    {
        if (!empty($data['add'])) {
            if ($this->_private) {
                return $this->add_item($data['add']);
            } else {
                return [
                    'error' => 'You are not authorized to add item.'
                ];
            }
        }

        if (!empty($data['set'])) {
            if ($this->_private) {
                return $this->set_item($data['set']);
            } else {
                return array('error' => 'You are not authorized to edit item.');
            }
        }

        if (!empty($data['del'])) {
            if ($this->_private) {
                return $this->del_item($data['del']);
            } else {
                return array(
                    'error' => 'You are not authorized to delete item.');
            }
        }

        if (isset($data['get'])) {

            return $this->get_item($data['get']);
        }

        return [];
    }

    private function get_item($datas)
    {
        $datas['public']    = ($this->_private) ? 0 : 1;
        $datas['published'] = ($this->_private) ? 0 : 1;

        if (empty($datas['offset'])) {
            $datas['offset'] = 0;
        }

        $outItem = Item::getInstance()->getItem($datas);

        if (empty($outItem)) {
            return []; // array('error' => 'Item not found');
        } else {
            return $outItem;
        }
    }

    private function add_item($datas)
    {

        if (empty($datas['type'])) {
            return array('error' => 'To add item, "add.type" can not be empty.');
        }

        $itemId = Item::getInstance()->add($datas);

        if ($itemId > 0) {
            return Item::getInstance()->getById($itemId);
        } else {
            return array('error' => 'item can\'t be inserted in the data base.');
        }
    }

    private function set_item($datas)
    {
        if (array_key_exists('id', $datas)) {
            $id    = (int) $datas['id'];
            $reply = Item::getInstance()->set($id, $datas);
            if (!array_key_exists('error', $reply)) {
                return $this->get_item(array('id' => $id));
                /* array(
                  'item' => Item::getInstance()->getItem(array('id' => $id))
                  ); */
            } else {
                return array(
                    'error' => 'You can\'t edit the item '.$id.': '.$reply['error']
                );
            }
        } else {
            return array('error' => '"set.id" required to edit a item');
        }
    }

    private function del_item($input)
    {
        if (!array_key_exists('id', $input)) {
            return array('error' => '"del.id" required to remove a item.');
        }

        $id = (int) $input['id'];

        // Delete tags and contents
        $success = Item::getInstance()->del($id);
        if ($success) {

            $tagRow         = array(Enum::$WORD_LABEL_ITEM_ID => $id);
            $contentRow     = array(Content::$ROW_LABEL_ITEM_ID => $id);
            $tagSuccess     = Word::getInstance()->delByDatas($tagRow);
            $contentSuccess = Content::getInstance()->delByDatas($contentRow);

            // $tagSuccess = array_key_exists('success', $tagSuccess);
            // $contentSuccess = array_key_exists('success', $contentRow);

            if ($tagSuccess && $contentSuccess) {

                // return array('success' => 'Item successfully removed');
                return array('id' => $id);
            } else {

                return array(
                    'error' => 'Item '.$id.' partially removed'
                    .((!$tagSuccess) ? '' : ' - failed to remove tags')
                    .((!$contentSuccess) ? '' : ' - failed to remove content')
                );
            }
        }

        return array(
            'error' => 'Failed to remove item '.$id.' in the data base'
        );
    }

    private function add_word()
    {
        if (!isset($input)) {
            $input = [];
        }
        // TO DO
    }

    private function add_content()
    {
        // TO DO
    }
}