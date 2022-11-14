-- DEFINITION OF THE DATABASE
DROP SCHEMA SAHAC_CUSTOM_DB;
CREATE DATABASE IF NOT EXISTS SAHAC_CUSTOM_DB;
USE SAHAC_CUSTOM_DB;

-- DROP TABLE
SET foreign_key_checks=0;
DROP TABLE IF EXISTS organization;
DROP TABLE IF EXISTS classroom;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `group`;
DROP TABLE IF EXISTS course;
DROP TABLE IF EXISTS lesson;
DROP TABLE IF EXISTS assignment;
DROP TABLE IF EXISTS assignment_category;
DROP TABLE IF EXISTS teacher;
DROP TABLE IF EXISTS organization_users;
SET foreign_key_checks=1;

-- DEFINITION OF THE TABLES
CREATE TABLE organization (organization_name VARCHAR(50) NOT NULL,
organization_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY);
CREATE TABLE `user`(user_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
user_name VARCHAR(50) NOT NULL, user_email VARCHAR(50) NOT NULL,
user_password VARCHAR(65) NOT NULL, user_rol TINYINT(1));
CREATE TABLE assignment (assignment_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
assignment_code VARCHAR(6), assignment_name VARCHAR(50) NOT NULL,
assignment_description TINYTEXT);
CREATE TABLE course ( course_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
course_name VARCHAR(50)NOT NULL, course_code VARCHAR(6));
CREATE TABLE `group` (group_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
group_code VARCHAR(6), group_number INT UNSIGNED);
CREATE TABLE assignment_category (assignment_category_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
assignment_category_name VARCHAR(50)NOT NULL, assignment_category_description TINYTEXT,
assignment_category_parent_id INT UNSIGNED);
CREATE TABLE teacher (teacher_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
teacher_name VARCHAR(50)NOT NULL, teacher_email VARCHAR(70)NOT NULL,
teacher_load INT UNSIGNED, teacher_phone VARCHAR(12));
CREATE TABLE classroom (classroom_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
classroom_number INT UNSIGNED NOT NULL, classroom_code VARCHAR(6));
CREATE TABLE organization_users(organization_users_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
organization_users_rol TINYINT UNSIGNED NOT NULL);
CREATE TABLE lesson (lesson_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
lesson_day VARCHAR(3) NOT NULL, lesson_begin TIME NOT NULL,
lesson_end TIME NOT NULL);

-- PRIMARY KEYS
-- ALTER TABLE organization ADD PRIMARY KEY(organization_id);
-- ALTER TABLE user ADD PRIMARY KEY (user_id);
-- ALTER TABLE assignment ADD PRIMARY KEY (assignment_id);
-- ALTER TABLE course ADD PRIMARY KEY (course_id);
-- ALTER TABLE group ADD PRIMARY KEY (group_id);
-- ALTER TABLE assignment_category ADD PRIMARY KEY (assignment_category_id);
-- ALTER TABLE teacher ADD PRIMARY KEY (teacher_id);
-- ALTER TABLE classroom ADD PRIMARY KEY (classroom_id);
-- ALTER TABLE organization_users ADD PRIMARY KEY (organization_users_id);
-- ALTER TABLE lesson ADD PRIMARY KEY (lesson_id);

-- FOREIGN KEYS
    -- ORGANIZATION FOREIGN KEYS
