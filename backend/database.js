import pg from "pg";

const { Pool } = pg;

const db = new Pool({
    connectionString: process.env.SUPABASE_URL
});

export default db;