async function initDatabase() {
    let SQL = await initSqlJs({ locateFile: filename => `sql-wasm.wasm` });

    // Create a new database
    let db = new SQL.Database();

    // Create a table for passwords
    db.run(`
        CREATE TABLE IF NOT EXISTS passwords (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            website TEXT NOT NULL,
            username TEXT NOT NULL,
            password TEXT NOT NULL
        )
    `);

    return db;
}
