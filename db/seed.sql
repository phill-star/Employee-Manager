USE employee_db;

INSERT INTO department (name) VALUES ("Supply Chain");
INSERT INTO department (name) VALUES ("Marketing");
INSERT INTO department (name) VALUES ("Information Technology");
INSERT INTO department (name) VALUES ("Medical Staff");

INSERT INTO role (title, salary, department_id) VALUES ("Engineer", 70, 3);
INSERT INTO role (title, salary, department_id) VALUES ("Web Specialist", 50, 2);
INSERT INTO role (title, salary, department_id) VALUES ("Graphic Designer", 50, 2);
INSERT INTO role (title, salary, department_id) VALUES ("Director", 100, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Director", 100, 4);

INSERT INTO employee (first_name, last_name, role_id) VALUES ("John", "Smith", 2);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Heather", "Iris", 1);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Sean", "Brimacombe", 3);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Erik", "Curtis", 4);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Deepa", "Shah", 5);