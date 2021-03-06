const syncMySQL = require('sync-mysql');

// ----------------------------------------------------------------------------------------
// PLEASE DO NOT TOUCH THESE CONSTANTS
// THEY ARE USED TO CONNECT TO THE HOSTED DATABASE
const dbHost = '18.221.83.136'
const dbRootUser = 'root'
const dbName = 'platform341'
const testDbName = 'testing341'
const dbRootPass = 'ribalestbeau'

module.exports.SyncConn = new syncMySQL({
    host: dbHost,
    user: dbRootUser,
    password: dbRootPass,
    database: dbName //REMEMBER TO CHANGE THIS YO
});

module.exports.TestSynConn = new syncMySQL({
    host: dbHost,
    user: dbRootUser,
    password: dbRootPass,
    database: testDbName
})
// ----------------------------------------------------------------------------------------

module.exports.ObjectToQuery = (object) => {
    return Object.values(object).map(x => "'" + x + "'").join(',')
}

module.exports.InsertEscapeCharacters = (text) => {
    escapeSingleQuote = text.replace(/'/g, "\\'")
    console.log("escapedString =>", escapeSingleQuote)
    return escapeSingleQuote
}
