DROP PROCEDURE IF EXISTS mypartition3;

DELIMITER //

CREATE PROCEDURE mypartition3(min INT, max INT)
BEGIN
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

	INSERT INTO low SELECT * FROM prices WHERE (min > price);
	INSERT INTO high SELECT * FROM prices WHERE (max < price);
	INSERT INTO middle SELECT * FROM prices WHERE (min <= price AND max >= price);
END ; //

DELIMITER ;
