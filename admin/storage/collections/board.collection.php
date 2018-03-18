<?php
 return array (
  'name' => 'board',
  'label' => 'Board',
  '_id' => 'board5aae8b1890067',
  'fields' => 
  array (
    0 => 
    array (
      'name' => 'title',
      'label' => 'Title',
      'type' => 'text',
      'default' => '',
      'info' => '',
      'group' => '',
      'localize' => true,
      'options' => 
      array (
      ),
      'width' => '1-1',
      'lst' => true,
      'acl' => 
      array (
      ),
      'required' => true,
    ),
    1 => 
    array (
      'name' => 'thumb',
      'label' => 'Thumb',
      'type' => 'image',
      'default' => '',
      'info' => '',
      'group' => '',
      'localize' => false,
      'options' => 
      array (
      ),
      'width' => '1-1',
      'lst' => true,
      'acl' => 
      array (
      ),
    ),
    2 => 
    array (
      'name' => 'description',
      'label' => 'Description',
      'type' => 'text',
      'default' => '',
      'info' => 'Description of the board',
      'group' => '',
      'localize' => false,
      'options' => 
      array (
      ),
      'width' => '1-1',
      'lst' => true,
      'acl' => 
      array (
      ),
    ),
    3 => 
    array (
      'name' => 'types',
      'label' => 'Types',
      'type' => 'multipleselect',
      'default' => '',
      'info' => 'All authorized types',
      'group' => '',
      'localize' => false,
      'options' => 
      array (
        'options' => 'video, sound, image, text, html, link',
      ),
      'width' => '1-1',
      'lst' => true,
      'acl' => 
      array (
      ),
    ),
    4 => 
    array (
      'name' => 'tags',
      'label' => 'Included tags',
      'type' => 'tags',
      'default' => '',
      'info' => 'All required tags (!tag for prohibited tags)',
      'group' => '',
      'localize' => false,
      'options' => 
      array (
      ),
      'width' => '1-1',
      'lst' => true,
      'acl' => 
      array (
      ),
    ),
  ),
  'sortable' => false,
  'in_menu' => false,
  '_created' => 1521388312,
  '_modified' => 1521402105,
  'color' => '#A0D468',
  'acl' => 
  array (
  ),
  'rules' => 
  array (
    'create' => 
    array (
    ),
    'read' => 
    array (
    ),
    'update' => 
    array (
    ),
    'delete' => 
    array (
    ),
  ),
  'description' => 'Group of posts.',
);