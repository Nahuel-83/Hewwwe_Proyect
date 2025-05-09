-- Step 1: Identify the address_id you're trying to delete
-- SELECT * FROM address WHERE address_id = ?; -- Replace ? with your address ID

-- Step 2: Update all invoices to remove references to this address
UPDATE `hewwwe`.`invoice` SET `address_id` = NULL WHERE `address_id` = ?; -- Replace ? with your address ID

-- Step 3: Drop the existing foreign key constraint
ALTER TABLE `hewwwe`.`invoice` 
DROP FOREIGN KEY `FKfr58frcfyt9my16gqv09hn2n8`;

-- Step 4: Modify the column to allow NULL values
ALTER TABLE `hewwwe`.`invoice` 
MODIFY COLUMN `address_id` BIGINT NULL;

-- Step 5: Re-add the foreign key constraint with ON DELETE SET NULL
ALTER TABLE `hewwwe`.`invoice` 
ADD CONSTRAINT `FKfr58frcfyt9my16gqv09hn2n8` 
FOREIGN KEY (`address_id`) 
REFERENCES `hewwwe`.`address` (`address_id`) 
ON DELETE SET NULL;

-- Step 6: Now you can safely delete the address
-- DELETE FROM `hewwwe`.`address` WHERE `address_id` = ?; -- Replace ? with your address ID
