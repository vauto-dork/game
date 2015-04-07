module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'development':
            return {
                "NODE_PORT": process.env.OPENSHIFT_NODEJS_PORT,
                "NODE_IP": process.env.OPENSHIFT_NODEJS_IP
            };

        case 'production':
            return {
                "NODE_PORT": process.env.OPENSHIFT_NODEJS_PORT,
                "NODE_IP": process.env.OPENSHIFT_NODEJS_IP
            };

        default:
            return {
                "MONGO_URI": "mongodb://localhost/dork_db",
                "NODE_PORT": "3000",
                "NODE_IP": '127.0.0.1'
            };
    }
};