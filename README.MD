# Sahac Custom Back End

This is the back end of the system *"Sistema de asignación de horario académico"* that controls all the management of the data base, the script of the database and the logic to properly schedule the assignments for any institution.

### Technologies used for this project

* Node.js

* Mysql2

* jsonwebtoken

* express

* env

* bcrypt

## What I learned from this project?

For this project I learned:

* How to call stored procedures of mysql (**MariaDB**) on node.js

* I learned how to store properly user's passwords on the database by the use of bcrypt with a secret that is stored on the environment variables.

* I also learned how to create middleware to verify if an access token is valid to recover information from the system and how to call that middleware on almost every call that requires authorization using express.

* I learned how to create jsonwebtokens to authorize users to get and store data on the system.

* I learned how to manage exceptions on error to trying to avoid server's failure.

* I learned how to create restful API on node.js