ALTER TABLE assignment ADD organization_id INT UNSIGNED NOT NULL;
ALTER TABLE assignment ADD CONSTRAINT FK_ASSIGNMENT_ORGANIZATION 
FOREIGN KEY (organization_id) REFERENCES organization(organization_id);
ALTER TABLE course ADD organization_id INT UNSIGNED NOT NULL;
ALTER TABLE course ADD CONSTRAINT FK_COURSE_ORGANIZATION_ID
FOREIGN KEY (organization_id) REFERENCES organization(organization_id);
ALTER TABLE assignment_category ADD organization_id INT UNSIGNED NOT NULL;
ALTER TABLE assignment_category ADD CONSTRAINT 
FK_ASSIGNMENT_CATEGORY_ORGANIZATION FOREIGN KEY (organization_id)
REFERENCES organization(organization_id);
ALTER TABLE `group` ADD organization_id INT UNSIGNED NOT NULL;
ALTER TABLE `group` ADD CONSTRAINT FK_GROUP_ORGANIZATION
FOREIGN KEY (organization_id) REFERENCES organization(organization_id);
ALTER TABLE lesson ADD organization_id INT UNSIGNED NOT NULL;
ALTER TABLE lesson ADD CONSTRAINT FK_LESSON_ORGANIZATION
FOREIGN KEY (organization_id) REFERENCES organization(organization_id);
ALTER TABLE classroom ADD organization_id INT UNSIGNED NOT NULL;
ALTER TABLE classroom ADD CONSTRAINT FK_CLASSROOM_ORGANIZATION 
FOREIGN KEY (organization_id) REFERENCES organization(organization_id);
ALTER TABLE organization_users ADD organization_id INT UNSIGNED NOT NULL;
ALTER TABLE organization_users ADD CONSTRAINT FK_ORGANIZATION_USERS_ORGANIZATION
FOREIGN KEY (organization_id) REFERENCES organization(organization_id);
ALTER TABLE teacher ADD organization_id INT UNSIGNED NOT NULL;
ALTER TABLE teacher ADD CONSTRAINT FK_ORGANIZATION_TEACHER FOREIGN KEY
(organization_id) REFERENCES organization(organization_id);

-- FOREIGN KEYS ASSIGNMENT
ALTER TABLE assignment ADD assignment_category_id INT UNSIGNED;
ALTER TABLE assignment ADD CONSTRAINT FK_ASSIGNMENT_ASSIGNMENT_CATEGORY
FOREIGN KEY (assignment_category_id)
REFERENCES assignment_category(assignment_category_id);

-- FOREIGN KEYS COURSE
ALTER TABLE course ADD assignment_id INT UNSIGNED NOT NULL;
ALTER TABLE course ADD CONSTRAINT FK_COURSE_ASSIGNMENT
FOREIGN KEY (assignment_id) REFERENCES assignment(assignment_id);

-- FOREIGN KEYS GROUP
ALTER TABLE `group` ADD teacher_id INT UNSIGNED;
ALTER TABLE `group` ADD course_id INT UNSIGNED NOT NULL;
ALTER TABLE `group` ADD CONSTRAINT FK_COURSE_GROUP FOREIGN KEY
(course_id) REFERENCES course(course_id);
ALTER TABLE `group` ADD CONSTRAINT FK_TEACHER_GROUP FOREIGN KEY
(teacher_id) REFERENCES teacher(teacher_id);

-- FOREIGN KEYS LESSON
ALTER TABLE lesson ADD group_id INT UNSIGNED NOT NULL;
ALTER TABLE lesson ADD classroom_id INT UNSIGNED;
ALTER TABLE lesson ADD CONSTRAINT FK_LESSON_GROUP
FOREIGN KEY (group_id) REFERENCES `group`(group_id);
ALTER TABLE lesson ADD CONSTRAINT FK_CLASSROOM_GROUP
FOREIGN KEY (classroom_id) REFERENCES classroom(classroom_id);

-- FOREIGN KEYS ORGANIZATION_USERS
ALTER TABLE organization_users ADD user_id INT UNSIGNED NOT NULL;
ALTER TABLE organization_users ADD CONSTRAINT FK_ORGANIZATION_USERS_USERS
FOREIGN KEY (user_id) REFERENCES `user`(user_id);

-- UNIQUE CONSTRAINTS
    -- organization_users
ALTER TABLE organization_users ADD CONSTRAINT UK_ORGANIZATION_USERS_USER
UNIQUE (user_id,organization_id,organization_users_id);

-- user
ALTER TABLE `user` ADD CONSTRAINT UK_USER_EMAIL UNIQUE (user_email);

