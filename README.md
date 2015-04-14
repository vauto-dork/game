#Setup
Requires NodeJS, NPM, and MongoDB.

Remote DB is for production use ONLY. Use a local mongodb or setup a Heroku dev env for testing.

#Running
__Node JS Server__  
on Mac: `> DEBUG=dork-api ./bin/www`

__MongoDb Instance__  
`> mongod`

#Account Info
username: `vautodork@gmail.com`  
password: `uberdork`  
This account is used for gmail, Trello, and Parse

#Trello
https://trello.com/b/Es8lXpIL/dork-android

#Heroku Setup
Login to Heroku with the credentials

Username:   `vautodork@gmail.com`  
Password:   `uberdork`

Please do **not** do anything that is not free. My card is attached to the account and I'll
discontinue service immediately if unexpected charges show up.

There is an app on Heroku for each environment.

Follow these steps for each env (dev, prod) to set up your local environment:

1. Add the git repo as a remote. When "code is good" `git push <remote_name> master` to deploy your changes.

##dork-dev
**Git Repo**    https://git.heroku.com/dork-dev.git  

##dork-prod
**Git Repo**    https://git.heroku.com/dork-prod.git

#Files
* app.js - starting point. Update this when adding new routes
* routes - Has all controllers
* models - Has all mongodb models
* models/index.js - Update this when adding new models.