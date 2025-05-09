-- First, update any existing invoices to remove references to the address being deleted
UPDATE `hewwwe`.`invoice` SET `address_id` = NULL WHERE `address_id` = ?; -- Replace ? with the address_id you're trying to delete

-- Drop the existing foreign key constraint
ALTER TABLE `hewwwe`.`invoice` 
DROP FOREIGN KEY `FKfr58frcfyt9my16gqv09hn2n8`;

-- Modify the column to allow NULL values
ALTER TABLE `hewwwe`.`invoice` 
MODIFY COLUMN `address_id` BIGINT NULL;

-- Re-add the foreign key constraint with ON DELETE SET NULL
ALTER TABLE `hewwwe`.`invoice` 
ADD CONSTRAINT `FKfr58frcfyt9my16gqv09hn2n8` 
FOREIGN KEY (`address_id`) 
REFERENCES `hewwwe`.`address` (`address_id`) 
ON DELETE SET NULL;