-- assignment
ALTER TABLE assignment ADD CONSTRAINT UK_ASSIGNMENT_NAME
UNIQUE (assignment_name,organization_id);

-- assignment_category
ALTER TABLE assignment_category ADD CONSTRAINT UK_ASSIGNMENT_CATEGORY_NAME
UNIQUE (assignment_category_name,organization_id);

-- course
ALTER TABLE course ADD CONSTRAINT UK_COURSE_NAME
UNIQUE (course_name,organization_id,assignment_id);

-- teacher
ALTER TABLE teacher ADD CONSTRAINT UK_TEACHER_EMAIL
UNIQUE (teacher_email);
ALTER TABLE teacher ADD CONSTRAINT UK_TEACHER_PHONE
UNIQUE (teacher_phone);

-- group
ALTER TABLE `group` ADD CONSTRAINT UK_GROUP_NUMBER
UNIQUE (group_number,organization_id,course_id);

-- classroom
ALTER TABLE classroom ADD CONSTRAINT UK_CLASSROOM_NUMBER
UNIQUE (classroom_number,organization_id);



-- CHECK CONSTRAINT
    -- teacher
ALTER TABLE teacher ADD CONSTRAINT CHK_TEACHER_LOAD
CHECK (teacher_load>=0);

-- lesson
ALTER TABLE lesson ADD CONSTRAINT CHK_LESSON_TIME_BEGIN
CHECK (lesson_begin>lesson_end);
ALTER TABLE lesson ADD CONSTRAINT CHK_LESSON_DAY
CHECK (lesson_day IN ('SUN','MON','TUE','WES','THU','FRI','SAT'));

-- STORAGE PROCEDURES
    -- user
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS create_new_user(IN p_name varchar(50),
IN p_email varchar(50), IN p_password varchar(50))
    BEGIN
    IF (p_email IS NULL OR p_name IS NULL OR p_password IS NULL) THEN 
        SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
    ELSE
        INSERT INTO `user` (user_name,user_email,user_password,user_rol) 
        VALUES(p_name,p_email,p_password,3);
    END IF;
    END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS update_user_email (IN p_id INT, IN p_email varchar(50))
    BEGIN
    DECLARE v_count INT;
    IF (p_email IS NULL OR p_email = '') THEN
        SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
    ELSE
        SELECT COUNT(user_email) INTO v_count FROM `user` WHERE user_email = p_email;
        IF (v_count>0) THEN
            SIGNAL SQLSTATE '20001' SET MESSAGE_TEXT = 'The email already exist.';
        ELSE
            UPDATE `user` SET user_email = p_email WHERE user_id = p_id;
        END IF;
    END IF;
    END //
DELIMITER ;

-- organization
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS create_organization(IN p_name varchar(50),IN p_user_id INT UNSIGNED)
    BEGIN
    DECLARE v_count INT UNSIGNED;
    IF p_name IS NULL OR p_name = '' THEN
        SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
    ELSE
        SELECT COUNT(o.organization_id) from organization o INNER JOIN organization_users ou WHERE
        o.organization_name = p_name AND ou.user_id=p_user_id INTO v_count;
        IF v_count != 0 THEN
            SIGNAL SQLSTATE '20002' SET MESSAGE_TEXT = 
            'There is another organization with that name register';
        ELSE
            INSERT INTO organization ( organization_name ) VALUES(p_name);
        END IF;
    END IF;
    END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS update_organization_name (IN p_id INT,IN p_name varchar(50))
    BEGIN
    IF p_name IS NULL OR p_name = '' THEN
        SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
    ELSE
        UPDATE organization SET organization_name = p_name WHERE organization_id = p_id;
    END IF;
    END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS delete_organization (IN p_id INT)
    BEGIN
        IF p_id IS NULL OR p_id = 0 THEN
            SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or 0.';
        ELSE
            DELETE FROM organization WHERE organization_id = p_id;
        END IF;
    END //
DELIMITER ; 

