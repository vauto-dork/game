module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'development':
            return {
                "MONGO_URI": "mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/",
                "NODE_PORT": "80"
            };

        case 'production':
            return {
                "MONGO_URI": "mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/",
                "NODE_PORT": "80"
            };

        default:
            return {
                "MONGO_URI": "mongodb://localhost/dork_db",
                "NODE_PORT": "3000"
            };
    }
};