// db.ts
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(':memory:'); // or specify a file path for a persistent database

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS resources (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)');
});

export default db;
