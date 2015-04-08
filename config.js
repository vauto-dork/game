module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'development':
            return {
                "MONGO_URI": process.env.MONGOLAB_URI,
                "NODE_PORT": process.env.OPENSHIFT_NODEJS_PORT,
                "NODE_IP": process.env.OPENSHIFT_NODEJS_IP
            };

        case 'production':
            return {
                "MONGO_URI": "mongodb://dorkAdmin:uberdork@ds061641.mongolab.com:61641/heroku_app35659971",
                "NODE_PORT": process.env.OPENSHIFT_NODEJS_PORT,
                "NODE_IP": process.env.OPENSHIFT_NODEJS_IP
            };

        default:
            return {
                "MONGO_URI": "mongodb://localhost/dork_db",
                "NODE_PORT": "5000",
                "NODE_IP": '127.0.0.1'
            };
    }
};