-- organization_users

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS create_organization_user_admin (IN p_organization_id INT, IN p_user_id INT)
    BEGIN
    IF p_organization_id IS NULL OR p_organization_id = '' 
    OR p_user_id IS NULL OR p_user_id = '' THEN
        SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
    ELSE
       INSERT INTO organization_users ( organization_users_rol, organization_id, user_id ) 
       VALUES ( 1,p_organization_id, p_user_id);
    END IF;
    END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS create_organization_user_pending (IN p_organization_id INT, IN p_user_id INT)
    BEGIN
    IF p_organization_id IS NULL OR p_organization_id = '' 
    OR p_user_id IS NULL OR p_user_id = '' THEN
        SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
    ELSE
       INSERT INTO organization_users ( organization_users_rol, organization_id, user_id ) 
       VALUES ( 3,p_organization_id, p_user_id );
    END IF;
    END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS update_organization_user_rol (IN p_user_id INT,
IN p_organization_id INT, IN p_organization_users_rol INT)
    BEGIN
        IF p_organization_id IS NULL OR p_organization_id = '' 
        OR p_user_id IS NULL OR p_user_id = '' THEN
            SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
        ELSE
            UPDATE organization_users SET organization_users_rol = p_organization_users_rol
            WHERE organization_id = p_organization_id and user_id = p_user_id;
        END IF;
    END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS select_users_by_organization (IN p_organization_id INT)
    BEGIN
        IF p_organization_id IS NULL OR p_organization_id = '' THEN
            SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
        ELSE
            SELECT ou.organization_id, o.organization_name, u.user_id, 
            u.user_name, u.user_email, ou.organization_users_rol FROM organization_users ou 
            INNER JOIN organization o on ou.organization_id = o.organization_id INNER JOIN
            `user` u on ou.user_id = u.user_id WHERE ou.organization_id = p_organization_id
            and ou.organization_users_rol != 3;
        END IF;
    END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS select_users_pending_by_organization (IN p_organization_id INT)
    BEGIN
        IF p_organization_id IS NULL OR p_organization_id = '' THEN
            SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
        ELSE
            SELECT ou.organization_id, o.organization_name, u.user_id, 
            u.user_name, u.user_email, ou.organization_users_rol FROM organization_users ou 
            INNER JOIN organization o on ou.organization_id = o.organization_id INNER JOIN
            `user` u on ou.user_id = u.user_id WHERE ou.organization_id = p_organization_id
            and ou.organization_users_rol = 3;
        END IF;
    END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS create_organization_users_organization(IN p_name varchar(50)
,IN p_user_id INT)
    BEGIN
        DECLARE v_last_id INT;
        CALL create_organization(p_name,p_user_id);
        SELECT MAX(organization_id) from organization WHERE organization_name = p_name 
        INTO v_last_id;
        CALL create_organization_user_admin(v_last_id,p_user_id);
    END //
DELIMITER ;

-- ASSIGNMENT PROCEDURES

DELIMITER // 
CREATE PROCEDURE IF NOT EXISTS create_new_assignment (IN p_code varchar(6),
IN p_name varchar(50),IN p_description TINYTEXT,IN p_org_id INT UNSIGNED,
IN p_cat_id INT UNSIGNED)
    BEGIN
        IF (p_name IS NULL OR p_name = '') OR (p_org_id IS NULL OR p_org_id=0) THEN
            SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
        ELSE
           INSERT INTO assignment ( assignment_code, assignment_name, assignment_description,
           organization_id, assignment_category_id ) VALUES(
                p_code, p_name, p_description, p_org_id, p_cat_id);
        END IF;
    END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS select_assignment_by_organization (IN p_org_id INT UNSIGNED)
    BEGIN
        IF p_org_id IS NULL or p_org_id = 0 THEN
            SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
        ELSE
            SELECT assignment_id, assignment_name, assignment_code, assignment_description, 
            assignment_category_id FROM assignment WHERE organization_id = p_org_id;
        END IF;
    END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS select_assignment_by_organization_cat (IN p_org_id INT UNSIGNED)
    BEGIN
        IF p_org_id IS NULL or p_org_id = 0 THEN
            SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
        ELSE
            SELECT assignment_id, assignment_name, assignment_code, assignment_description, 
            get_category_tree(assignment_category_id) as categories, assignment_category_id
            FROM assignment WHERE organization_id = p_org_id;
        END IF;
    END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS update_assignment(IN p_id INT UNSIGNED, IN p_name varchar(50),
IN p_code varchar(6),IN p_description TINYTEXT,IN p_assign_cat_id INT UNSIGNED)
    BEGIN
        IF p_name IS NULL or p_name = '' THEN
            SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
        ELSE
            UPDATE assignment SET assignment_name = p_name, assignment_code = p_code,
            assignment_description = p_description, assignment_category_parent_id = p_assign_cat_id
            WHERE assignment_id = p_id;
        END IF;
    END //
