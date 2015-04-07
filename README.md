#Setup
Requires NodeJS, NPM, and MongoDB.

Remote DB is for production use ONLY. Use a local mongodb for testing.

#Running
__Node JS Server__\s\s
on Mac: `> DEBUG=dork-api ./bin/www`

__MongoDb Instance__\s\s
`> mongod`

#Openshift info
##Jenkins
https://jenkins-sababado.rhcloud.com/
User:   `admin`\s\s
Pwd:    `uberdork`\s\s

##Dev
Root User:  `admin`\s\s
Root Pwd:   `arTF1_tXyu_S`\s\s
Database Name:  `dork_db`\s\s
Connection URL: `mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/`

#Files
* app.js - starting point. Update this when adding new routes
* routes - Has all controllers
* models - Has all mongodb models
* models/index.js - Update this when adding new models.