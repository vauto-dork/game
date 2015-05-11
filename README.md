[![Codacy Badge](https://www.codacy.com/project/badge/e8b26b82697c41af8dbfec0da42caeb2)](https://www.codacy.com)

#Setup
Requires NodeJS, NPM, and MongoDB.

Remote DB is for production use ONLY. Use a local mongodb or setup a Heroku dev env for testing.

## Documentation
If updating any API make sure the documentation is up to date.  
http://docs.dorkapi.apiary.io/

#Running
1. First start a MongoDb instance (only required if using local mongodb; not necessary if pointing to dev or prod DB via config file)
`> mongod`
2. Start the Node JS server
    * on Mac: `> DEBUG=dork-api ./bin/www`
    * on Windows/Linux:
        1. Download the Heroku Toolbelt: https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up
        2. Make sure Heroku Toolbelt installed the Ruby package `foreman` by typing `foreman -v` into command prompt. If not found, then install via Ruby.
        2. Ensure the paths to NPM, Node, and Heroku are registered as environment variables after installation of packages.
        3. Open a command prompt, navigate to the Dork API working folder, and make sure the packages are installed by typing `npm install`
        4. Grab the Heroku configuration file if you want to use the remote database instead of local (ref: https://devcenter.heroku.com/articles/config-vars)
            * Open a command prompt and navigate to working directory's root folder
            * Download the heroku config plugin by typing `heroku plugins:install git://github.com/ddollar/heroku-config.git`
            * After the plugin is installed, grab the dev config by typing `heroku config:pull --app dork-dev`
            * Add the `.env` file to `.gitignore`
        5. Type `foreman start web` to start instance.
3. Test that the server is running by going to `localhost:5000` in your browser.

#Account Info
username: `vautodork@gmail.com`
password: `uberdork`
This account is used for gmail, Trello, pretty much anything that this account should be associated with. If you have a personal account for a tool, for example Trello, then feel free to login as the `vautodork` user and invite yourself, or give yourself access.

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