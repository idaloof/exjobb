import mariadb from "mariadb";

export default class MariaDbHandler {
    private pool: mariadb.Pool

    static instance: MariaDbHandler

    private constructor()
    {
        this.pool = mariadb.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            // connectionLimit: 10,
            multipleStatements: true,
        });
    }

    static getInstance (): MariaDbHandler {
        if (!this.instance) {
            this.instance = new MariaDbHandler()
        }

        return this.instance
    }

    async queryNoArgs (sql: string): Promise<any[]> {
        let conn: mariadb.Connection

        try {
            conn = await this.pool.getConnection();

            let res = await conn.query(sql);
            return res;
            // no catching error here
        } finally {
            if (conn) {
                conn.end();
            }
        }
    }

    async queryWithArgs (sql: string, args: (string | number)[]): Promise<any[]> {
        let conn: mariadb.Connection

        try {
            conn = await this.pool.getConnection();
            let res = await conn.query(sql, args);
            return res;
            // no catching error here
        } finally {
            if (conn) {
                conn.end();
            }
        }
    }

    async findAll(table: string): Promise<any[]>
    {
        const query = `SELECT * FROM ${table}`;
        const res = await this.queryNoArgs(query);
        return res;
    }

    async findBy(table: string, args: (string | number)[], column: string): Promise<any[]>
    {
        const query = `SELECT * FROM ${table} WHERE ${column} IN (${this.phString(args.length)})`;
        const res = await this.queryWithArgs(query, args)
        return res;
    }

    private phString(length: number) {
        return new Array(length).fill('?').join(', ');
    }
}
