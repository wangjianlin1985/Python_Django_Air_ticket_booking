/*
 Navicat Premium Data Transfer

 Source Server         : mysql5.6
 Source Server Type    : MySQL
 Source Server Version : 50620
 Source Host           : localhost:3306
 Source Schema         : flight_db

 Target Server Type    : MySQL
 Target Server Version : 50620
 File Encoding         : 65001

 Date: 03/04/2021 23:53:31
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for t_admin
-- ----------------------------
DROP TABLE IF EXISTS `t_admin`;
CREATE TABLE `t_admin`  (
  `username` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `password` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`username`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_admin
-- ----------------------------
INSERT INTO `t_admin` VALUES ('a', 'a');

-- ----------------------------
-- Table structure for t_flight
-- ----------------------------
DROP TABLE IF EXISTS `t_flight`;
CREATE TABLE `t_flight`  (
  `flightId` int(11) NOT NULL AUTO_INCREMENT COMMENT '记录编号',
  `flightNumber` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '航班号',
  `flightPhoto` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '航班图片',
  `startStation` int(11) NOT NULL COMMENT '始发机场',
  `endStation` int(11) NOT NULL COMMENT '终到机场',
  `startTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '起飞时间',
  `endTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '终到时间',
  `totalTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '历时',
  `seatType` int(11) NOT NULL COMMENT '席别',
  `price` float NOT NULL COMMENT '票价',
  `seatNumber` int(11) NOT NULL COMMENT '总票数',
  `leftSeatNumber` int(11) NOT NULL COMMENT '剩余票数',
  `flightDesc` varchar(8000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '航班描述',
  PRIMARY KEY (`flightId`) USING BTREE,
  INDEX `startStation`(`startStation`) USING BTREE,
  INDEX `endStation`(`endStation`) USING BTREE,
  INDEX `seatType`(`seatType`) USING BTREE,
  CONSTRAINT `t_flight_ibfk_1` FOREIGN KEY (`startStation`) REFERENCES `t_stationinfo` (`stationId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `t_flight_ibfk_2` FOREIGN KEY (`endStation`) REFERENCES `t_stationinfo` (`stationId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `t_flight_ibfk_3` FOREIGN KEY (`seatType`) REFERENCES `t_seattype` (`seatTypeId`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_flight
-- ----------------------------
INSERT INTO `t_flight` VALUES (1, 'EU2239', 'img/1.jpg', 1, 2, '2021-04-12 17:25:00', '2021-04-12 20:30:00', '2小时5分', 1, 520, 150, 147, '<p>本航班由成都航空公司管理，已经安全飞行了20年！</p>');
INSERT INTO `t_flight` VALUES (2, 'HA5293', 'img/2.jpg', 1, 3, '2021-04-16 12:40:00', '2021-04-16 15:58:00', '3小时18分', 3, 826, 100, 100, '<p>商业人士专用！环境优美，空气新鲜！</p>');

-- ----------------------------
-- Table structure for t_leaveword
-- ----------------------------
DROP TABLE IF EXISTS `t_leaveword`;
CREATE TABLE `t_leaveword`  (
  `leaveWordId` int(11) NOT NULL AUTO_INCREMENT COMMENT '留言id',
  `leaveTitle` varchar(80) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '留言标题',
  `leaveContent` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '留言内容',
  `userObj` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '留言人',
  `leaveTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '留言时间',
  `replyContent` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '管理回复',
  `replyTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '回复时间',
  PRIMARY KEY (`leaveWordId`) USING BTREE,
  INDEX `userObj`(`userObj`) USING BTREE,
  CONSTRAINT `t_leaveword_ibfk_1` FOREIGN KEY (`userObj`) REFERENCES `t_userinfo` (`user_name`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_leaveword
-- ----------------------------
INSERT INTO `t_leaveword` VALUES (1, '111', '222', 'user1', '2021-04-03 17:29:54', '333', '2021-04-03 17:29:58');

-- ----------------------------
-- Table structure for t_notice
-- ----------------------------
DROP TABLE IF EXISTS `t_notice`;
CREATE TABLE `t_notice`  (
  `noticeId` int(11) NOT NULL AUTO_INCREMENT COMMENT '公告id',
  `title` varchar(80) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '标题',
  `content` varchar(5000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '公告内容',
  `publishDate` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '发布时间',
  PRIMARY KEY (`noticeId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_notice
-- ----------------------------
INSERT INTO `t_notice` VALUES (1, 'aaaa', '<p>bbbb</p>', '2021-04-03 17:30:09');

-- ----------------------------
-- Table structure for t_orderinfo
-- ----------------------------
DROP TABLE IF EXISTS `t_orderinfo`;
CREATE TABLE `t_orderinfo`  (
  `orderId` int(11) NOT NULL AUTO_INCREMENT COMMENT '记录编号',
  `userObj` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '预定用户',
  `flightObj` int(11) NOT NULL COMMENT '预定航班',
  `startStation` int(11) NOT NULL COMMENT '始发机场',
  `endStation` int(11) NOT NULL COMMENT '终到机场',
  `startTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '起飞时间',
  `endTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '终到时间',
  `seatType` int(11) NOT NULL COMMENT '席别',
  `seatNum` int(11) NOT NULL COMMENT '预定票数',
  `totalPrice` float NOT NULL COMMENT '总票价',
  `orderMemo` varchar(800) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '订单备注',
  PRIMARY KEY (`orderId`) USING BTREE,
  INDEX `userObj`(`userObj`) USING BTREE,
  INDEX `flightObj`(`flightObj`) USING BTREE,
  INDEX `startStation`(`startStation`) USING BTREE,
  INDEX `endStation`(`endStation`) USING BTREE,
  INDEX `seatType`(`seatType`) USING BTREE,
  CONSTRAINT `t_orderinfo_ibfk_1` FOREIGN KEY (`userObj`) REFERENCES `t_userinfo` (`user_name`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `t_orderinfo_ibfk_2` FOREIGN KEY (`flightObj`) REFERENCES `t_flight` (`flightId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `t_orderinfo_ibfk_3` FOREIGN KEY (`startStation`) REFERENCES `t_stationinfo` (`stationId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `t_orderinfo_ibfk_4` FOREIGN KEY (`endStation`) REFERENCES `t_stationinfo` (`stationId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `t_orderinfo_ibfk_5` FOREIGN KEY (`seatType`) REFERENCES `t_seattype` (`seatTypeId`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_orderinfo
-- ----------------------------
INSERT INTO `t_orderinfo` VALUES (2, 'user1', 1, 1, 2, '2021-04-12 17:25:00', '2021-04-12 20:30:00', 1, 2, 1040, '老板快点把票发货给我');
INSERT INTO `t_orderinfo` VALUES (3, 'user2', 1, 1, 2, '2021-04-12 17:25:00', '2021-04-12 20:30:00', 1, 1, 520, '我一个人出发');

-- ----------------------------
-- Table structure for t_recharge
-- ----------------------------
DROP TABLE IF EXISTS `t_recharge`;
CREATE TABLE `t_recharge`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '记录编号',
  `userObj` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '充值用户',
  `money` float NOT NULL COMMENT '充值金额',
  `rechargeMemo` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '充值备注',
  `chargeTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '充值时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `userObj`(`userObj`) USING BTREE,
  CONSTRAINT `t_recharge_ibfk_1` FOREIGN KEY (`userObj`) REFERENCES `t_userinfo` (`user_name`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_recharge
-- ----------------------------
INSERT INTO `t_recharge` VALUES (2, 'user1', 2000, '支付宝充值的', '2021-04-03 23:10:37');
INSERT INTO `t_recharge` VALUES (3, 'user2', 1000, '微信充值流水号：154184108514144', '2021-04-03 23:17:47');

-- ----------------------------
-- Table structure for t_seattype
-- ----------------------------
DROP TABLE IF EXISTS `t_seattype`;
CREATE TABLE `t_seattype`  (
  `seatTypeId` int(11) NOT NULL AUTO_INCREMENT COMMENT '记录编号',
  `seatTypeName` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '席别名称',
  PRIMARY KEY (`seatTypeId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_seattype
-- ----------------------------
INSERT INTO `t_seattype` VALUES (1, '经济舱');
INSERT INTO `t_seattype` VALUES (2, '头等舱');
INSERT INTO `t_seattype` VALUES (3, '商务舱');

-- ----------------------------
-- Table structure for t_stationinfo
-- ----------------------------
DROP TABLE IF EXISTS `t_stationinfo`;
CREATE TABLE `t_stationinfo`  (
  `stationId` int(11) NOT NULL AUTO_INCREMENT COMMENT '记录编号',
  `stationName` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '机场名称',
  `connectPerson` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '联系人',
  `telephone` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '联系电话',
  `postcode` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '邮编',
  `address` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '通讯地址',
  PRIMARY KEY (`stationId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_stationinfo
-- ----------------------------
INSERT INTO `t_stationinfo` VALUES (1, '成都双流机场', '王宪涛', '028-29349123', '601023', '成都飞机场路');
INSERT INTO `t_stationinfo` VALUES (2, '福建长乐机场', '李小龙', '0591-92831233', '115323', '发啊');
INSERT INTO `t_stationinfo` VALUES (3, '香港国际机场', '李霞', '852-27259777', '510839', '香港国际路10号');

-- ----------------------------
-- Table structure for t_userinfo
-- ----------------------------
DROP TABLE IF EXISTS `t_userinfo`;
CREATE TABLE `t_userinfo`  (
  `user_name` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'user_name',
  `password` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '密码',
  `realName` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '姓名',
  `sex` varchar(4) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '性别',
  `userPhoto` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '照片',
  `birthday` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '出生日期',
  `cardNumber` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '身份证',
  `city` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '籍贯',
  `address` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '家庭地址',
  `money` float NOT NULL COMMENT '账户余额',
  `regTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '注册时间',
  PRIMARY KEY (`user_name`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_userinfo
-- ----------------------------
INSERT INTO `t_userinfo` VALUES ('user1', '123', '王晓婷', '女', 'img/9.jpg', '2021-04-06', '513010199611242123', '四川', '四川成都红星路', 960, '2021-04-03 17:22:03');
INSERT INTO `t_userinfo` VALUES ('user2', '123', '张晓彤', '女', 'img/13.jpg', '2021-04-03', '513030199611201293', '四川达州', '达州市清江路10号', 480, '2021-04-03 22:58:12');
INSERT INTO `t_userinfo` VALUES ('user3', '123', 'aa', '女', 'img/11.jpg', '2021-04-09', '513030199611202988', '四川', '四川成都红星路5号', 0, '2021-04-03 23:12:42');

SET FOREIGN_KEY_CHECKS = 1;
