DROP TABLE IF EXISTS `group`;

CREATE TABLE `group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` tinytext COMMENT '',
  `description` text COMMENT '',
  `thumb` int(11) DEFAULT NULL COMMENT '',
  `selector_tags` tinytext COMMENT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `post`;

CREATE TABLE `post` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` tinytext COMMENT 'Title of the post (optional for image post)',
  `description` text COMMENT 'Description of the post (optional)',
  `date` date DEFAULT NULL COMMENT '',
  `tags` tinytext COMMENT 'Simple and explicit tags',
  `thumb` int(11) DEFAULT NULL COMMENT 'Optional',
  `content_file` int(11) DEFAULT NULL COMMENT '',
  `content_text` text COMMENT '',
  `content_link` tinytext COMMENT '',
  `public` tinyint(1) DEFAULT NULL COMMENT '',
  `score` int(11) DEFAULT NULL COMMENT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE `directus_files` ADD `colors` tinytext NULL;


INSERT INTO `directus_preferences` (`id`, `user`, `table_name`, `title`, `columns_visible`, `sort`, `sort_order`, `status`, `search_string`, `list_view_options`) VALUES
	(NULL, 1, 'post', NULL, 'title,description,date,tags,thumb,content_file,content_text', 'id', 'ASC', '1,2', NULL, '{"spacing":"cozy","currentView":"table"}'),
	(NULL, 1, 'group', NULL, 'title,description,thumb,selector_tags', 'id', 'ASC', '1,2', NULL, '{"spacing":"cozy","currentView":"table"}');


INSERT INTO `directus_privileges` (`id`, `table_name`, `allow_view`, `allow_add`, `allow_edit`, `allow_delete`, `allow_alter`, `group_id`, `read_field_blacklist`, `write_field_blacklist`, `nav_listed`, `status_id`) VALUES
	(NULL, 'directus_files', 2, 0, 0, 0, 0, 2, NULL, NULL, 1, NULL),
	(NULL, 'group', 2, 0, 0, 0, 0, 2, NULL, NULL, 1, NULL),
	(NULL, 'post', 2, 0, 0, 0, 0, 2, NULL, NULL, 1, NULL);


INSERT INTO `directus_columns` (`id`, `table_name`, `column_name`, `data_type`, `ui`, `relationship_type`, `related_table`, `junction_table`, `junction_key_left`, `junction_key_right`, `hidden_input`, `required`, `sort`, `comment`, `options`) VALUES
	(NULL, 'post', 'id', 'INT', 'primary_key', NULL, NULL, NULL, NULL, NULL, 1, 0, 0, NULL, NULL),
	(NULL, 'post', 'title', 'TINYTEXT', 'text_input', NULL, NULL, NULL, NULL, NULL, 0, 0, 1, 'Title of the post (optional for image post)', NULL),
	(NULL, 'post', 'description', 'TEXT', 'textarea', NULL, NULL, NULL, NULL, NULL, 0, 0, 2, 'Description of the post (optional)', NULL),
	(NULL, 'post', 'date', 'DATE', 'date', NULL, NULL, NULL, NULL, NULL, 0, 0, 3, '', NULL),
	(NULL, 'post', 'tags', 'TINYTEXT', 'tags', NULL, NULL, NULL, NULL, NULL, 0, 0, 4, 'Simple and explicit tags', '{"id":"tags","force_lowercase":0}'),
	(NULL, 'post', 'thumb', 'INT', 'single_file', 'MANYTOONE', 'directus_files', NULL, NULL, 'thumb', 0, 0, 5, 'Optional', NULL),
	(NULL, 'post', 'content_file', 'INT', 'single_file', 'MANYTOONE', 'directus_files', NULL, NULL, 'content_file', 0, 0, 6, '', NULL),
	(NULL, 'post', 'content_text', 'TEXT', 'markdown', NULL, NULL, NULL, NULL, NULL, 0, 0, 7, '', NULL),
	(NULL, 'post', 'content_link', 'TINYTEXT', 'text_input', NULL, NULL, NULL, NULL, NULL, 0, 0, 8, '', NULL),
	(NULL, 'post', 'public', 'TINYINT', 'toggle', NULL, NULL, NULL, NULL, NULL, 0, 0, 9, '', NULL),
	(NULL, 'post', 'score', 'INT', 'rating', NULL, NULL, NULL, NULL, NULL, 0, 0, 10, '', NULL),
	(NULL, 'group', 'id', 'INT', 'primary_key', NULL, NULL, NULL, NULL, NULL, 1, 0, 0, NULL, NULL),
	(NULL, 'group', 'title', 'TINYTEXT', 'text_input', NULL, NULL, NULL, NULL, NULL, 0, 0, 1, '', NULL),
	(NULL, 'group', 'description', 'TEXT', 'textarea', NULL, NULL, NULL, NULL, NULL, 0, 0, 2, '', NULL),
	(NULL, 'group', 'thumb', 'INT', 'single_file', 'MANYTOONE', 'directus_files', NULL, NULL, 'thumb', 0, 0, 3, '', NULL),
	(NULL, 'group', 'selector_tags', 'TINYTEXT', 'tags', NULL, NULL, NULL, NULL, NULL, 0, 0, 4, '', '{"id":"tags","force_lowercase":0}'),
	(NULL, 'directus_files', 'colors', 'TINYTEXT', 'text_input', NULL, NULL, NULL, NULL, NULL, 1, 0, 17, '', NULL);