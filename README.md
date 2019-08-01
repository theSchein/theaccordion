# The Accordion
Source Code for The Accordion App, a concept to autofill insurance forms. Users can collect insurance information and autogenerate ACORDs forms as well as save them to a database tied to the individual user. This is a technical demo for a business concept we are not currrently proceeding with. 

App demo can be seen running here:
https://www.theaccordion.net

This is a Node.js express app deployed on Heroku. The database uses nonSQL mongoDB.

## Getting Started

Clone the repo and make sure you have nodemon and mongodb installed.

Initialize the database with terminal command:

`sudo mongod --port 27017`

Initialize the application with terminal command:

`nodemon index.js`
