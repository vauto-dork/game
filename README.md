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
####Jenkins
https://jenkins-sababado.rhcloud.com/  
User:   `admin`  
Pwd:    `uberdork`
  
####RockMongo
https://dorktest-sababado.rhcloud.com/rockmongo/  
User:   `admin`  
Pwd:    `arTF1_tXyu_S`

####MongoDb
Root User:  `admin`  
Root Pwd:   `arTF1_tXyu_S`  
Database Name:  `dork_db`  

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