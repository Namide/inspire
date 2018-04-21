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
 * Test and apply the commands from ITEM datas.
 * Can add, set, delete or get items and datas from database.
 *
 * @author Damien Doussaud (namide.com)
 */
class InputHelp {

  private $_private = false;
  private static $_INPUT_TYPE = INPUT_POST; // INPUT_GET or INPUT_POST

  function __construct($private = false) {
    $this->_private = $private;
  }

  /*
   * Test if command is ask (get items, add item...).
   * 
   * @return boolean  true if command is asked, false otherwise.
   */
  public function has_command() {
    
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
  public function apply_command() {

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
  
  private function appy_command_item($data) {
    
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

  private function get_item($datas) {

    /*if (!array_key_exists('type', $datas) &&
        !array_key_exists('id', $datas)) {
      return array('error' => 'Please fill the field "get.type" or "get.id"');
    }*/

    $datas['public'] = ($this->_private) ? 0 : 1;
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

  private function add_item($datas) {

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

  private function set_item($datas) {

    /*$args = array(
        'id' => FILTER_SANITIZE_NUMBER_INT,
        'title' => FILTER_SANITIZE_STRING,
        'description' => FILTER_SANITIZE_STRING,
        'cover' => FILTER_SANITIZE_STRING,
        //'contentText' => FILTER_SANITIZE_STRING,
        'date' => FILTER_SANITIZE_STRING,
        'link' => FILTER_SANITIZE_STRING,
        'score' => FILTER_SANITIZE_NUMBER_FLOAT,
        'state' => FILTER_SANITIZE_NUMBER_INT
    );
    $input = filter_input_array(self::$_INPUT_TYPE, $args);*/

    if (array_key_exists('id', $datas)) {

      
      
      $id = (int) $datas['id'];
      $reply = Item::getInstance()->set($id, $datas);
      if (!array_key_exists('error', $reply)) {
        return $this->get_item( array('id' => $id) );
        /*array(
          'item' => Item::getInstance()->getItem(array('id' => $id))
        );*/
      } else {
        return array(
          'error' => 'You can\'t edit the item ' . $id . ': ' . $reply['error']
        );
      }
    } else {
      return array('error' => '"set.id" required to edit a item');
    }
  }

  private function del_item($input) {

    // get $_POST['id']
    /*$args = array(
        'id' => FILTER_SANITIZE_NUMBER_INT
    );
    $input = filter_input_array(self::$_INPUT_TYPE, $args);

    if (!isset($input))
      $input = array();

    $id = $input['id'];*/
    
    if (!array_key_exists('id', $input)) {
      return array('error' => '"del.id" required to remove a item.');
    }

    $id = (int) $input['id'];

    // Delete tags and contents
    $success = Item::getInstance()->del($id);
    if ($success) {

      $tagRow = array(Enum::$WORD_LABEL_ITEM_ID => $id);
      $contentRow = array(Content::$ROW_LABEL_ITEM_ID => $id);
      $tagSuccess = Word::getInstance()->delByDatas($tagRow);
      $contentSuccess = Content::getInstance()->delByDatas($contentRow);

      // $tagSuccess = array_key_exists('success', $tagSuccess);
      // $contentSuccess = array_key_exists('success', $contentRow);

      if ($tagSuccess && $contentSuccess) {

        // return array('success' => 'Item successfully removed');
        return array('id' => $id);
        
      } else {

        return array(
            'error' => 'Item ' . $id . ' partially removed'
            . ((!$tagSuccess) ? '' : ' - failed to remove tags')
            . ((!$contentSuccess) ? '' : ' - failed to remove content')
        );
      }
    }
    
    return array(
      'error' => 'Failed to remove item ' . $id . ' in the data base'
    );
  }

  private function add_word() {

    /* $args = array(
      'item_id' => FILTER_SANITIZE_NUMBER_INT,
      Word::$TYPE_IS => array(
      'filter' => FILTER_SANITIZE_STRING,
      'flags' => FILTER_REQUIRE_ARRAY
      ),
      Word::$TYPE_TAG => array(
      'filter' => FILTER_SANITIZE_STRING,
      'flags' => FILTER_REQUIRE_ARRAY
      ),
      Word::$TYPE_FORMAT => array(
      'filter' => FILTER_SANITIZE_STRING,
      'flags' => FILTER_REQUIRE_ARRAY
      ),
      '!' . Word::$TYPE_IS => array(
      'filter' => FILTER_SANITIZE_STRING,
      'flags' => FILTER_REQUIRE_ARRAY
      ),
      '!' . Word::$TYPE_TAG => array(
      'filter' => FILTER_SANITIZE_STRING,
      'flags' => FILTER_REQUIRE_ARRAY
      ),
      '!' . Word::$TYPE_FORMAT => array(
      'filter' => FILTER_SANITIZE_STRING,
      'flags' => FILTER_REQUIRE_ARRAY
      )
      );

      $input = filter_input_array(self::$_INPUT_TYPE, $args); */

    if (!isset($input)) {
      $input = array();
    }
    // TO DO
  }

  private function add_content() {

    // TO DO
  }

}
