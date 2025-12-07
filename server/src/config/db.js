import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
    host: process.env.DB_HOST || "db",
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || "carpool_user",
    password: process.env.DB_PASSWORD || "carpool_password",
    database: process.env.DB_NAME || "carpool_db",
});

export default pool;