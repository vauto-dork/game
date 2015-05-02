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
                "MONGO_URI": "mongodb://heroku_app35661006:6i3jtqth00cld8qgtumsbgsim@ds061681.mongolab.com:61681/heroku_app35661006",
                "NODE_PORT": "5000",
                "NODE_IP": '127.0.0.1'
            };
    }
};