/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50560
Source Host           : localhost:3306
Source Database       : appcloud

Target Server Type    : MYSQL
Target Server Version : 50560
File Encoding         : 65001

Date: 2020-01-19 18:14:27
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `cfg_access_type`
-- ----------------------------
DROP TABLE IF EXISTS `cfg_access_type`;
CREATE TABLE `cfg_access_type` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `name` varchar(100) NOT NULL COMMENT '类型名称',
  `title` varchar(100) NOT NULL COMMENT '类型说明',
  `group_id` bigint(20) DEFAULT '0' COMMENT '所属组编号',
  `remark` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cfg_access_type
-- ----------------------------
INSERT INTO `cfg_access_type` VALUES ('1', 'user_file_upload', '用户文件上传', '0', '');
INSERT INTO `cfg_access_type` VALUES ('2', 'user_file_download', '用户文件下载', '0', '');

-- ----------------------------
-- Table structure for `cfg_app_black`
-- ----------------------------
DROP TABLE IF EXISTS `cfg_app_black`;
CREATE TABLE `cfg_app_black` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `image_name` varchar(100) DEFAULT NULL COMMENT '应用映像名称',
  `file_desc` varchar(100) DEFAULT NULL COMMENT '应用描述文本',
  `file_size` int(11) DEFAULT '0' COMMENT '应用文件大小',
  `icon` varchar(100) DEFAULT NULL COMMENT '图标文件名称',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cfg_app_black
-- ----------------------------

