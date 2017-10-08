-- So it doesn't break every time we SOURCE
DROP PROCEDURE IF EXISTS mypartition;

DELIMITER //

CREATE PROCEDURE mypartition(min INT, max INT)
BEGIN 
	DECLARE done INT DEFAULT FALSE;
	DECLARE x INT;
	DECLARE cur1 CURSOR FOR SELECT id FROM prices;
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

	-- Creating / Deleating if things exist
        CREATE TABLE IF NOT EXISTS low(
                price DECIMAL(5,2),
                notes TEXT,
                id INT );
        CREATE TABLE IF NOT EXISTS middle (
                price DECIMAL(5,2),
                 notes TEXT,
                id INT );
        CREATE TABLE IF NOT EXISTS high (
                price DECIMAL(5,2),
                notes TEXT,
                id INT );
        -- Truncation
        TRUNCATE TABLE low;
        TRUNCATE TABLE middle;
        TRUNCATE TABLE high;

	OPEN cur1;

	read_loop: LOOP
		FETCH cur1 INTO x;
		IF done THEN 
			LEAVE read_loop;
		END IF;
		IF min > (SELECT price FROM prices WHERE id=x) THEN
			INSERT INTO low 
			SELECT * FROM prices
			WHERE id = x;
		ELSEIF max < (SELECT price FROM prices WHERE id=x)THEN
			INSERT INTO high
			SELECT * FROM prices
			WHERE id = x;
		ELSE 
			INSERT INTO middle
			SELECT * FROM prices
			WHERE id = x;
		END IF;
	END LOOP;

END; //

DELIMITER ;
