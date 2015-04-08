#Setup
Requires NodeJS, NPM, and MongoDB.

Remote DB is for production use ONLY. Use a local mongodb for testing.

#Running
__Node JS Server__  
on Mac: `> DEBUG=dork-api ./bin/www`

__MongoDb Instance__  
`> mongod`

#Openshift info
##Dev
A dev environment can easily be setup using Heroku. No etra configuration is necessary.
Create an account on heroku.com. Follow the getting started guide to create a Node JS application,
however instead of using their sample git repo use this one. Before deploying the app make sure
to install a MongoLabs add-on to the app. This requires credit card information in case you
choose something other than the free option. Again: **No extra configuration is necessary**.

##Prod
####Jenkins
https://jenkins-vautodork.rhcloud.com  
User:   `admin`  
Pwd:    `uberdork`

####RockMongo
https://prod-vautodork.rhcloud.com/rockmongo/  
User:   `admin`  
Pwd:    `9JAIxATRPsxq`

####MongoDb
Root User:  `admin`  
Root Pwd:   `9JAIxATRPsxq`  
Database Name: `prod`

#Files
* app.js - starting point. Update this when adding new routes
* routes - Has all controllers
* models - Has all mongodb models
* models/index.js - Update this when adding new models.