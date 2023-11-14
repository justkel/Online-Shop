const mongoDbStore = require("connect-mongodb-session");
const session = require("express-session");

function createSessionStore () {
    const MongoDBStore = mongoDbStore(session);

    const store = new MongoDBStore({
        uri: "mongodb://0.0.0.0:27017",
        databaseName: "online-shop",
        collection: "sessions"
    })

    return store;
}

function createSessionConfig () {
    return {
        secret: "mySuper-secret",
        resave: false,
        saveUninitialized: false,
        store: createSessionStore(),
        cookie: {
            maxAge: 2 * 24 * 60 * 60 * 1000
        }
    };
}

module.exports = createSessionConfig;