DELIMITER ; 

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS delete_assignment(IN p_id INT UNSIGNED)
    BEGIN
        IF p_id IS NULL OR p_id = 0 THEN
            SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
        ELSE
            DELETE FROM assignment WHERE assignment_id = p_id;
        END IF;
    END //
DELIMITER ;

-- COURSE PROCEDURES
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS create_new_course(IN p_name varchar(50), IN p_code varchar(6),
IN p_org_id INT UNSIGNED, IN p_assign_id INT UNSIGNED)
    BEGIN
        IF (p_name IS NULL OR p_name='') OR (p_org_id = 0 OR p_assign_id = 0) THEN
            SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
        ELSE
           INSERT INTO course ( course_name, course_code, organization_id, assignment_id ) VALUES(
            p_name, p_code, p_org_id, p_assign_id );
        END IF;
    END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS update_course (IN p_id INT UNSIGNED, IN p_name varchar(50),
IN p_code varchar(6) , IN p_org_id INT UNSIGNED, IN p_assign_id INT UNSIGNED)
    BEGIN
        IF (p_name IS NULL OR p_name='') OR (p_org_id = 0 OR p_assign_id = 0) THEN
            SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
        ELSE
            UPDATE course SET course_name=p_name, course_code = p_code, organization_id = p_org_id,
            assignment_id = p_assign_id WHERE course_id = p_id;
        END IF;
    END //
DELIMITER ;

-- AV componente 6419-1255

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS select_courses_by_organization (IN p_org_id INT UNSIGNED)
    BEGIN
        IF p_org_id IS NULL or p_org_id = 0 THEN
            SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
        ELSE
            SELECT course_id, course_name, course_code, organization_id, assignment_id
            FROM course WHERE organization_id = p_org_id;
        END IF;
    END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS select_courses_by_org_and_assignment (IN p_org_id INT UNSIGNED,
IN p_assign_id INT UNSIGNED)
    BEGIN
        IF (p_org_id IS NULL or p_org_id = 0) or (p_assign_id IS NULL or p_assign_id = 0) THEN
            SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
        ELSE
            SELECT course_id, course_name, course_code, organization_id, assignment_id
            FROM course WHERE organization_id = p_org_id AND assignment_id = p_assign_id;
        END IF;
    END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS delete_course_by_id (IN p_id INT UNSIGNED)
    BEGIN
        IF p_id IS NULL OR p_id = 0 THEN
            SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
        ELSE
            DELETE FROM course WHERE course_id = p_id; 
        END IF;
    END //
DELIMITER ;

