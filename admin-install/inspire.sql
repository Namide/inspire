-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Client :  127.0.0.1
-- Généré le :  Sam 07 Avril 2018 à 07:58
-- Version du serveur :  5.7.14
-- Version de PHP :  7.0.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `inspire`
--

-- --------------------------------------------------------

--
-- Structure de la table `directus_activity`
--

CREATE TABLE `directus_activity` (
  `id` int(11) UNSIGNED NOT NULL,
  `type` varchar(100) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `identifier` varchar(100) DEFAULT NULL,
  `table_name` varchar(100) NOT NULL DEFAULT '',
  `row_id` int(11) UNSIGNED DEFAULT '0',
  `user` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `data` text,
  `delta` text,
  `parent_id` int(11) UNSIGNED DEFAULT NULL,
  `parent_table` varchar(100) DEFAULT NULL,
  `parent_changed` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Did the top-level record in the change set alter (scalar values/many-to-one relationships)? Or only the data within its related foreign collection records? (*toMany)',
  `datetime` datetime DEFAULT NULL,
  `logged_ip` varchar(45) DEFAULT NULL,
  `user_agent` varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Contenu de la table `directus_activity`
--

INSERT INTO `directus_activity` (`id`, `type`, `action`, `identifier`, `table_name`, `row_id`, `user`, `data`, `delta`, `parent_id`, `parent_table`, `parent_changed`, `datetime`, `logged_ip`, `user_agent`) VALUES
(1, 'LOGIN', 'LOGIN', NULL, 'directus_users', 0, 1, NULL, NULL, NULL, NULL, 0, '2018-04-04 20:19:00', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'),
(2, 'ENTRY', 'UPDATE', NULL, 'directus_columns', 5, 1, '{"id":"5","table_name":"group","column_name":"id","data_type":null,"ui":"primary_key","relationship_type":null,"related_table":null,"junction_table":null,"junction_key_left":null,"junction_key_right":null,"hidden_input":"0","required":"1","sort":"1","comment":"","options":"[]"}', '{"sort":1,"options":"[]","required":true,"ui":"primary_key","hidden_input":false,"comment":"","relationship_type":null,"related_table":null,"junction_table":null,"junction_key_right":null,"junction_key_left":null,"id":5}', NULL, NULL, 1, '2018-04-04 20:21:44', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'),
(3, 'ENTRY', 'UPDATE', NULL, 'directus_columns', 6, 1, '{"id":"6","table_name":"post","column_name":"id","data_type":null,"ui":"primary_key","relationship_type":null,"related_table":null,"junction_table":null,"junction_key_left":null,"junction_key_right":null,"hidden_input":"0","required":"1","sort":"1","comment":"","options":"[]"}', '{"sort":1,"options":"[]","required":true,"ui":"primary_key","hidden_input":false,"comment":"","relationship_type":null,"related_table":null,"junction_table":null,"junction_key_right":null,"junction_key_left":null,"id":6}', NULL, NULL, 1, '2018-04-04 20:21:53', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'),
(4, 'ENTRY', 'ADD', '1', 'post', 1, 1, '{"id":"1","title":"Dessin color\\u00e9","description":"Style manga","date":"2018-04-04","tags":"manga,color,face,girl","thumb":null,"content_file":null,"content_text":null,"content_link":null,"public":"1","score":"3"}', '[]', NULL, NULL, 1, '2018-04-04 20:32:35', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'),
(5, 'ENTRY', 'ADD', '1', 'directus_files', 2, 1, '{"id":"2","status":"1","name":"musaigen-no-phantom-world.jpg","title":"musaigen no phantom world","location":"","caption":"","type":"image\\/jpeg","charset":"binary","tags":"","width":"1920","height":"1080","size":"598279","embed_id":null,"user":"1","date_uploaded":"2018-04-04 20:33:21","storage_adapter":"local"}', '[]', NULL, NULL, 1, '2018-04-04 20:33:21', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'),
(6, 'ENTRY', 'UPDATE', '1', 'post', 1, 1, '{"id":"1","title":"Dessin color\\u00e9","description":"Style manga","date":"2018-04-04","tags":"manga,color,face,girl","thumb":"2","content_file":null,"content_text":null,"content_link":null,"public":"1","score":"3"}', '{"thumb":2,"id":"1"}', NULL, NULL, 1, '2018-04-04 20:33:21', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'),
(7, 'ENTRY', 'UPDATE', '1', 'directus_files', 2, 1, '{"id":"2","status":"1","name":"musaigen-no-phantom-world.jpg","title":"musaigen no phantom world","location":"","caption":"","type":"image\\/jpeg","charset":"binary","tags":"","width":"1920","height":"1080","size":"598279","embed_id":null,"user":"1","date_uploaded":"2018-04-04 20:33:21","storage_adapter":"local"}', '{"id":2,"status":1,"name":"musaigen-no-phantom-world.jpg","title":"musaigen no phantom world","type":"image\\/jpeg","width":1920,"height":1080,"size":598279,"user":1,"date_uploaded":"2018-04-04T16:33:21-04:00","storage_adapter":"local"}', NULL, NULL, 1, '2018-04-04 20:33:44', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'),
(8, 'ENTRY', 'UPDATE', '1', 'post', 1, 1, '{"id":"1","title":"Dessin color\\u00e9","description":"Style manga","date":"2018-04-04","tags":"manga,color,face,girl","thumb":null,"content_file":"2","content_text":null,"content_link":null,"public":"1","score":"3"}', '{"thumb":null,"content_file":2,"id":"1"}', NULL, NULL, 1, '2018-04-04 20:33:44', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'),
(9, 'ENTRY', 'ADD', NULL, 'directus_privileges', 17, 1, '{"id":"17","table_name":"group","allow_view":"1","allow_add":"0","allow_edit":"0","allow_delete":"0","allow_alter":"0","group_id":"2","read_field_blacklist":null,"write_field_blacklist":null,"nav_listed":"1","status_id":null}', '[]', NULL, NULL, 1, '2018-04-04 20:34:57', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'),
(10, 'ENTRY', 'ADD', NULL, 'directus_privileges', 18, 1, '{"id":"18","table_name":"post","allow_view":"1","allow_add":"0","allow_edit":"0","allow_delete":"0","allow_alter":"0","group_id":"2","read_field_blacklist":null,"write_field_blacklist":null,"nav_listed":"1","status_id":null}', '[]', NULL, NULL, 1, '2018-04-04 20:34:58', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'),
(11, 'ENTRY', 'UPDATE', NULL, 'directus_privileges', 17, 1, '{"id":"17","table_name":"group","allow_view":"2","allow_add":"0","allow_edit":"0","allow_delete":"0","allow_alter":"0","group_id":"2","read_field_blacklist":null,"write_field_blacklist":null,"nav_listed":"1","status_id":null}', '{"allow_view":2,"id":"17"}', NULL, NULL, 1, '2018-04-04 20:34:58', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'),
(12, 'ENTRY', 'UPDATE', NULL, 'directus_privileges', 18, 1, '{"id":"18","table_name":"post","allow_view":"2","allow_add":"0","allow_edit":"0","allow_delete":"0","allow_alter":"0","group_id":"2","read_field_blacklist":null,"write_field_blacklist":null,"nav_listed":"1","status_id":null}', '{"allow_view":2,"id":"18"}', NULL, NULL, 1, '2018-04-04 20:34:58', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'),
(13, 'ENTRY', 'ADD', NULL, 'directus_privileges', 19, 1, '{"id":"19","table_name":"directus_files","allow_view":"1","allow_add":"0","allow_edit":"0","allow_delete":"0","allow_alter":"0","group_id":"2","read_field_blacklist":null,"write_field_blacklist":null,"nav_listed":"1","status_id":null}', '[]', NULL, NULL, 1, '2018-04-04 20:35:03', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'),
(14, 'ENTRY', 'UPDATE', NULL, 'directus_privileges', 19, 1, '{"id":"19","table_name":"directus_files","allow_view":"2","allow_add":"0","allow_edit":"0","allow_delete":"0","allow_alter":"0","group_id":"2","read_field_blacklist":null,"write_field_blacklist":null,"nav_listed":"1","status_id":null}', '{"allow_view":2,"id":"19"}', NULL, NULL, 1, '2018-04-04 20:35:03', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'),
(15, 'FILES', 'ADD', '1', 'directus_files', 3, 1, '{"id":"3","status":"1","name":"avatar-2.jpg","title":"avatar","location":"","caption":"","type":"image\\/jpeg","charset":"binary","tags":"","width":"154","height":"154","size":"37719","embed_id":null,"user":"1","date_uploaded":"2018-04-04 20:48:42","storage_adapter":"local"}', '[]', NULL, NULL, 1, '2018-04-04 20:48:42', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'),
(16, 'FILES', 'ADD', '1', 'directus_files', 4, 1, '{"id":"4","status":"1","name":"avatar-5.jpg","title":"avatar","location":"","caption":"","type":"image\\/jpeg","charset":"binary","tags":"","width":"154","height":"154","size":"37719","color":null,"embed_id":null,"user":"1","date_uploaded":"2018-04-04 20:54:44","storage_adapter":"local"}', '[]', NULL, NULL, 1, '2018-04-04 20:54:44', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'),
(17, 'FILES', 'ADD', '1', 'directus_files', 5, 1, '{"id":"5","status":"1","name":"avatar-8.jpg","title":"avatar","location":"","caption":"","type":"image\\/jpeg","charset":"binary","tags":"","width":"154","height":"154","size":"37719","color":null,"embed_id":null,"user":"1","date_uploaded":"2018-04-04 20:58:04","storage_adapter":"local"}', '[]', NULL, NULL, 1, '2018-04-04 20:58:04', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'),
(18, 'FILES', 'ADD', '1', 'directus_files', 6, 1, '{"id":"6","status":"1","name":"avatar-9.jpg","title":"avatar","location":"","caption":"","type":"image\\/jpeg","charset":"binary","tags":"","width":"154","height":"154","size":"37719","color":null,"embed_id":null,"user":"1","date_uploaded":"2018-04-04 20:58:37","storage_adapter":"local"}', '[]', NULL, NULL, 1, '2018-04-04 20:58:37', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'),
(19, 'FILES', 'ADD', '1', 'directus_files', 7, 1, '{"id":"7","status":"1","name":"avatar-11.jpg","title":"avatar","location":"","caption":"","type":"image\\/jpeg","charset":"binary","tags":"","width":"154","height":"154","size":"37719","color":null,"embed_id":null,"user":"1","date_uploaded":"2018-04-04 20:59:14","storage_adapter":"local"}', '[]', NULL, NULL, 1, '2018-04-04 20:59:14', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'),
(20, 'FILES', 'ADD', '1', 'directus_files', 8, 1, '{"id":"8","status":"1","name":"avatar-12.jpg","title":"avatar","location":"","caption":"","type":"image\\/jpeg","charset":"binary","tags":"","width":"154","height":"154","size":"37719","color":null,"embed_id":null,"user":"1","date_uploaded":"2018-04-04 21:00:18","storage_adapter":"local"}', '[]', NULL, NULL, 1, '2018-04-04 21:00:18', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'),
(21, 'FILES', 'ADD', '1', 'directus_files', 9, 1, '{"id":"9","status":"1","name":"avatar-5.jpg","title":"avatar","location":"","caption":"","type":"image\\/jpeg","charset":"binary","tags":"","width":"154","height":"154","size":"37719","color":null,"embed_id":null,"user":"1","date_uploaded":"2018-04-04 21:16:39","storage_adapter":"local"}', '[]', NULL, NULL, 1, '2018-04-04 21:16:39', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'),
(22, 'FILES', 'ADD', '1', 'directus_files', 10, 1, '{"id":"10","status":"1","name":"avatar-9.jpg","title":"avatar","location":"","caption":"","type":"image\\/jpeg","charset":"binary","tags":"","width":"154","height":"154","size":"37719","color":null,"embed_id":null,"user":"1","date_uploaded":"2018-04-04 21:19:26","storage_adapter":"local"}', '[]', NULL, NULL, 1, '2018-04-04 21:19:26', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'),
(23, 'FILES', 'ADD', '1', 'directus_files', 11, 1, '{"id":"11","status":"1","name":"avatar-14.jpg","title":"avatar","location":"","caption":"","type":"image\\/jpeg","charset":"binary","tags":"","width":"154","height":"154","size":"37719","color":null,"embed_id":null,"user":"1","date_uploaded":"2018-04-04 21:25:22","storage_adapter":"local"}', '[]', NULL, NULL, 1, '2018-04-04 21:25:22', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'),
(24, 'FILES', 'ADD', '1', 'directus_files', 12, 1, '{"id":"12","status":"1","name":"avatar-15.jpg","title":"avatar","location":"","caption":"","type":"image\\/jpeg","charset":"binary","tags":"","width":"154","height":"154","size":"37719","color":null,"embed_id":null,"user":"1","date_uploaded":"2018-04-04 21:26:09","storage_adapter":"local"}', '[]', NULL, NULL, 1, '2018-04-04 21:26:09', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'),
(25, 'FILES', 'ADD', '1', 'directus_files', 13, 1, '{"id":"13","status":"1","name":"avatar-14.jpg","title":"avatar","location":"","caption":"","type":"image\\/jpeg","charset":"binary","tags":"","width":"666","height":"154","size":"37719","color":"FF0077","embed_id":null,"user":"1","date_uploaded":"2018-04-04 21:34:42","storage_adapter":"local"}', '[]', NULL, NULL, 1, '2018-04-04 21:34:42', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'),
(26, 'LOGIN', 'LOGIN', NULL, 'directus_users', 0, 1, NULL, NULL, NULL, NULL, 0, '2018-04-07 07:52:08', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36');

-- --------------------------------------------------------

--
-- Structure de la table `directus_bookmarks`
--

CREATE TABLE `directus_bookmarks` (
  `id` int(11) UNSIGNED NOT NULL,
  `user` int(11) UNSIGNED DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `section` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Contenu de la table `directus_bookmarks`
--

INSERT INTO `directus_bookmarks` (`id`, `user`, `title`, `url`, `section`) VALUES
(1, 1, 'Activity', 'activity', 'other'),
(2, 1, 'Files', 'files', 'other'),
(3, 1, 'Messages', 'messages', 'other'),
(4, 1, 'Users', 'users', 'other');

-- --------------------------------------------------------

--
-- Structure de la table `directus_columns`
--

CREATE TABLE `directus_columns` (
  `id` int(11) UNSIGNED NOT NULL,
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `column_name` varchar(64) NOT NULL DEFAULT '',
  `data_type` varchar(64) DEFAULT NULL,
  `ui` varchar(64) DEFAULT NULL,
  `relationship_type` enum('MANYTOONE','MANYTOMANY','ONETOMANY') DEFAULT NULL,
  `related_table` varchar(64) DEFAULT NULL,
  `junction_table` varchar(64) DEFAULT NULL,
  `junction_key_left` varchar(64) DEFAULT NULL,
  `junction_key_right` varchar(64) DEFAULT NULL,
  `hidden_input` tinyint(1) NOT NULL DEFAULT '0',
  `required` tinyint(1) NOT NULL DEFAULT '0',
  `sort` int(11) DEFAULT NULL,
  `comment` varchar(1024) DEFAULT NULL,
  `options` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Contenu de la table `directus_columns`
--

INSERT INTO `directus_columns` (`id`, `table_name`, `column_name`, `data_type`, `ui`, `relationship_type`, `related_table`, `junction_table`, `junction_key_left`, `junction_key_right`, `hidden_input`, `required`, `sort`, `comment`, `options`) VALUES
(1, 'directus_users', 'group', NULL, 'many_to_one', 'MANYTOONE', 'directus_groups', NULL, NULL, 'group_id', 0, 0, NULL, '', NULL),
(2, 'directus_users', 'avatar_file_id', 'INT', 'single_file', 'MANYTOONE', 'directus_files', NULL, NULL, 'avatar_file_id', 0, 0, NULL, '', NULL),
(3, 'directus_groups', 'users', 'ALIAS', 'directus_users', 'ONETOMANY', 'directus_users', NULL, NULL, 'group', 0, 0, NULL, NULL, NULL),
(4, 'directus_groups', 'permissions', 'ALIAS', 'directus_permissions', 'ONETOMANY', 'directus_privileges', NULL, NULL, 'group_id', 0, 0, NULL, NULL, NULL),
(7, 'post', 'id', 'INT', 'primary_key', NULL, NULL, NULL, NULL, NULL, 1, 0, 0, NULL, NULL),
(8, 'post', 'title', 'TINYTEXT', 'text_input', NULL, NULL, NULL, NULL, NULL, 0, 0, 1, 'Title of the post (optional for image post)', NULL),
(9, 'post', 'description', 'TEXT', 'textarea', NULL, NULL, NULL, NULL, NULL, 0, 0, 2, 'Description of the post (optional)', NULL),
(10, 'post', 'date', 'DATE', 'date', NULL, NULL, NULL, NULL, NULL, 0, 0, 3, '', NULL),
(11, 'post', 'tags', 'TINYTEXT', 'tags', NULL, NULL, NULL, NULL, NULL, 0, 0, 4, 'Simple and explicit tags', NULL),
(12, 'post', 'thumb', 'INT', 'single_file', 'MANYTOONE', 'directus_files', NULL, NULL, 'thumb', 0, 0, 5, 'Optional', NULL),
(13, 'post', 'content_file', 'INT', 'single_file', 'MANYTOONE', 'directus_files', NULL, NULL, 'content_file', 0, 0, 6, '', NULL),
(14, 'post', 'content_text', 'TEXT', 'markdown', NULL, NULL, NULL, NULL, NULL, 0, 0, 7, '', NULL),
(15, 'post', 'content_link', 'TINYTEXT', 'text_input', NULL, NULL, NULL, NULL, NULL, 0, 0, 8, '', NULL),
(16, 'post', 'public', 'TINYINT', 'toggle', NULL, NULL, NULL, NULL, NULL, 0, 0, 9, '', NULL),
(17, 'post', 'score', 'INT', 'rating', NULL, NULL, NULL, NULL, NULL, 0, 0, 10, '', NULL),
(18, 'group', 'id', 'INT', 'primary_key', NULL, NULL, NULL, NULL, NULL, 1, 0, 0, NULL, NULL),
(19, 'group', 'title', 'TINYTEXT', 'text_input', NULL, NULL, NULL, NULL, NULL, 0, 0, 1, '', NULL),
(20, 'group', 'description', 'TEXT', 'textarea', NULL, NULL, NULL, NULL, NULL, 0, 0, 2, '', NULL),
(21, 'group', 'thumb', 'INT', 'single_file', 'MANYTOONE', 'directus_files', NULL, NULL, 'thumb', 0, 0, 3, '', NULL),
(22, 'group', 'selector_tags', 'TINYTEXT', 'tags', NULL, NULL, NULL, NULL, NULL, 0, 0, 4, '', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `directus_files`
--

CREATE TABLE `directus_files` (
  `id` int(11) UNSIGNED NOT NULL,
  `status` tinyint(1) DEFAULT '1',
  `name` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT '',
  `location` varchar(200) DEFAULT NULL,
  `caption` text,
  `type` varchar(255) DEFAULT '',
  `charset` varchar(50) DEFAULT '',
  `tags` varchar(255) DEFAULT '',
  `width` int(11) UNSIGNED DEFAULT '0',
  `height` int(11) UNSIGNED DEFAULT '0',
  `size` int(11) UNSIGNED DEFAULT '0',
  `color` tinytext,
  `embed_id` varchar(200) DEFAULT NULL,
  `user` int(11) UNSIGNED NOT NULL,
  `date_uploaded` datetime DEFAULT NULL,
  `storage_adapter` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Contenu de la table `directus_files`
--

INSERT INTO `directus_files` (`id`, `status`, `name`, `title`, `location`, `caption`, `type`, `charset`, `tags`, `width`, `height`, `size`, `color`, `embed_id`, `user`, `date_uploaded`, `storage_adapter`) VALUES
(1, 1, '00000000001.jpg', 'Mountain Range', 'Earth', 'A gorgeous view of this wooded mountain range', 'image/jpeg', 'binary', 'trees,rocks,nature,mountains,forest', 1800, 1200, 602058, NULL, NULL, 1, '2018-04-04 20:18:49', 'local'),
(2, 1, 'musaigen-no-phantom-world.jpg', 'musaigen no phantom world', '', '', 'image/jpeg', 'binary', '', 1920, 1080, 598279, NULL, NULL, 1, '2018-04-04 20:33:21', 'local');

-- --------------------------------------------------------

--
-- Structure de la table `directus_groups`
--

CREATE TABLE `directus_groups` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `restrict_to_ip_whitelist` text,
  `nav_override` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Contenu de la table `directus_groups`
--

INSERT INTO `directus_groups` (`id`, `name`, `description`, `restrict_to_ip_whitelist`, `nav_override`) VALUES
(1, 'Administrator', 'Admins have access to all managed data within the system by default', NULL, NULL),
(2, 'Public', 'This sets the data that is publicly available through the API without a token', NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `directus_messages`
--

CREATE TABLE `directus_messages` (
  `id` int(11) UNSIGNED NOT NULL,
  `from` int(11) UNSIGNED DEFAULT NULL,
  `subject` varchar(255) NOT NULL DEFAULT '',
  `message` text NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `attachment` varchar(512) DEFAULT NULL,
  `response_to` int(11) UNSIGNED DEFAULT NULL,
  `comment_metadata` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `directus_messages_recipients`
--

CREATE TABLE `directus_messages_recipients` (
  `id` int(11) UNSIGNED NOT NULL,
  `message_id` int(11) UNSIGNED NOT NULL,
  `recipient` int(11) UNSIGNED NOT NULL,
  `read` tinyint(1) NOT NULL,
  `group` int(11) UNSIGNED DEFAULT NULL,
  `archived` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `directus_preferences`
--

CREATE TABLE `directus_preferences` (
  `id` int(11) UNSIGNED NOT NULL,
  `user` int(11) UNSIGNED DEFAULT NULL,
  `table_name` varchar(64) DEFAULT NULL,
  `title` varchar(128) DEFAULT NULL,
  `columns_visible` varchar(300) DEFAULT NULL,
  `sort` varchar(64) DEFAULT 'id',
  `sort_order` varchar(5) DEFAULT 'ASC',
  `status` varchar(64) DEFAULT '3',
  `search_string` text,
  `list_view_options` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Contenu de la table `directus_preferences`
--

INSERT INTO `directus_preferences` (`id`, `user`, `table_name`, `title`, `columns_visible`, `sort`, `sort_order`, `status`, `search_string`, `list_view_options`) VALUES
(1, 1, 'directus_activity', NULL, 'type,action,identifier,table_name,row_id,user,data', 'id', 'ASC', '1,2', NULL, NULL),
(2, 1, 'directus_bookmarks', NULL, 'user,title,url,section', 'id', 'ASC', '1,2', NULL, NULL),
(3, 1, 'directus_files', NULL, 'name,title,location,caption,type,charset,tags', 'date_uploaded', 'DESC', '1,2', NULL, NULL),
(4, 1, 'directus_groups', NULL, 'name,description,restrict_to_ip_whitelist,nav_override,users,permissions', 'id', 'ASC', '1,2', NULL, NULL),
(5, 1, 'directus_messages', NULL, 'from,subject,message,datetime,attachment,response_to,comment_metadata', 'id', 'ASC', '1,2', NULL, NULL),
(6, 1, 'directus_messages_recipients', NULL, 'message_id,recipient,read,group,archived', 'id', 'ASC', '1,2', NULL, NULL),
(7, 1, 'directus_schema_migrations', NULL, 'version', 'id', 'ASC', '1,2', NULL, NULL),
(8, 1, 'directus_users', NULL, 'first_name,last_name,email,password,salt,token,access_token', 'id', 'ASC', '1,2', NULL, NULL),
(11, 1, 'post', NULL, 'title,description,date,tags,thumb,content_file,content_text', 'id', 'ASC', '1,2', NULL, '{"spacing":"cozy","currentView":"table"}'),
(12, 1, 'group', NULL, 'title,description,thumb,selector_tags', 'id', 'ASC', '1,2', NULL, '{"spacing":"cozy","currentView":"table"}');

-- --------------------------------------------------------

--
-- Structure de la table `directus_privileges`
--

CREATE TABLE `directus_privileges` (
  `id` int(11) UNSIGNED NOT NULL,
  `table_name` varchar(255) NOT NULL,
  `allow_view` tinyint(1) NOT NULL DEFAULT '0',
  `allow_add` tinyint(1) NOT NULL DEFAULT '0',
  `allow_edit` tinyint(1) NOT NULL DEFAULT '0',
  `allow_delete` tinyint(1) NOT NULL DEFAULT '0',
  `allow_alter` tinyint(1) NOT NULL DEFAULT '0',
  `group_id` int(11) UNSIGNED NOT NULL,
  `read_field_blacklist` varchar(1000) DEFAULT NULL,
  `write_field_blacklist` varchar(1000) CHARACTER SET latin1 DEFAULT NULL,
  `nav_listed` tinyint(1) NOT NULL DEFAULT '1',
  `status_id` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Contenu de la table `directus_privileges`
--

INSERT INTO `directus_privileges` (`id`, `table_name`, `allow_view`, `allow_add`, `allow_edit`, `allow_delete`, `allow_alter`, `group_id`, `read_field_blacklist`, `write_field_blacklist`, `nav_listed`, `status_id`) VALUES
(1, 'directus_activity', 2, 1, 2, 2, 1, 1, NULL, NULL, 1, NULL),
(2, 'directus_columns', 2, 1, 2, 2, 1, 1, NULL, NULL, 1, NULL),
(3, 'directus_groups', 2, 1, 2, 2, 1, 1, NULL, NULL, 1, NULL),
(4, 'directus_files', 2, 1, 2, 2, 1, 1, NULL, NULL, 1, NULL),
(5, 'directus_messages', 2, 1, 2, 2, 1, 1, NULL, NULL, 1, NULL),
(6, 'directus_preferences', 2, 1, 2, 2, 1, 1, NULL, NULL, 1, NULL),
(7, 'directus_privileges', 2, 1, 2, 2, 1, 1, NULL, NULL, 1, NULL),
(8, 'directus_settings', 2, 1, 2, 2, 1, 1, NULL, NULL, 1, NULL),
(9, 'directus_tables', 2, 1, 2, 2, 1, 1, NULL, NULL, 1, NULL),
(10, 'directus_users', 2, 1, 2, 2, 1, 1, NULL, NULL, 1, NULL),
(11, 'directus_messages_recipients', 2, 1, 2, 2, 1, 1, NULL, NULL, 1, NULL),
(12, 'directus_bookmarks', 2, 1, 2, 2, 1, 1, NULL, NULL, 1, NULL),
(15, 'post', 2, 1, 2, 2, 1, 1, NULL, NULL, 1, NULL),
(16, 'group', 2, 1, 2, 2, 1, 1, NULL, NULL, 1, NULL),
(17, 'group', 2, 0, 0, 0, 0, 2, NULL, NULL, 1, NULL),
(18, 'post', 2, 0, 0, 0, 0, 2, NULL, NULL, 1, NULL),
(19, 'directus_files', 2, 0, 0, 0, 0, 2, NULL, NULL, 1, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `directus_schema_migrations`
--

CREATE TABLE `directus_schema_migrations` (
  `version` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `directus_schema_migrations`
--

INSERT INTO `directus_schema_migrations` (`version`) VALUES
('20150203221946'),
('20150203235646'),
('20150204002341'),
('20150204003426'),
('20150204015251'),
('20150204021255'),
('20150204022237'),
('20150204023325'),
('20150204024327'),
('20150204031412'),
('20150204041007'),
('20150204042725');

-- --------------------------------------------------------

--
-- Structure de la table `directus_settings`
--

CREATE TABLE `directus_settings` (
  `id` int(11) UNSIGNED NOT NULL,
  `collection` varchar(64) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Contenu de la table `directus_settings`
--

INSERT INTO `directus_settings` (`id`, `collection`, `name`, `value`) VALUES
(1, 'global', 'cms_user_auto_sign_out', '60'),
(2, 'global', 'project_name', 'Inspire'),
(3, 'global', 'project_url', 'http://inspire.local/admin/'),
(4, 'global', 'rows_per_page', '200'),
(5, 'files', 'thumbnail_quality', '90'),
(6, 'files', 'thumbnail_size', '200'),
(7, 'global', 'cms_thumbnail_url', ''),
(8, 'files', 'file_naming', 'file_name'),
(9, 'files', 'thumbnail_crop_enabled', '0'),
(10, 'files', 'youtube_api_key', ''),
(11, 'global', 'google_api_key', '');

-- --------------------------------------------------------

--
-- Structure de la table `directus_tables`
--

CREATE TABLE `directus_tables` (
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `display_template` varchar(255) DEFAULT '',
  `preview_url` varchar(255) DEFAULT '',
  `hidden` tinyint(1) NOT NULL DEFAULT '0',
  `single` tinyint(1) NOT NULL DEFAULT '0',
  `default_status` tinyint(1) NOT NULL DEFAULT '1',
  `footer` tinyint(1) DEFAULT '0',
  `column_groupings` varchar(255) DEFAULT NULL,
  `primary_column` varchar(64) DEFAULT NULL,
  `sort_column` varchar(64) DEFAULT NULL,
  `status_column` varchar(64) DEFAULT NULL,
  `status_mapping` text,
  `user_create_column` varchar(64) DEFAULT NULL,
  `user_update_column` varchar(64) DEFAULT NULL,
  `date_create_column` varchar(64) DEFAULT NULL,
  `date_update_column` varchar(64) DEFAULT NULL,
  `filter_column_blacklist` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Contenu de la table `directus_tables`
--

INSERT INTO `directus_tables` (`table_name`, `display_template`, `preview_url`, `hidden`, `single`, `default_status`, `footer`, `column_groupings`, `primary_column`, `sort_column`, `status_column`, `status_mapping`, `user_create_column`, `user_update_column`, `date_create_column`, `date_update_column`, `filter_column_blacklist`) VALUES
('directus_bookmarks', '', '', 1, 0, 1, 0, NULL, NULL, NULL, NULL, NULL, 'user', NULL, NULL, NULL, NULL),
('directus_files', '', '', 1, 0, 1, 0, NULL, NULL, NULL, NULL, NULL, 'user', NULL, NULL, NULL, NULL),
('directus_messages_recipients', '', '', 1, 0, 1, 0, NULL, NULL, NULL, NULL, NULL, 'recipient', NULL, NULL, NULL, NULL),
('directus_preferences', '', '', 1, 0, 1, 0, NULL, NULL, NULL, NULL, NULL, 'user', NULL, NULL, NULL, NULL),
('directus_users', '', '', 1, 0, 1, 0, NULL, NULL, NULL, NULL, NULL, 'id', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `directus_users`
--

CREATE TABLE `directus_users` (
  `id` int(11) UNSIGNED NOT NULL,
  `status` tinyint(1) DEFAULT '1',
  `first_name` varchar(50) DEFAULT '',
  `last_name` varchar(50) DEFAULT '',
  `email` varchar(128) NOT NULL DEFAULT '',
  `password` varchar(255) DEFAULT '',
  `salt` varchar(255) DEFAULT '',
  `token` varchar(128) DEFAULT NULL,
  `access_token` varchar(255) DEFAULT '',
  `reset_token` varchar(255) DEFAULT '',
  `reset_expiration` datetime DEFAULT NULL,
  `position` varchar(500) DEFAULT '',
  `email_messages` tinyint(1) DEFAULT '1',
  `last_login` datetime DEFAULT NULL,
  `last_access` datetime DEFAULT NULL,
  `last_page` varchar(255) DEFAULT '',
  `ip` varchar(50) DEFAULT '',
  `group` int(11) UNSIGNED DEFAULT NULL,
  `avatar` varchar(500) DEFAULT NULL,
  `avatar_file_id` int(11) UNSIGNED DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(2) DEFAULT NULL,
  `country` char(2) DEFAULT NULL,
  `zip` varchar(10) DEFAULT NULL,
  `language` varchar(8) DEFAULT 'en',
  `timezone` varchar(32) DEFAULT 'America/New_York',
  `invite_token` varchar(255) DEFAULT NULL,
  `invite_date` datetime DEFAULT NULL,
  `invite_sender` int(11) UNSIGNED DEFAULT NULL,
  `invite_accepted` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Contenu de la table `directus_users`
--

INSERT INTO `directus_users` (`id`, `status`, `first_name`, `last_name`, `email`, `password`, `salt`, `token`, `access_token`, `reset_token`, `reset_expiration`, `position`, `email_messages`, `last_login`, `last_access`, `last_page`, `ip`, `group`, `avatar`, `avatar_file_id`, `location`, `phone`, `address`, `city`, `state`, `country`, `zip`, `language`, `timezone`, `invite_token`, `invite_date`, `invite_sender`, `invite_accepted`) VALUES
(1, 1, 'Admin', 'User', 'damien.git@gmail.com', '$2y$12$FiDiQ1CFJ5CxgLXlFcesDe09lQyqhrcOQcz2/hTxbhAKN6D3evOs.', '4iLHMEnnGW50CSl3', 'ldhxOlXaaZK9az8K0UlVH2N0tfYC6Ta3', '9ef60d1d98383a765adbb887f264f1b74ce4f92d', '', NULL, '', 1, '2018-04-07 07:52:08', '2018-04-07 07:54:17', '{"path":"settings","route":"settings"}', '127.0.0.1', 1, '//www.gravatar.com/avatar/04c78479df8bc6886453459f106d0a92?s=200&d=identicon&r=g', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'en', 'America/New_York', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `group`
--

CREATE TABLE `group` (
  `id` int(11) NOT NULL,
  `title` tinytext COMMENT '''''',
  `description` text COMMENT '''''',
  `thumb` int(11) DEFAULT NULL COMMENT '''''',
  `selector_tags` tinytext COMMENT ''''''
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `post`
--

CREATE TABLE `post` (
  `id` int(11) NOT NULL,
  `title` tinytext COMMENT '''Title of the post (optional for image post)''',
  `description` text COMMENT '''Description of the post (optional)''',
  `date` date DEFAULT NULL COMMENT '''''',
  `tags` tinytext COMMENT '''Simple and explicit tags''',
  `thumb` int(11) DEFAULT NULL COMMENT '''Optional''',
  `content_file` int(11) DEFAULT NULL COMMENT '''''',
  `content_text` text COMMENT '''''',
  `content_link` tinytext COMMENT '''''',
  `public` tinyint(1) DEFAULT NULL COMMENT '''''',
  `score` int(11) DEFAULT NULL COMMENT ''''''
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Contenu de la table `post`
--

INSERT INTO `post` (`id`, `title`, `description`, `date`, `tags`, `thumb`, `content_file`, `content_text`, `content_link`, `public`, `score`) VALUES
(1, 'Dessin coloré', 'Style manga', '2018-04-04', 'manga,color,face,girl', NULL, 2, NULL, NULL, 1, 3);

--
-- Index pour les tables exportées
--

--
-- Index pour la table `directus_activity`
--
ALTER TABLE `directus_activity`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `directus_bookmarks`
--
ALTER TABLE `directus_bookmarks`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `directus_columns`
--
ALTER TABLE `directus_columns`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `table-column` (`table_name`,`column_name`);

--
-- Index pour la table `directus_files`
--
ALTER TABLE `directus_files`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `directus_groups`
--
ALTER TABLE `directus_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `directus_users_name_unique` (`name`);

--
-- Index pour la table `directus_messages`
--
ALTER TABLE `directus_messages`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `directus_messages_recipients`
--
ALTER TABLE `directus_messages_recipients`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `directus_preferences`
--
ALTER TABLE `directus_preferences`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user` (`user`,`table_name`,`title`),
  ADD UNIQUE KEY `pref_title_constraint` (`user`,`table_name`,`title`);

--
-- Index pour la table `directus_privileges`
--
ALTER TABLE `directus_privileges`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `directus_schema_migrations`
--
ALTER TABLE `directus_schema_migrations`
  ADD UNIQUE KEY `idx_directus_schema_migrations_version` (`version`);

--
-- Index pour la table `directus_settings`
--
ALTER TABLE `directus_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Unique Collection and Name` (`collection`,`name`);

--
-- Index pour la table `directus_tables`
--
ALTER TABLE `directus_tables`
  ADD PRIMARY KEY (`table_name`);

--
-- Index pour la table `directus_users`
--
ALTER TABLE `directus_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `directus_users_email_unique` (`email`),
  ADD UNIQUE KEY `directus_users_token_unique` (`token`);

--
-- Index pour la table `group`
--
ALTER TABLE `group`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `directus_activity`
--
ALTER TABLE `directus_activity`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
--
-- AUTO_INCREMENT pour la table `directus_bookmarks`
--
ALTER TABLE `directus_bookmarks`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT pour la table `directus_columns`
--
ALTER TABLE `directus_columns`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
--
-- AUTO_INCREMENT pour la table `directus_files`
--
ALTER TABLE `directus_files`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT pour la table `directus_groups`
--
ALTER TABLE `directus_groups`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT pour la table `directus_messages`
--
ALTER TABLE `directus_messages`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `directus_messages_recipients`
--
ALTER TABLE `directus_messages_recipients`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `directus_preferences`
--
ALTER TABLE `directus_preferences`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT pour la table `directus_privileges`
--
ALTER TABLE `directus_privileges`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
--
-- AUTO_INCREMENT pour la table `directus_settings`
--
ALTER TABLE `directus_settings`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT pour la table `directus_users`
--
ALTER TABLE `directus_users`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT pour la table `group`
--
ALTER TABLE `group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `post`
--
ALTER TABLE `post`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
