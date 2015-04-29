module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'development':
            return {
                "MONGO_URI": process.env.MONGOLAB_URI
            };

        case 'production':
            return {
                "MONGO_URI": process.env.MONGOLAB_URI
            };

        default:
            return {
                "MONGO_URI": "mongodb://localhost/dork_db",
                "NODE_PORT": "5000",
                "NODE_IP": '127.0.0.1'
            };
    }
};