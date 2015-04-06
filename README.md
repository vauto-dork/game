#Setup
Requires NodeJS, NPM, and MongoDB.

Remote DB is for production use ONLY. Use a local mongodb for testing.

#Running
*Node JS Server*
on Mac: `> DEBUG=dork-api ./bin/www`

*MongoDb Instance*
> `mongod`

#Files
* app.js - starting point. Update this when adding new routes
* routes - Has all controllers
* models - Has all mongodb models
* models/index.js - Update this when adding new models.