-- ASSIGNMENT CATEGORY PROCEDURES
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS create_new_assignment_category (IN p_name varchar(60), 
IN p_description TINYTEXT,IN p_parent_id INT UNSIGNED,IN p_org_id INT UNSIGNED)
    BEGIN
        IF (p_name IS NULL OR p_name = '') or (p_org_id IS NULL OR p_org_id=0) THEN
            SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
        ELSE
            INSERT INTO assignment_category ( assignment_category_name, assignment_category_description,
            assignment_category_parent_id, organization_id ) VALUES(
                p_name, p_description, p_parent_id, p_org_id);
        END IF;
    END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS category_tree(IN p_cat_id INT UNSIGNED,OUT tree TEXT)
    BEGIN
        DECLARE x_name varchar(60);
        DECLARE x_tree TEXT;
        DECLARE x_parent INT UNSIGNED;
        SET max_sp_recursion_depth = 20;
        SELECT assignment_category_name,assignment_category_parent_id 
        FROM assignment_category WHERE assignment_category_id = p_cat_id INTO x_name,x_parent;
        IF x_parent IS NULL OR x_parent = 0 THEN
            SET tree = x_name;
        ELSE
            CALL category_tree(x_parent, x_tree);
            SET tree = CONCAT (x_tree,'','/','',x_name);
        END IF;
    END //
DELIMITER ;

DELIMITER //
CREATE FUNCTION IF NOT EXISTS get_category_tree(p_id INT UNSIGNED)
RETURNS varchar(500) CHARSET utf8
BEGIN 
    DECLARE response varchar (500);
    CALL category_tree(p_id,response);
    RETURN response;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS delete_assignment_category(IN p_id INT UNSIGNED)
    BEGIN
        IF p_id IS NULL or p_id = 0 THEN
            SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
        ELSE
            DELETE FROM assignment_category WHERE assignment_category_id = p_id;
        END IF;
    END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS select_categories_by_org(IN p_org_id INT UNSIGNED)
    BEGIN
        IF p_org_id = 0 OR p_org_id IS NULL THEN
            SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
        ELSE
            SELECT assignment_category_id, get_category_tree(assignment_category_id) as assignment_category_name,
            assignment_category_description, organization_id FROM assignment_category WHERE organization_id = p_org_id;
        END IF;
    END //
DELIMITER ;

-- TEACHER PROCEDURES

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS create_new_teacher(IN p_name VARCHAR(50), IN p_email VARCHAR(70),
IN p_load INT UNSIGNED, IN p_phone VARCHAR(12),IN p_org_id INT UNSIGNED)
BEGIN
    IF (p_name IS NULL OR p_name='') OR (p_email IS NULL OR p_email='') 
    OR (p_org_id = 0 OR p_org_id IS NULL) THEN
        SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
    ELSE
       INSERT INTO teacher ( teacher_name, teacher_email, 
       teacher_load, teacher_phone, organization_id ) 
       VALUES(p_name, p_email, p_load,p_phone, p_org_id);
    END IF;
END //
DELIMITER;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS select_teacher_by_organization(IN p_org_id INT UNSIGNED)
BEGIN
    IF p_org_id IS NULL OR p_org_id = 0 THEN
        SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
    ELSE
        SELECT teacher_id, teacher_name, teacher_email, teacher_load, teacher_phone, organization_id
        FROM teacher WHERE organization_id = p_org_id;
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS update_teacher_by_id(IN p_id INT UNSIGNED, IN p_name VARCHAR(50),
IN p_email VARCHAR(50), IN p_load INT UNSIGNED, IN p_phone VARCHAR(12), IN p_org_id INT UNSIGNED)
BEGIN
    IF (p_id = 0 OR p_id IS NULL) OR (p_name IS NULL OR p_name = '') OR (p_email IS NULL OR p_email = '')
    OR (p_org_id IS NULL OR p_org_id = 0) THEN
        SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
    ELSE
        UPDATE teacher SET teacher_name = p_name, teacher_email = p_email, teacher_load = p_load,
        teacher_phone = p_phone, organization_id = p_org_id WHERE teacher_id = p_id;
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS select_teacher_by_id(IN p_id INT UNSIGNED)
BEGIN
    IF p_id = 0 OR p_id IS NULL THEN
        SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
    ELSE
        SELECT teacher_id, teacher_name, teacher_email, teacher_load, teacher_phone,
        organization_id FROM teacher WHERE teacher_id = p_id;
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS delete_teacher_by_id(IN p_id INT UNSIGNED)
BEGIN
    IF p_id = 0 OR p_id IS NULL THEN
        SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
    ELSE
        DELETE FROM teacher WHERE teacher_id = p_id;
    END IF;
