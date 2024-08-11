import mysql from "mysql2"

export const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "Srivardhan@SQL17",
    database: "blog"
})