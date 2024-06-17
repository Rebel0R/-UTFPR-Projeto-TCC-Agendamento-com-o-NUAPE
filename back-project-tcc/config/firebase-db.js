const db = require("firebase-admin");

const serviceAccount = require("./scheduling-nuape-pg-key.json");

db.initializeApp({
  credential: db.credential.cert(serviceAccount),
  databaseURL: "https://scheduling-nuape-63d88-default-rtdb.firebaseio.com/",
});
console.log("Conexão bem sucedida com o banco!");

module.exports = db;
