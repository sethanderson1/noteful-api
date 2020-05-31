ALTER TABLE folders 
  DROP COLUMN if exists author_id;
  
ALTER TABLE notes 
  DROP COLUMN if exists author_id;

DROP TABLE IF EXISTS users;