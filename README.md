#Setup
Requires NodeJS, NPM, and MongoDB.

Remote DB is for production use ONLY. Use a local mongodb for testing.

#Running
__Node JS Server__  
on Mac: `> DEBUG=dork-api ./bin/www`

__MongoDb Instance__  
`> mongod`

#Openshift info
##Jenkins
https://jenkins-sababado.rhcloud.com/  
User:   `admin`  
Pwd:    `uberdork`
  
##RockMongo
https://dorktest-sababado.rhcloud.com/rockmongo/  
User:   `admin`  
Pwd:    `arTF1_tXyu_S`

##Dev
Root User:  `admin`  
Root Pwd:   `arTF1_tXyu_S`  
Database Name:  `dork_db`  
Connection URL: `mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/`

#Files
* app.js - starting point. Update this when adding new routes
* routes - Has all controllers
* models - Has all mongodb models
* models/index.js - Update this when adding new models.