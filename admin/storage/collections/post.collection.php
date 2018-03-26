<?php
 return array (
  'name' => 'post',
  'label' => 'Post',
  '_id' => 'post5aad0aa955b76',
  'fields' => 
  array (
    0 => 
    array (
      'name' => 'title',
      'label' => 'Title',
      'type' => 'text',
      'default' => '',
      'info' => 'Title of the post',
      'group' => '',
      'localize' => true,
      'options' => 
      array (
      ),
      'width' => '1-2',
      'lst' => true,
      'acl' => 
      array (
      ),
      'required' => true,
    ),
    1 => 
    array (
      'name' => 'description',
      'label' => 'Description',
      'type' => 'textarea',
      'default' => '',
      'info' => 'Details of the post',
      'group' => '',
      'localize' => true,
      'options' => 
      array (
      ),
      'width' => '1-2',
      'lst' => false,
      'acl' => 
      array (
      ),
    ),
    2 => 
    array (
      'name' => 'date',
      'label' => 'Date',
      'type' => 'date',
      'default' => '',
      'info' => 'Entry of the post',
      'group' => '',
      'localize' => false,
      'options' => 
      array (
      ),
      'width' => '1-2',
      'lst' => true,
      'acl' => 
      array (
      ),
    ),
    3 => 
    array (
      'name' => 'tags',
      'label' => 'Tags',
      'type' => 'tags',
      'default' => '',
      'info' => 'Simple and explicit tags',
      'group' => '',
      'localize' => false,
      'options' => 
      array (
      ),
      'width' => '1-2',
      'lst' => true,
      'acl' => 
      array (
      ),
      'required' => true,
    ),
    4 => 
    array (
      'name' => 'content',
      'label' => 'Content',
      'type' => 'repeater',
      'default' => '',
      'info' => '',
      'group' => '',
      'localize' => false,
      'options' => 
      array (
        'fields' => 
        array (
          0 => 
          array (
            'type' => 'text',
            'label' => 'Link',
          ),
          1 => 
          array (
            'type' => 'asset',
            'label' => 'Asset',
          ),
          2 => 
          array (
            'type' => 'markdown',
            'label' => 'Information',
          ),
          3 => 
          array (
            'type' => 'code',
            'label' => 'Script',
          ),
        ),
      ),
      'width' => '1-1',
      'lst' => true,
      'acl' => 
      array (
      ),
      'required' => true,
    ),
    5 => 
    array (
      'name' => 'thumb',
      'label' => 'Thumb',
      'type' => 'asset',
      'default' => '',
      'info' => '',
      'group' => '',
      'localize' => false,
      'options' => 
      array (
      ),
      'width' => '1-2',
      'lst' => true,
      'acl' => 
      array (
      ),
      'required' => false,
    ),
    6 => 
    array (
      'name' => 'public',
      'label' => 'Public',
      'type' => 'boolean',
      'default' => '',
      'info' => 'Visible by visitors.',
      'group' => '',
      'localize' => false,
      'options' => 
      array (
        'default' => true,
      ),
      'width' => '1-2',
      'lst' => true,
      'acl' => 
      array (
      ),
    ),
    7 => 
    array (
      'name' => 'score',
      'label' => 'Score',
      'type' => 'rating',
      'default' => '',
      'info' => 'Notation of the post',
      'group' => '',
      'localize' => false,
      'options' => 
      array (
      ),
      'width' => '1-2',
      'lst' => true,
      'acl' => 
      array (
      ),
    ),
  ),
  'sortable' => true,
  'in_menu' => false,
  '_created' => 1521289897,
  '_modified' => 1521986549,
  'color' => '#D8334A',
  'acl' => 
  array (
    'public' => 
    array (
      'entries_view' => true,
      'entries_create' => true,
      'entries_edit' => true,
      'entries_delete' => true,
    ),
    '' => 
    array (
      'collection_edit' => true,
    ),
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
  'description' => 'Content',
  'contentpreview' => 
  array (
    'enabled' => false,
  ),
);