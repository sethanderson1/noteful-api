INSERT INTO folders (folder_name)
VALUES 
('first folder'),
('second folder');
INSERT INTO folders (folder_name)
VALUES 
('second folder');

INSERT INTO notes (id,title, content, date_modified,folder_id)
VALUES 
(1,'fisrt note', 'swcond message asdf', '2023-03-22T16:28:32.615Z',1),
(2,'send note', 'swcond message asdf', '2023-03-22T16:28:32.615Z',2),
(3,'third note', 'swcond message asdf', '2023-03-22T16:28:32.615Z',1);

SELECT * FROM folders;

SELECT * FROM notes;
