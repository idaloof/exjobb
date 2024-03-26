import mariadb from "mariadb";

// const pool = mariadb.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     // connectionLimit: 10,
//      multipleStatements: true,
//     // namedPlaceholders: true
// });

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
            // namedPlaceholders: true
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
        // return new Promise(async (resolve, reject) => {
            // this.client.all(query, [], (err, rows) => {
            //     if (err) {
            //         reject(err);
            //     } else {
            //         resolve(rows);
            //     }
            // });
        // });
    }

    async findBy(table: string, args: (string | number)[], column: string): Promise<any[]>
    {
        const query = `SELECT * FROM ${table} WHERE ${column} IN (${this.phString(args.length)})`;
        const res = await this.queryWithArgs(query, args)
        return res;
        // return new Promise((resolve, reject) => {
            // this.client.all(query, [_id], (err, rows) => {
            //     if (err) {
            //         reject(err);
            //     } else {
            //         resolve(rows);
            //     }
            // });
        // });
    }

    // async find(table: string, id: number): Promise<any | null> {
    //     const query = `SELECT * FROM ${table} WHERE ${column} IN (${this.phString(args.length)})`;
    //     // return new Promise((resolve, reject) => {
    //     //     const stmt = this.client.prepare(query);
    //     //     stmt.get([_id], (err, row) => {
    //     //         if (err) {
    //     //             reject(err);
    //     //         } else {
    //     //             resolve(row)
    //     //         }
    //     //     })
    //     // });
    // }

    // async customQuery(query: string, args: string[] = []): Promise<any[]> {
    //     return new Promise((resolve, reject) => {
    //         this.client.all(query, args, (err, rows) => {
    //             if (err) {
    //                 reject(err);
    //             } else {
    //                 resolve(rows);
    //             }
    //         });
    //     });
    // }

    private phString(length: number) {
        return new Array(length).fill('?').join(', ');
    }
}
