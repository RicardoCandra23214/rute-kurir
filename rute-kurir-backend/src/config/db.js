const mysql = require("mysql2");

function createConnection() {
  const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  db.connect((err) => {
    if (err) {
      console.log("Database gagal terkoneksi, coba lagi dalam 5 detik...", err.code);
      setTimeout(createConnection, 5000);
    } else {
      console.log("Database berhasil terkoneksi");
    }
  });

  // kalau koneksi putus di tengah jalan (misal MySQL restart), otomatis reconnect
  db.on("error", (err) => {
    console.log("Koneksi database terputus:", err.code);
    if (err.code === "PROTOCOL_CONNECTION_LOST" || err.fatal) {
      createConnection();
    }
  });

  connection = db;
  return db;
}

let connection = createConnection();

module.exports = {
  query: (...args) => connection.query(...args),
};