-- ----------------------------
-- Table structure for `cfg_as`
-- ----------------------------
DROP TABLE IF EXISTS `cfg_as`;
CREATE TABLE `cfg_as` (
  `account_admin` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Windows账号是否加入管理员组，默认是',
  `desktop_deny` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否禁止普通用户以桌面模式登录，默认否',
  `rdp_port` int(10) NOT NULL COMMENT '默认的RDP端口，默认3389',
  `poll_period` int(10) NOT NULL COMMENT '采集性能数据时的轮循周期，单位秒。默认300'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cfg_as
-- ----------------------------
INSERT INTO `cfg_as` VALUES ('1', '0', '3389', '300');

-- ----------------------------
-- Table structure for `cfg_global`
-- ----------------------------
DROP TABLE IF EXISTS `cfg_global`;
CREATE TABLE `cfg_global` (
  `account_pwd` varchar(100) NOT NULL COMMENT 'Windows账号密码',
  `port` int(10) NOT NULL COMMENT '通讯端口，默认3390'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cfg_global
-- ----------------------------
INSERT INTO `cfg_global` VALUES ('M1@AppCloud', '3390');

-- ----------------------------
-- Table structure for `cfg_license`
-- ----------------------------
DROP TABLE IF EXISTS `cfg_license`;
CREATE TABLE `cfg_license` (
  `file` varchar(1024) DEFAULT NULL COMMENT 'license文件名'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cfg_license
-- ----------------------------

-- ----------------------------
-- Table structure for `cfg_user_access`
-- ----------------------------
DROP TABLE IF EXISTS `cfg_user_access`;
CREATE TABLE `cfg_user_access` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `user_id` bigint(20) NOT NULL COMMENT '用户编号',
  `access_ids` text COMMENT '访问类型编号列表，JSON数组字符串',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cfg_user_access
-- ----------------------------

-- ----------------------------
-- Table structure for `cfg_ws`
-- ----------------------------
DROP TABLE IF EXISTS `cfg_ws`;
CREATE TABLE `cfg_ws` (
  `user_cores` int(11) DEFAULT '0' COMMENT '每个用户允许使用的最大CPU核数',
  `max_timeout` int(11) DEFAULT '0' COMMENT '最大用户登录超时时间，单位：秒',
  `mon_period` int(11) DEFAULT '1' COMMENT '监控采集周末，单位秒'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cfg_ws
-- ----------------------------
INSERT INTO `cfg_ws` VALUES ('1', '900', '2');

-- ----------------------------
-- Table structure for `log_admin`
-- ----------------------------
DROP TABLE IF EXISTS `log_admin`;
CREATE TABLE `log_admin` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `level_id` bigint(20) NOT NULL COMMENT '日志级别编号',
  `event_id` bigint(20) NOT NULL COMMENT '事件编号',
  `source` varchar(520) DEFAULT NULL COMMENT '日志来源',
  `event_tm` datetime DEFAULT '0000-00-00 00:00:00' COMMENT '日志产生时间',
  `record_tm` datetime DEFAULT '0000-00-00 00:00:00' COMMENT '日志记录时间',
  `user_name` varchar(100) DEFAULT NULL COMMENT '日志产生用户名',
  `info` varchar(520) NOT NULL COMMENT '日志说明',
  `detail` text COMMENT '详细日志说明',
  `remark` varchar(1024) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=923 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of log_admin
-- ----------------------------

-- ----------------------------
-- Table structure for `log_app`
-- ----------------------------
DROP TABLE IF EXISTS `log_app`;
CREATE TABLE `log_app` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `level_id` bigint(20) NOT NULL COMMENT '日志级别编号',
  `event_id` bigint(20) NOT NULL COMMENT '事件编号',
  `source` varchar(255) DEFAULT NULL COMMENT '事件来源，此次为app所在主机IP地址',
  `event_tm` datetime DEFAULT NULL COMMENT '事件产生时间',
  `record_tm` datetime DEFAULT NULL COMMENT '事件记录时间',
  `user_name` varchar(100) DEFAULT NULL COMMENT '日志产生用户名',
  `info` varchar(520) NOT NULL COMMENT '常规信息',
  `detail` text COMMENT '详细信息',
  `app_desc` varchar(520) DEFAULT NULL COMMENT '应用描述信息',
  `app_path` varchar(520) DEFAULT NULL COMMENT '应用路径',
  `app_size` int(11) DEFAULT '0' COMMENT '应用程序大小，单位：字节',
  `app_process_id` bigint(20) DEFAULT NULL COMMENT '应用程序进程ID',
  `remark` varchar(1024) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=466 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of log_app
-- ----------------------------

-- ----------------------------
-- Table structure for `log_as`
-- ----------------------------
DROP TABLE IF EXISTS `log_as`;
CREATE TABLE `log_as` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `level_id` bigint(20) NOT NULL COMMENT '日志级别编号',
  `event_id` bigint(20) NOT NULL COMMENT '事件编号',
  `source` varchar(520) DEFAULT NULL COMMENT '事件来源，产生事件的主机IP地址',
  `event_tm` datetime DEFAULT NULL COMMENT '事件产生时间',
  `record_tm` datetime DEFAULT NULL COMMENT '事件记录时间',
  `info` varchar(520) NOT NULL COMMENT '常规事件信息',
  `detail` text COMMENT '详细事件描述',
  `remark` varchar(1024) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=138 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of log_as
-- ----------------------------

-- ----------------------------
-- Table structure for `log_cloud`
-- ----------------------------
DROP TABLE IF EXISTS `log_cloud`;
CREATE TABLE `log_cloud` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `level_id` bigint(20) NOT NULL COMMENT '日志级别编号',
  `event_id` bigint(20) NOT NULL COMMENT '事件编号',
  `source` varchar(520) NOT NULL COMMENT '事件来源',
  `event_tm` datetime DEFAULT NULL COMMENT '事件产生时间',
  `record_tm` datetime DEFAULT NULL COMMENT '记录时间',
  `user_name` varchar(100) DEFAULT NULL COMMENT '日志产生用户名',
  `info` varchar(520) DEFAULT NULL COMMENT '常规信息',
  `detail` text COMMENT '详细信息',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of log_cloud
-- ----------------------------

-- ----------------------------
-- Table structure for `log_event`
-- ----------------------------
DROP TABLE IF EXISTS `log_event`;
CREATE TABLE `log_event` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `name` varchar(100) NOT NULL COMMENT '操作名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30003 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of log_event
-- ----------------------------
INSERT INTO `log_event` VALUES ('1', '查询');
INSERT INTO `log_event` VALUES ('2', '添加');
INSERT INTO `log_event` VALUES ('3', '修改');
INSERT INTO `log_event` VALUES ('4', '删除');
INSERT INTO `log_event` VALUES ('5', '打开');
INSERT INTO `log_event` VALUES ('6', '关闭');
INSERT INTO `log_event` VALUES ('7', '读');
INSERT INTO `log_event` VALUES ('8', '写');
INSERT INTO `log_event` VALUES ('9', '登录');
INSERT INTO `log_event` VALUES ('10', '注销');
INSERT INTO `log_event` VALUES ('11', '会话过期');
INSERT INTO `log_event` VALUES ('12', '更新');
INSERT INTO `log_event` VALUES ('10001', '登录');
INSERT INTO `log_event` VALUES ('10002', '注销');
INSERT INTO `log_event` VALUES ('10003', '添加');
INSERT INTO `log_event` VALUES ('10004', '修改');
INSERT INTO `log_event` VALUES ('10005', '删除');
INSERT INTO `log_event` VALUES ('10006', '会话过期');
INSERT INTO `log_event` VALUES ('20001', '上线');
INSERT INTO `log_event` VALUES ('20002', '离线');
INSERT INTO `log_event` VALUES ('30001', '创建');
INSERT INTO `log_event` VALUES ('30002', '结束');

-- ----------------------------
-- Table structure for `log_level`
-- ----------------------------
DROP TABLE IF EXISTS `log_level`;
CREATE TABLE `log_level` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '级别名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of log_level
-- ----------------------------
INSERT INTO `log_level` VALUES ('1', '信息');
INSERT INTO `log_level` VALUES ('2', '警告');
INSERT INTO `log_level` VALUES ('3', '错误');

-- ----------------------------
-- Table structure for `log_user`
-- ----------------------------
DROP TABLE IF EXISTS `log_user`;
CREATE TABLE `log_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `level_id` bigint(20) NOT NULL COMMENT '日志级别编号',
  `event_id` bigint(20) NOT NULL COMMENT '事件编号',
  `source` varchar(520) DEFAULT NULL COMMENT '日志来源',
  `event_tm` datetime DEFAULT '0000-00-00 00:00:00' COMMENT '日志产生时间',
  `record_tm` datetime DEFAULT '0000-00-00 00:00:00' COMMENT '日志记录时间',
  `user_name` varchar(100) DEFAULT NULL COMMENT '日志产生用户名',
  `info` varchar(520) NOT NULL COMMENT '日志说明',
  `detail` text COMMENT '详细日志说明',
  `remark` varchar(1024) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=765 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of log_user
-- ----------------------------

-- ----------------------------
-- Table structure for `res_account`
-- ----------------------------
DROP TABLE IF EXISTS `res_account`;
CREATE TABLE `res_account` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `uname` varchar(100) NOT NULL COMMENT '账户名称',
  `enable` int(11) DEFAULT '1' COMMENT '账户状态，0为禁用，1为启用',
  `create_tm` datetime NOT NULL COMMENT '创建时间',
  `modify_tm` datetime NOT NULL COMMENT '最后修改时间',
  `status` int(11) NOT NULL DEFAULT '0' COMMENT '账户状态，0代表不正常，1代表正常',
  `op` varchar(100) NOT NULL COMMENT '操作类型,add,del,change',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of res_account
-- ----------------------------

-- ----------------------------
-- Table structure for `res_app`
-- ----------------------------
DROP TABLE IF EXISTS `res_app`;
CREATE TABLE `res_app` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `app_text` varchar(100) NOT NULL COMMENT 'APP标题',
  `app_image` varchar(512) NOT NULL COMMENT '应用程序图标',
  `group_id` bigint(20) DEFAULT NULL COMMENT '应用所属组编号',
  `status` int(11) DEFAULT '1' COMMENT '状态',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of res_app
-- ----------------------------

-- ----------------------------
-- Table structure for `res_app_auth`
-- ----------------------------
DROP TABLE IF EXISTS `res_app_auth`;
CREATE TABLE `res_app_auth` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `app_id` bigint(20) NOT NULL COMMENT 'APP编号',
  `user_id` bigint(20) NOT NULL COMMENT '用户编号',
  `x_left` int(11) DEFAULT '0',
  `y_left` int(11) DEFAULT '0',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of res_app_auth
-- ----------------------------

-- ----------------------------
-- Table structure for `res_app_group`
-- ----------------------------
DROP TABLE IF EXISTS `res_app_group`;
CREATE TABLE `res_app_group` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '组名称',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of res_app_group
-- ----------------------------


-- ----------------------------
-- Table structure for `res_app_map`
-- ----------------------------
DROP TABLE IF EXISTS `res_app_map`;
CREATE TABLE `res_app_map` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `app_id` bigint(20) NOT NULL DEFAULT '0' COMMENT 'APP编号',
  `as_id` bigint(20) NOT NULL DEFAULT '0' COMMENT '主机编号',
  `app_full_file` varchar(512) NOT NULL COMMENT 'APP全路径名称',
  `app_work_path` varchar(512) DEFAULT NULL COMMENT 'APP工作目录',
  `app_param` varchar(1000) DEFAULT NULL COMMENT 'APP运行参数',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of res_app_map
-- ----------------------------

-- ----------------------------
-- Table structure for `res_as`
-- ----------------------------
DROP TABLE IF EXISTS `res_as`;
CREATE TABLE `res_as` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL COMMENT '主机名称',
  `ip_addr` varchar(100) NOT NULL COMMENT 'IP地址',
  `status` int(11) DEFAULT '1' COMMENT '主机状态，1有效，0无效',
  `group_id` bigint(20) DEFAULT '0' COMMENT '主机组编号',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of res_as
-- ----------------------------

-- ----------------------------
-- Table structure for `res_as_auth`
-- ----------------------------
DROP TABLE IF EXISTS `res_as_auth`;
CREATE TABLE `res_as_auth` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `as_id` bigint(20) NOT NULL COMMENT '主机编号',
  `user_id` bigint(20) NOT NULL COMMENT '用户编号',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of res_as_auth
-- ----------------------------


-- ----------------------------
-- Table structure for `res_as_group`
-- ----------------------------
DROP TABLE IF EXISTS `res_as_group`;
CREATE TABLE `res_as_group` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '组名称',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of res_as_group
-- ----------------------------

-- ----------------------------
-- Table structure for `res_image`
-- ----------------------------
DROP TABLE IF EXISTS `res_image`;
CREATE TABLE `res_image` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `rfolder` varchar(512) NOT NULL COMMENT '图标文件相对目录',
  `file_name` varchar(100) NOT NULL COMMENT '文件名称',
  `text` varchar(100) NOT NULL COMMENT '图标标题',
  `width` int(11) DEFAULT '0' COMMENT '图标宽',
  `height` int(11) DEFAULT NULL COMMENT '图标高',
  `size` int(11) DEFAULT NULL COMMENT '图片文件大小，单位：字节',
  `target` varchar(100) DEFAULT NULL COMMENT '应用目标类型，默认为"app"',
  `enable` int(11) DEFAULT NULL COMMENT '允许删除标志，1为允许，0为禁止',
  `position` int(11) DEFAULT '0' COMMENT '显示位置序号',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of res_image
-- ----------------------------
INSERT INTO `res_image` VALUES ('1', 'images/app', 'ai.png', 'ai', '48', '48', null, 'app', '1', '0', null);
INSERT INTO `res_image` VALUES ('2', 'images/app', 'autocad.png', 'AutoCAD', '48', '48', null, 'app', '1', '0', null);
INSERT INTO `res_image` VALUES ('3', 'images/app', 'catia.png', 'Catia', '48', '48', null, 'app', '1', '0', null);
INSERT INTO `res_image` VALUES ('4', 'images/app', 'computer.png', 'computer', '48', '48', null, 'app', '1', '0', null);
INSERT INTO `res_image` VALUES ('5', 'images/app', 'excel.png', 'Excel', '48', '48', null, 'app', '1', '0', null);
INSERT INTO `res_image` VALUES ('6', 'images/app', 'hccad.png', 'hccad', '48', '48', null, 'app', '1', '0', null);
INSERT INTO `res_image` VALUES ('7', 'images/app', 'notepad.png', 'notepad', '48', '48', null, 'app', '1', '0', null);
INSERT INTO `res_image` VALUES ('8', 'images/app', 'paint.png', 'paint', '48', '48', null, 'app', '1', '0', null);
INSERT INTO `res_image` VALUES ('9', 'images/app', 'ppt.png', 'ppt', '48', '48', null, 'app', '1', '0', null);
INSERT INTO `res_image` VALUES ('10', 'images/app', 'ps.png', 'photoshop', '48', '48', null, 'app', '1', '0', null);
INSERT INTO `res_image` VALUES ('11', 'images/app', 'settings.png', 'settings', '48', '48', null, 'app', '1', '0', null);
INSERT INTO `res_image` VALUES ('12', 'images/app', 'ug.png', 'UG', '48', '48', null, 'app', '1', '0', null);
INSERT INTO `res_image` VALUES ('13', 'images/app', 'word.png', 'Word', '48', '48', null, 'app', '1', '0', null);
INSERT INTO `res_image` VALUES ('14', 'images/app', 'bat.png', 'bat', '48', '48', null, 'app', '1', '0', null);
INSERT INTO `res_image` VALUES ('15', 'images/app', 'proe.png', 'ProE', '48', '48', null, 'app', '1', '0', null);
INSERT INTO `res_image` VALUES ('16', 'images/app/owner', '2020_01_15_16_31_31_3dmax.png', '3dmax', '0', '0', '3673', 'app', '1', '0', 'owner');
INSERT INTO `res_image` VALUES ('17', 'images/app', 'InDesign.png', 'InDesign', '48', '48', null, 'app', '1', '0', null);

-- ----------------------------
-- Table structure for `res_image_owner`
-- ----------------------------
DROP TABLE IF EXISTS `res_image_owner`;
CREATE TABLE `res_image_owner` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `rfolder` varchar(512) NOT NULL COMMENT '图标文件相对目录',
  `file_name` varchar(100) NOT NULL COMMENT '文件名称',
  `file_name_index` int(11) DEFAULT '0' COMMENT '文件名序号',
  `text` varchar(100) NOT NULL COMMENT '图标标题',
  `width` int(11) DEFAULT '0' COMMENT '图标宽',
  `height` int(11) DEFAULT NULL COMMENT '图标高',
  `size` int(11) DEFAULT NULL COMMENT '图片文件大小，单位：字节',
  `target` varchar(100) DEFAULT NULL COMMENT '应用目标类型，默认为"app"',
  `enable` int(11) DEFAULT NULL COMMENT '允许删除标志，1为允许，0为禁止',
  `position` int(11) DEFAULT '0' COMMENT '显示位置序号',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of res_image_owner
-- ----------------------------

-- ----------------------------
-- Table structure for `res_theme`
-- ----------------------------
DROP TABLE IF EXISTS `res_theme`;
CREATE TABLE `res_theme` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `rfolder` varchar(512) NOT NULL COMMENT '相对目录',
  `file_name` varchar(100) NOT NULL COMMENT '文件名称',
  `text` varchar(100) DEFAULT NULL COMMENT '文件标题',
  `user_id` bigint(20) DEFAULT '0' COMMENT '用户编号',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of res_theme
-- ----------------------------
INSERT INTO `res_theme` VALUES ('1', 'images', 'desk_gb.jpg', 'win7', '0', '默认');
INSERT INTO `res_theme` VALUES ('2', 'images/theme', 'theme001.jpg', '水滴', '0', null);
INSERT INTO `res_theme` VALUES ('3', 'images/theme', 'theme002.jpg', 'win8', '0', null);
INSERT INTO `res_theme` VALUES ('4', 'images/theme', 'theme003.jpg', '卡通', '0', null);
INSERT INTO `res_theme` VALUES ('5', 'images/theme', 'theme004.jpg', '花', '0', null);
INSERT INTO `res_theme` VALUES ('6', 'images/theme', 'theme005.jpg', '花', '0', null);
INSERT INTO `res_theme` VALUES ('7', 'images/theme', 'theme006.jpeg', '花', '0', null);
INSERT INTO `res_theme` VALUES ('8', 'images/theme', 'theme007.jpg', '蓝天白云', '0', null);
INSERT INTO `res_theme` VALUES ('9', 'images/theme', 'theme008.jpg', '纯色', '0', null);
INSERT INTO `res_theme` VALUES ('10', 'images/theme', 'theme009.jpg', '日出', '0', null);
INSERT INTO `res_theme` VALUES ('11', 'images/theme', 'theme010.jpg', '雪景', '0', null);

-- ----------------------------
-- Table structure for `res_user`
-- ----------------------------
DROP TABLE IF EXISTS `res_user`;
CREATE TABLE `res_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '用户昵称',
  `alias` varchar(100) NOT NULL COMMENT '用户别名',
  `pswd` varchar(100) DEFAULT NULL COMMENT '密码',
  `group_id` bigint(20) DEFAULT '0' COMMENT '用户所属组编号',
  `weight` int(11) DEFAULT '1' COMMENT '权限值，默认为1，0权限最大',
  `status` int(11) DEFAULT '1' COMMENT '用户状态，0为无效，1为有效',
  `ext_f0` varchar(512) DEFAULT NULL COMMENT '主题背景文件名称',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of res_user
-- ----------------------------
INSERT INTO `res_user` VALUES ('1', 'admin', 'admin', 'e10adc3949ba59abbe56e057f20f883e', '0', '0', '1', null, '');

-- ----------------------------
-- Table structure for `res_user_group`
-- ----------------------------
DROP TABLE IF EXISTS `res_user_group`;
CREATE TABLE `res_user_group` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '组名称',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of res_user_group
-- ----------------------------

-- ----------------------------
-- Table structure for `res_user_session`
-- ----------------------------
DROP TABLE IF EXISTS `res_user_session`;
CREATE TABLE `res_user_session` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL COMMENT '用户编号',
  `user_name` varchar(100) DEFAULT NULL COMMENT '用户名称',
  `weight` int(11) DEFAULT '1' COMMENT '用户权限值',
  `create_tm` datetime DEFAULT NULL COMMENT '第一次登录时间',
  `login_tm` datetime DEFAULT NULL COMMENT '最后一次登录时间',
  `last_tm` datetime DEFAULT NULL COMMENT '最后一次注销时间',
  `status` int(11) DEFAULT '0' COMMENT '登录状态，0为未登录，1为已登录',
  `token` varchar(1000) DEFAULT NULL COMMENT '令牌字符串',
  `policy_ip_addr` varchar(100) DEFAULT NULL COMMENT '派遣策略服务器IP地址',
  `client_ip_addr` varchar(100) DEFAULT NULL COMMENT '客户端登录IP地址',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of res_user_session
-- ----------------------------

-- ----------------------------
-- Table structure for `statis_app`
-- ----------------------------
DROP TABLE IF EXISTS `statis_app`;
CREATE TABLE `statis_app` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `file_name` varchar(512) DEFAULT NULL COMMENT '应用名称',
  `app_full_name` varchar(512) DEFAULT NULL COMMENT '应用全路径名称',
  `app_desc` varchar(100) DEFAULT NULL COMMENT '应用描述',
  `app_size` int(11) DEFAULT '0' COMMENT '应用大小，单位：字节',
  `cycle_id` bigint(20) DEFAULT NULL COMMENT '统计周期编号',
  `cycle_tm` datetime DEFAULT NULL COMMENT '统计时间',
  `begin_tm` datetime DEFAULT NULL COMMENT '统计开始时间',
  `end_tm` datetime DEFAULT NULL COMMENT '统计结束时间',
  `host_count` int(11) DEFAULT '0' COMMENT '运行应用的主机个数',
  `user_count` int(11) DEFAULT NULL COMMENT '应用使用用户数',
  `app_inst_count` int(11) DEFAULT '0' COMMENT '应用实例数',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of statis_app
-- ----------------------------

-- ----------------------------
-- Table structure for `statis_app_halfyear`
-- ----------------------------
DROP TABLE IF EXISTS `statis_app_halfyear`;
CREATE TABLE `statis_app_halfyear` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `file_name` varchar(512) DEFAULT NULL COMMENT '应用名称',
  `app_full_name` varchar(512) DEFAULT NULL COMMENT '应用全路径名称',
  `app_desc` varchar(100) DEFAULT NULL COMMENT '应用描述',
  `app_size` int(11) DEFAULT '0' COMMENT '应用大小，单位：字节',
  `cycle_id` bigint(20) DEFAULT NULL COMMENT '统计周期编号',
  `cycle_tm` datetime DEFAULT NULL COMMENT '统计时间',
  `begin_tm` datetime DEFAULT NULL COMMENT '统计开始时间',
  `end_tm` datetime DEFAULT NULL COMMENT '统计结束时间',
  `host_count` int(11) DEFAULT '0' COMMENT '运行应用的主机个数',
  `user_count` int(11) DEFAULT NULL COMMENT '应用使用用户数',
  `app_inst_count` int(11) DEFAULT '0' COMMENT '应用实例数',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of statis_app_halfyear
-- ----------------------------

-- ----------------------------
-- Table structure for `statis_app_month`
-- ----------------------------
DROP TABLE IF EXISTS `statis_app_month`;
CREATE TABLE `statis_app_month` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `file_name` varchar(512) DEFAULT NULL COMMENT '应用名称',
  `app_full_name` varchar(512) DEFAULT NULL COMMENT '应用全路径名称',
  `app_desc` varchar(100) DEFAULT NULL COMMENT '应用描述',
  `app_size` int(11) DEFAULT '0' COMMENT '应用大小，单位：字节',
  `cycle_id` bigint(20) DEFAULT NULL COMMENT '统计周期编号',
  `cycle_tm` datetime DEFAULT NULL COMMENT '统计时间',
  `begin_tm` datetime DEFAULT NULL COMMENT '统计开始时间',
  `end_tm` datetime DEFAULT NULL COMMENT '统计结束时间',
  `host_count` int(11) DEFAULT '0' COMMENT '运行应用的主机个数',
  `user_count` int(11) DEFAULT NULL COMMENT '应用使用用户数',
  `app_inst_count` int(11) DEFAULT '0' COMMENT '应用实例数',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=187 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of statis_app_month
-- ----------------------------

-- ----------------------------
-- Table structure for `statis_app_quarter`
-- ----------------------------
DROP TABLE IF EXISTS `statis_app_quarter`;
CREATE TABLE `statis_app_quarter` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `file_name` varchar(512) DEFAULT NULL COMMENT '应用名称',
  `app_full_name` varchar(512) DEFAULT NULL COMMENT '应用全路径名称',
  `app_desc` varchar(100) DEFAULT NULL COMMENT '应用描述',
  `app_size` int(11) DEFAULT '0' COMMENT '应用大小，单位：字节',
  `cycle_id` bigint(20) DEFAULT NULL COMMENT '统计周期编号',
  `cycle_tm` datetime DEFAULT NULL COMMENT '统计时间',
  `begin_tm` datetime DEFAULT NULL COMMENT '统计开始时间',
  `end_tm` datetime DEFAULT NULL COMMENT '统计结束时间',
  `host_count` int(11) DEFAULT '0' COMMENT '运行应用的主机个数',
  `user_count` int(11) DEFAULT NULL COMMENT '应用使用用户数',
  `app_inst_count` int(11) DEFAULT '0' COMMENT '应用实例数',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of statis_app_quarter
-- ----------------------------

-- ----------------------------
-- Table structure for `statis_app_week`
-- ----------------------------
DROP TABLE IF EXISTS `statis_app_week`;
CREATE TABLE `statis_app_week` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `file_name` varchar(512) DEFAULT NULL COMMENT '应用名称',
  `app_full_name` varchar(512) DEFAULT NULL COMMENT '应用全路径名称',
  `app_desc` varchar(100) DEFAULT NULL COMMENT '应用描述',
  `app_size` int(11) DEFAULT '0' COMMENT '应用大小，单位：字节',
  `cycle_id` bigint(20) DEFAULT NULL COMMENT '统计周期编号',
  `cycle_tm` datetime DEFAULT NULL COMMENT '统计时间',
  `begin_tm` datetime DEFAULT NULL COMMENT '统计开始时间',
  `end_tm` datetime DEFAULT NULL COMMENT '统计结束时间',
  `host_count` int(11) DEFAULT '0' COMMENT '运行应用的主机个数',
  `user_count` int(11) DEFAULT NULL COMMENT '应用使用用户数',
  `app_inst_count` int(11) DEFAULT '0' COMMENT '应用实例数',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of statis_app_week
-- ----------------------------

-- ----------------------------
-- Table structure for `statis_app_year`
-- ----------------------------
DROP TABLE IF EXISTS `statis_app_year`;
CREATE TABLE `statis_app_year` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `file_name` varchar(512) DEFAULT NULL COMMENT '应用名称',
  `app_full_name` varchar(512) DEFAULT NULL COMMENT '应用全路径名称',
  `app_desc` varchar(100) DEFAULT NULL COMMENT '应用描述',
  `app_size` int(11) DEFAULT '0' COMMENT '应用大小，单位：字节',
  `cycle_id` bigint(20) DEFAULT NULL COMMENT '统计周期编号',
  `cycle_tm` datetime DEFAULT NULL COMMENT '统计时间',
  `begin_tm` datetime DEFAULT NULL COMMENT '统计开始时间',
  `end_tm` datetime DEFAULT NULL COMMENT '统计结束时间',
  `host_count` int(11) DEFAULT '0' COMMENT '运行应用的主机个数',
  `user_count` int(11) DEFAULT NULL COMMENT '应用使用用户数',
  `app_inst_count` int(11) DEFAULT '0' COMMENT '应用实例数',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of statis_app_year
-- ----------------------------

-- ----------------------------
-- Table structure for `statis_as`
-- ----------------------------
DROP TABLE IF EXISTS `statis_as`;
CREATE TABLE `statis_as` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `ip_addr` varchar(100) DEFAULT NULL COMMENT 'IP地址',
  `cycle_id` bigint(20) DEFAULT NULL COMMENT '统计周期编号',
  `cycle_tm` datetime DEFAULT NULL COMMENT '统计时间',
  `begin_tm` datetime DEFAULT NULL COMMENT '统计开始时间',
  `end_tm` datetime DEFAULT NULL COMMENT '统计结束时间',
  `online_count` int(11) DEFAULT '0' COMMENT '统计期内上线次数',
  `offline_count` int(10) DEFAULT '0' COMMENT '统计期内离线次数',
  `user_count` int(11) DEFAULT '0' COMMENT '总共登录用户数',
  `app_count` int(11) DEFAULT '0' COMMENT '总共创建的应用个数',
  `app_inst_count` int(11) DEFAULT '0' COMMENT '总共创建的应用实例个数',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of statis_as
-- ----------------------------

-- ----------------------------
-- Table structure for `statis_as_halfyear`
-- ----------------------------
DROP TABLE IF EXISTS `statis_as_halfyear`;
CREATE TABLE `statis_as_halfyear` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `ip_addr` varchar(100) DEFAULT NULL COMMENT 'IP地址',
  `cycle_id` bigint(20) DEFAULT NULL COMMENT '统计周期编号',
  `cycle_tm` datetime DEFAULT NULL COMMENT '统计时间',
  `begin_tm` datetime DEFAULT NULL COMMENT '统计开始时间',
  `end_tm` datetime DEFAULT NULL COMMENT '统计结束时间',
  `online_count` int(11) DEFAULT '0' COMMENT '统计期内上线次数',
  `offline_count` int(10) DEFAULT '0' COMMENT '统计期内离线次数',
  `user_count` int(11) DEFAULT '0' COMMENT '总共登录用户数',
  `app_count` int(11) DEFAULT '0' COMMENT '总共创建的应用个数',
  `app_inst_count` int(11) DEFAULT '0' COMMENT '总共创建的应用实例个数',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of statis_as_halfyear
-- ----------------------------

-- ----------------------------
-- Table structure for `statis_as_month`
-- ----------------------------
DROP TABLE IF EXISTS `statis_as_month`;
CREATE TABLE `statis_as_month` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `ip_addr` varchar(100) DEFAULT NULL COMMENT 'IP地址',
  `cycle_id` bigint(20) DEFAULT NULL COMMENT '统计周期编号',
  `cycle_tm` datetime DEFAULT NULL COMMENT '统计时间',
  `begin_tm` datetime DEFAULT NULL COMMENT '统计开始时间',
  `end_tm` datetime DEFAULT NULL COMMENT '统计结束时间',
  `online_count` int(11) DEFAULT '0' COMMENT '统计期内上线次数',
  `offline_count` int(10) DEFAULT '0' COMMENT '统计期内离线次数',
  `user_count` int(11) DEFAULT '0' COMMENT '总共登录用户数',
  `app_count` int(11) DEFAULT '0' COMMENT '总共创建的应用个数',
  `app_inst_count` int(11) DEFAULT '0' COMMENT '总共创建的应用实例个数',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of statis_as_month
-- ----------------------------

-- ----------------------------
-- Table structure for `statis_as_quarter`
-- ----------------------------
DROP TABLE IF EXISTS `statis_as_quarter`;
CREATE TABLE `statis_as_quarter` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `ip_addr` varchar(100) DEFAULT NULL COMMENT 'IP地址',
  `cycle_id` bigint(20) DEFAULT NULL COMMENT '统计周期编号',
  `cycle_tm` datetime DEFAULT NULL COMMENT '统计时间',
  `begin_tm` datetime DEFAULT NULL COMMENT '统计开始时间',
  `end_tm` datetime DEFAULT NULL COMMENT '统计结束时间',
  `online_count` int(11) DEFAULT '0' COMMENT '统计期内上线次数',
  `offline_count` int(10) DEFAULT '0' COMMENT '统计期内离线次数',
  `user_count` int(11) DEFAULT '0' COMMENT '总共登录用户数',
  `app_count` int(11) DEFAULT '0' COMMENT '总共创建的应用个数',
  `app_inst_count` int(11) DEFAULT '0' COMMENT '总共创建的应用实例个数',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of statis_as_quarter
-- ----------------------------

-- ----------------------------
-- Table structure for `statis_as_week`
-- ----------------------------
DROP TABLE IF EXISTS `statis_as_week`;
CREATE TABLE `statis_as_week` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `ip_addr` varchar(100) DEFAULT NULL COMMENT 'IP地址',
  `cycle_id` bigint(20) DEFAULT NULL COMMENT '统计周期编号',
  `cycle_tm` datetime DEFAULT NULL COMMENT '统计时间',
  `begin_tm` datetime DEFAULT NULL COMMENT '统计开始时间',
  `end_tm` datetime DEFAULT NULL COMMENT '统计结束时间',
  `online_count` int(11) DEFAULT '0' COMMENT '统计期内上线次数',
  `offline_count` int(10) DEFAULT '0' COMMENT '统计期内离线次数',
  `user_count` int(11) DEFAULT '0' COMMENT '总共登录用户数',
  `app_count` int(11) DEFAULT '0' COMMENT '总共创建的应用个数',
  `app_inst_count` int(11) DEFAULT '0' COMMENT '总共创建的应用实例个数',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of statis_as_week
-- ----------------------------

-- ----------------------------
-- Table structure for `statis_as_year`
-- ----------------------------
DROP TABLE IF EXISTS `statis_as_year`;
CREATE TABLE `statis_as_year` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `ip_addr` varchar(100) DEFAULT NULL COMMENT 'IP地址',
  `cycle_id` bigint(20) DEFAULT NULL COMMENT '统计周期编号',
  `cycle_tm` datetime DEFAULT NULL COMMENT '统计时间',
  `begin_tm` datetime DEFAULT NULL COMMENT '统计开始时间',
  `end_tm` datetime DEFAULT NULL COMMENT '统计结束时间',
  `online_count` int(11) DEFAULT '0' COMMENT '统计期内上线次数',
  `offline_count` int(10) DEFAULT '0' COMMENT '统计期内离线次数',
  `user_count` int(11) DEFAULT '0' COMMENT '总共登录用户数',
  `app_count` int(11) DEFAULT '0' COMMENT '总共创建的应用个数',
  `app_inst_count` int(11) DEFAULT '0' COMMENT '总共创建的应用实例个数',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of statis_as_year
-- ----------------------------

-- ----------------------------
-- Table structure for `statis_cycle`
-- ----------------------------
DROP TABLE IF EXISTS `statis_cycle`;
CREATE TABLE `statis_cycle` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `name` varchar(100) NOT NULL COMMENT '周期名称',
  `title` varchar(100) NOT NULL COMMENT '周期说明',
  `times` int(11) DEFAULT '0' COMMENT '周期时间值，单位：小时',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of statis_cycle
-- ----------------------------
INSERT INTO `statis_cycle` VALUES ('1', 'day', '天', '24', '一天');
INSERT INTO `statis_cycle` VALUES ('2', 'week', '周', '168', '一周');
INSERT INTO `statis_cycle` VALUES ('3', 'month', '月', '720', '月，按30天算');
INSERT INTO `statis_cycle` VALUES ('4', 'quarter', '季', '2160', '季度，按3个月，每个月30天算');
INSERT INTO `statis_cycle` VALUES ('5', 'halfyear', '半年', '4320', '半年');
INSERT INTO `statis_cycle` VALUES ('6', 'year', '年', '8640', '年');

-- ----------------------------
-- Table structure for `statis_user`
-- ----------------------------
DROP TABLE IF EXISTS `statis_user`;
CREATE TABLE `statis_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `user_name` varchar(100) DEFAULT NULL COMMENT '用户名称',
  `cycle_id` bigint(20) DEFAULT NULL COMMENT '统计周期编号',
  `cycle_tm` datetime DEFAULT NULL COMMENT '统计时间',
  `begin_tm` datetime DEFAULT NULL COMMENT '统计周期开始时间',
  `end_tm` datetime DEFAULT NULL COMMENT '统计周期结束时间',
  `login_count` int(11) DEFAULT '0' COMMENT '登录次数',
  `app_count` int(11) DEFAULT NULL COMMENT '使用过的应用个数',
  `app_inst_count` int(11) DEFAULT NULL COMMENT '使用过的应用实例个数',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of statis_user
-- ----------------------------

-- ----------------------------
-- Table structure for `statis_user_halfyear`
-- ----------------------------
DROP TABLE IF EXISTS `statis_user_halfyear`;
CREATE TABLE `statis_user_halfyear` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `user_name` varchar(100) DEFAULT NULL COMMENT '用户名称',
  `cycle_id` bigint(20) DEFAULT NULL COMMENT '统计周期编号',
  `cycle_tm` datetime DEFAULT NULL COMMENT '统计时间',
  `begin_tm` datetime DEFAULT NULL COMMENT '统计周期开始时间',
  `end_tm` datetime DEFAULT NULL COMMENT '统计周期结束时间',
  `login_count` int(11) DEFAULT '0' COMMENT '登录次数',
  `app_count` int(11) DEFAULT NULL COMMENT '使用过的应用个数',
  `app_inst_count` int(11) DEFAULT NULL COMMENT '使用过的应用实例个数',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of statis_user_halfyear
-- ----------------------------

-- ----------------------------
-- Table structure for `statis_user_month`
-- ----------------------------
DROP TABLE IF EXISTS `statis_user_month`;
CREATE TABLE `statis_user_month` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `user_name` varchar(100) DEFAULT NULL COMMENT '用户名称',
  `cycle_id` bigint(20) DEFAULT NULL COMMENT '统计周期编号',
  `cycle_tm` datetime DEFAULT NULL COMMENT '统计时间',
  `begin_tm` datetime DEFAULT NULL COMMENT '统计周期开始时间',
  `end_tm` datetime DEFAULT NULL COMMENT '统计周期结束时间',
  `login_count` int(11) DEFAULT '0' COMMENT '登录次数',
  `app_count` int(11) DEFAULT NULL COMMENT '使用过的应用个数',
  `app_inst_count` int(11) DEFAULT NULL COMMENT '使用过的应用实例个数',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of statis_user_month
-- ----------------------------

-- ----------------------------
-- Table structure for `statis_user_quarter`
-- ----------------------------
DROP TABLE IF EXISTS `statis_user_quarter`;
CREATE TABLE `statis_user_quarter` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `user_name` varchar(100) DEFAULT NULL COMMENT '用户名称',
  `cycle_id` bigint(20) DEFAULT NULL COMMENT '统计周期编号',
  `cycle_tm` datetime DEFAULT NULL COMMENT '统计时间',
  `begin_tm` datetime DEFAULT NULL COMMENT '统计周期开始时间',
  `end_tm` datetime DEFAULT NULL COMMENT '统计周期结束时间',
  `login_count` int(11) DEFAULT '0' COMMENT '登录次数',
  `app_count` int(11) DEFAULT NULL COMMENT '使用过的应用个数',
  `app_inst_count` int(11) DEFAULT NULL COMMENT '使用过的应用实例个数',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of statis_user_quarter
-- ----------------------------

-- ----------------------------
-- Table structure for `statis_user_week`
-- ----------------------------
DROP TABLE IF EXISTS `statis_user_week`;
CREATE TABLE `statis_user_week` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `user_name` varchar(100) DEFAULT NULL COMMENT '用户名称',
  `cycle_id` bigint(20) DEFAULT NULL COMMENT '统计周期编号',
  `cycle_tm` datetime DEFAULT NULL COMMENT '统计时间',
  `begin_tm` datetime DEFAULT NULL COMMENT '统计周期开始时间',
  `end_tm` datetime DEFAULT NULL COMMENT '统计周期结束时间',
  `login_count` int(11) DEFAULT '0' COMMENT '登录次数',
  `app_count` int(11) DEFAULT NULL COMMENT '使用过的应用个数',
  `app_inst_count` int(11) DEFAULT NULL COMMENT '使用过的应用实例个数',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of statis_user_week
-- ----------------------------

-- ----------------------------
-- Table structure for `statis_user_year`
-- ----------------------------
DROP TABLE IF EXISTS `statis_user_year`;
CREATE TABLE `statis_user_year` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `user_name` varchar(100) DEFAULT NULL COMMENT '用户名称',
  `cycle_id` bigint(20) DEFAULT NULL COMMENT '统计周期编号',
  `cycle_tm` datetime DEFAULT NULL COMMENT '统计时间',
  `begin_tm` datetime DEFAULT NULL COMMENT '统计周期开始时间',
  `end_tm` datetime DEFAULT NULL COMMENT '统计周期结束时间',
  `login_count` int(11) DEFAULT '0' COMMENT '登录次数',
  `app_count` int(11) DEFAULT NULL COMMENT '使用过的应用个数',
  `app_inst_count` int(11) DEFAULT NULL COMMENT '使用过的应用实例个数',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of statis_user_year
-- ----------------------------
