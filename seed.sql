  
INSERT INTO department (name)
VALUES ("Management"), ("IT");

INSERT INTO role (title, salary, department_id)
VALUES("Manager", "100000","1"), ("Product Development", "65100.00", "1"), ("Senior Developer", "200000.00", "2"),  ("Junior Developer", "85000.00", "2"); 

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Elon", "Musk", "2"), ("Bill", "Murray", "2");

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Peter", "Carlson", "1", "1"), ("Steve", "Mcdonald", "2", "1");