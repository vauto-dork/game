var mongodb = require('mongodb');
var mongoose = require('mongoose');

var DB = function(){

    // Scope

    var self = this;

    // Setup

    //self.dbServer = new mongodb.Server(process.env.OPENSHIFT_MONGODB_DB_HOST, parseInt(process.env.OPENSHIFT_MONGODB_DB_PORT));
    self.dbHost = process.env.OPENSHIFT_MONGODB_DB_HOST;
    self.dbPort = process.env.OPENSHIFT_MONGODB_DB_PORT;
    //self.db = new mongodb.Db(process.env.OPENSHIFT_APP_NAME, self.dbServer, {auto_reconnect: true});
    self.dbUser = process.env.OPENSHIFT_MONGODB_DB_USERNAME;
    self.dbPass = process.env.OPENSHIFT_MONGODB_DB_PASSWORD;

    // Logic to open a database connection. We are going to call this outside of app so it is available to all our functions inside.

    mongoose.connect(
        'mongodb://'+self.dbUser+":"+self.dbPass+"@"+self.dbHost+":"+self.dbPort+"/dork_db");

    //self.connectDb = function(callback){
    //    self.db.open(function(err, db){
    //        if(err){ throw err };
    //        self.db.authenticate(self.dbUser, self.dbPass, {authdb: "admin"},  function(err, res){
    //            if(err){ throw err };
    //            callback();
    //        });
    //    });
    //};
};

//make a new express app
var database = new DB();

//call the connectDb function and pass in the start server command
//database.connectDb();