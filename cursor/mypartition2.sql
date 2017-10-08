-- So it doesn't break every time we SOURCE
DROP PROCEDURE IF EXISTS mypartition2;

DELIMITER //

CREATE PROCEDURE mypartition2(min INT, max INT, lowLim INT, middleLim INT, highLim INT)
BEGIN
	DECLARE done INT DEFAULT FALSE;
	DECLARE x DECIMAL(5,2);
	DECLARE y TEXT;
	DECLARE z INT;
	DECLARE cur1 CURSOR FOR SELECT * FROM prices;
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
		FETCH cur1 INTO x,y,z;
		-- x gets price, y gets notes, z gets id
		IF done THEN 
			LEAVE read_loop;
		END IF;

		IF (min > x) AND (lowLim > (SELECT count(*) FROM low)) THEN
			INSERT INTO low VALUES (x, y, z);
		ELSEIF max < x AND (middleLim > (SELECT count(*) FROM high)) THEN
			INSERT INTO high VALUES (x, y, z);
		ELSEIF highLim > (SELECT count(*) FROM middle) THEN
			INSERT INTO middle VALUES (x, y, z);
		END IF;
	END LOOP;
END; //

DELIMITER ;