END //
DELIMITER ;

-- GROUP PROCEDURES
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS create_new_group (IN p_code VARCHAR(6),IN p_number INT UNSIGNED,
IN p_org_id INT UNSIGNED, IN p_teacher_id INT UNSIGNED, IN p_course_id INT UNSIGNED)
BEGIN
    IF p_number = 0 OR (p_org_id = 0 OR p_org_id IS NULL) OR (p_course_id = 0 OR p_course_id IS NULL) THEN
        SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
    ELSE
      INSERT INTO `group` (group_code,group_number,organization_id,teacher_id,course_id) 
      VALUES (p_code, p_number, p_org_id, p_teacher_id,p_course_id);
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS create_new_groups_by_quantity(IN p_code VARCHAR(6),IN p_quantity INT UNSIGNED,
IN p_org_id INT UNSIGNED, IN p_course_id INT UNSIGNED)
BEGIN
    DECLARE x_counter INT UNSIGNED;
    IF p_quantity = 0 OR p_quantity IS NULL THEN
        SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
    ELSE
        SET x_counter = 1;
        WHILE x_counter <= p_quantity DO
            CALL create_new_group(p_code,x_counter,p_org_id,NULL,p_course_id);
            SET x_counter = x_counter + 1;
        END WHILE;
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS select_groups_by_course_id(IN p_course_id INT UNSIGNED)
BEGIN
    IF p_course_id IS NULL OR p_course_id = 0 THEN
        SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
    ELSE
        SELECT group_id, group_code, group_number, teacher_id, course_id FROM `group`
        WHERE course_id = p_course_id;
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS delete_a_group_from_course_id(IN p_course_id INT UNSIGNED,IN p_number INT UNSIGNED)
BEGIN
    IF (p_course_id = 0 OR p_course_id IS NULL) OR (p_number = 0 OR p_number IS NULL) THEN
        SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
    ELSE
        DELETE FROM `group` WHERE course_id=p_course_id AND group_number = p_number;
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS update_group_number(IN p_course_id INT UNSIGNED,
IN p_number INT UNSIGNED, IN p_new_number INT UNSIGNED)
BEGIN
    IF (p_course_id = 0 OR p_course_id IS NULL) OR (p_number = 0 OR p_number IS NULL) THEN
        SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
    ELSE
        UPDATE `group` SET group_number = p_new_number WHERE course_id = p_course_id AND
        group_number = p_number;
    END IF;
END //
DELIMITER ;

-- DELIMITER //
-- CREATE PROCEDURE IF NOT EXISTS delete_group_by_number(IN p_course_id INT UNSIGNED,
-- IN p_number INT UNSIGNED)
-- BEGIN
--     DECLARE x_flag TINYINT DEFAULT(0);
--     DECLARE x_done TINYINT DEFAULT(0);
--     DECLARE x_course_id INT UNSIGNED;
--     DECLARE x_number INT UNSIGNED;
--     DECLARE x_id INT UNSIGNED;
--     IF (p_course_id == 0 OR p_course_id IS NULL) OR (p_number == 0 OR p_number IS NULL) THEN
--         SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
--     ELSE
--         DECLARE x_cursor CURSOR FOR SELECT group_id,group_number,course_id 
--         FROM `group` WHERE course_id = p_course_id;
--         DECLARE CONTINUE HANDLER FOR NOT FOUND SET x_done = 0;
--         OPEN x_cursor;
--         x_cursor_loop: LOOP
--             FETCH x_cursor INTO x_id,x_number,x_course_id;
--             IF(x_flag == 0) THEN
--                 IF (x_number = p_number and x_course_id = p_course_id) THEN
--                     CALL delete_a_group_from_course_id(p_course_id,x_number);
--                     SET x_flag = 1;
--                 
--                 END IF;
--             ELSE IF (x_flag == 1) THEN
--                 CALL update_group_number(p_course_id,x_number,x_number-1);
--             END IF;
--             IF (x_done == 1) THEN
--                 LEAVE x_cursor_loop;
--             END IF;
--         END LOOP x_cursor_loop;
--         CLOSE x_cursor;
--     END IF; 
-- END //
-- DELIMITER ;

-- LESSON PROCEDURES

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS create_new_lesson(IN p_day varchar(3),IN p_begin TIME,
IN p_end TIME, IN p_org_id INT UNSIGNED, IN p_group_id INT UNSIGNED,  IN p_course_id INT UNSIGNED)
BEGIN
    IF (p_day IS NULL OR p_day = '') OR (p_org_id = 0 OR p_org_id IS NULL)
    OR (p_course_id = 0 OR p_course_id IS NULL) OR (p_group_id = 0 or p_group_id IS NULL) THEN
        SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
    ELSE
       INSERT INTO lesson ( lesson_day, lesson_begin, 
       lesson_end, organization_id, group_id, classroom_id ) VALUES ( 
            p_day, p_begin, p_end, p_org_id, p_group_id, p_course_id);
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS update_lesson_hours(IN p_id INT UNSIGNED, IN p_begin TIME,
IN p_end TIME)
BEGIN
    IF (p_begin IS NULL or p_end IS NULL) OR (p_id = 0 OR p_id IS NULL) THEN
        SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
    ELSE
        UPDATE lesson SET lesson_begin = p_begin, lesson_end = p_end WHERE lesson_id = p_id;
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS select_lessons_by_course(IN p_course_id INT UNSIGNED)
BEGIN
    IF p_course_id = 0 OR p_course_id IS NULL THEN
        SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
    ELSE
       SELECT l.lesson_id, l.lesson_day, l.lesson_begin, l.lesson_end, l.organization_id,
       l.group_id, l.classroom_id,g.group_id, g.course_id, c.course_name FROM lesson l INNER JOIN
       `group` g ON l.group_id = g.group_id INNER JOIN course c ON g.course_id = c.course
       WHERE c.course_id = p_course_id;
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS delete_lesson_by_id(IN p_id INT UNSIGNED)
BEGIN
    IF p_id = 0 OR p_id IS NULL THEN
        SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
    ELSE
        DELETE FROM lesson WHERE lesson_id = p_id;
    END IF;
END //
DELIMITER ;

-- CLASSROOM PROCEDURES

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS create_new_classroom (IN p_number INT UNSIGNED, 
IN p_code VARCHAR(6), IN p_org_id INT UNSIGNED)
BEGIN
    IF (p_number IS NULL OR p_number = 0) OR (p_org_id = 0 OR p_org_id IS NULL) THEN
        SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
    ELSE
       INSERT INTO classroom ( classroom_number, classroom_code, organization_id ) 
       VALUES(p_number, p_code, p_org_id);
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS update_classroom_by_id(IN p_id INT UNSIGNED, 
IN p_number INT UNSIGNED, IN p_code VARCHAR(6))
BEGIN
    IF (p_id = 0 OR p_id IS NULL) THEN
        SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
    ELSE
        UPDATE classroom SET classroom_number = p_number, classroom_code=p_code WHERE
        classroom_id=p_id;
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS select_classrooms_by_org(IN p_org_id INT UNSIGNED)
BEGIN
    IF (p_org_id = 0 OR p_org_id IS NULL) THEN
        SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';
    ELSE
        select classroom_id, classroom_number, classroom_code,organization_id WHERE
        organization_id = p_organization_id;
    END IF;   
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS delete_classroom_by_id(IN p_id INT UNSIGNED)
BEGIN
    IF p_id IS NULL OR p_id IS NULL THEN
      SIGNAL SQLSTATE '20000' SET MESSAGE_TEXT = 'Some parameters are null or empty.';  
    ELSE
        DELETE FROM classroom WHERE classroom_id = p_id;
    END IF;
END //
DELIMITER ;