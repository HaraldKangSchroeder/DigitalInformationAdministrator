import { Pool } from "pg";
import { Grocery, GroceryCartEntry, GroceryData, GroceryType } from "./interfaces";
import { logDivider } from "../utils/utils";
import dotenv from "dotenv";
import { DatabaseError } from "../errors/errors";
import { codes } from "../errors/codes";
dotenv.config();

const CONNECTION_RETRIES_COUNT = 15;

const tables = {
    groceries: "groceries",
    groceryTypes: "grocery_types",
    groceryCart: "grocery_cart",
}

let pool;

export const createConnection = async () => {
    let connectionRetries = CONNECTION_RETRIES_COUNT;
    while (connectionRetries >= 0) {
        try {
            console.log("Try to connect to DB");
            await pool.connect();
            console.log("Connection to DB established");
            logDivider();
            setupDatabase();
            return;
        }
        catch (e) {
            connectionRetries--;
            console.log(`Failed to connect to DB. Remaining retries : ${connectionRetries}`);
            logDivider();
            await new Promise(res => setTimeout(res, 5000));
        }
    }
    console.log("Failed to connect to DB. No retries left");
}

if (process.env.DATABASE_URL) {
    // set options to make it work on Heroku - https://devcenter.heroku.com/articles/connecting-heroku-postgres
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    })
}
else {
    // uses env variables : see https://node-postgres.com/features/connecting
    pool = new Pool()
    createConnection();
}


/**
 * @throws {Error} 
 */
export const createGrocery = async (name: string, type: string) => {
    try {
        let queryText = `
            INSERT INTO ${tables.groceries} VALUES ($1,$2);
        `;
        let queryValues = [name, type];
        await pool.query(queryText, queryValues);
    }
    catch (e) { throw new DatabaseError(codes.badRequest, "Failed to create grocery"); }
}


/**
 * @throws {Error} 
 */
export const getGrocery = async (name: string): Promise<Grocery> => {
    try {
        let queryText = `SELECT name, type FROM ${tables.groceries} WHERE name = $1;`
        let queryValues = [name];
        let { rows } = await pool.query(queryText, queryValues);
        if (rows.length === 0) throw new Error();
        return rows[0];
    }
    catch (e) { throw new DatabaseError(codes.badRequest, "Failed to get grocery"); }
}


/**
 * @throws {Error} 
 */
export const getGroceries = async (): Promise<Grocery[]> => {
    try {
        let queryText = `
            SELECT * FROM ${tables.groceries} ORDER BY name,type;
        `;
        const { rows } = await pool.query(queryText);
        return rows;
    }
    catch (e) { throw new DatabaseError(codes.badRequest, "Failed to get groceries"); }
}


/**
 * @throws {Error} 
 */
export const updateGrocery = async (name: string, grocery: Grocery) => {
    try {
        let queryText = `
            UPDATE ${tables.groceries} SET name = $2, type = $3 WHERE name = $1;
        `;
        let queryValues = [name, grocery.name, grocery.type];
        await pool.query(queryText, queryValues);
    }
    catch (e) { throw new DatabaseError(codes.badRequest, "Failed to update grocery") }
}


/**
 * @throws {Error} 
 */
export const deleteGrocery = async (name: string) => {
    try {
        let queryText = `
            DELETE FROM ${tables.groceries} WHERE name = $1;
        `;
        let queryValues = [name];
        await pool.query(queryText, queryValues);
    }
    catch (e) { throw new DatabaseError(codes.badRequest, "Failed to delete grocery"); }
}


/**
 * @throws {Error} 
 */
export const createGroceryCartEntry = async (name: string, type: string, amount: string) => {
    console.log([name, type, amount])
    try {
        let queryText = `
            INSERT INTO ${tables.groceryCart} VALUES ($1,$2,$3);
        `;
        let queryValues = [name, type, amount];
        await pool.query(queryText, queryValues);
    }
    catch (e) { throw new DatabaseError(codes.badRequest, "Failed to create grocery cart entry"); }
}


/**
 * @throws {Error} 
 */
export const getGroceryCartEntries = async (): Promise<GroceryCartEntry[]> => {
    try {
        let queryText = `
            SELECT * FROM ${tables.groceryCart} ORDER BY type,name;
        `;
        const { rows } = await pool.query(queryText);
        return rows;
    }
    catch (e) { throw new DatabaseError(codes.badRequest, "Failed to get grocery cart entries"); }
}


/**
 * @throws {Error} 
 */
export const deleteGroceryCartEntry = async (name: string) => {
    try {
        let queryText = `
            DELETE FROM ${tables.groceryCart} WHERE name = $1;
        `;
        let queryValues = [name];
        await pool.query(queryText, queryValues);
    }
    catch (e) { throw new DatabaseError(codes.badRequest, "Failed to delete grocery cart entry"); }
}


/**
 * @throws {Error} 
 */
export const getGroceryType = async (type: string): Promise<GroceryType> => {
    try {
        let queryText = `SELECT type, color FROM ${tables.groceryTypes} WHERE type = $1;`
        let queryValues = [type];
        let { rows } = await pool.query(queryText, queryValues);
        if (rows.length === 0) throw new Error();
        return rows[0];
    }
    catch (e) { throw new DatabaseError(codes.badRequest, "Failed to get grocery type"); }
}


/**
 * @throws {Error} 
 */
export const getGroceryTypes = async (): Promise<GroceryType[]> => {
    try {
        let queryText = `
            SELECT * FROM ${tables.groceryTypes} ORDER BY type;
        `;
        const { rows } = await pool.query(queryText);
        return rows;
    }
    catch (e) { throw new DatabaseError(codes.badRequest, "Failed to get grocery types"); }
}


/**
 * @throws {Error} 
 */
export const createGroceryType = async (type: string, color: string) => {
    try {
        let queryText = `
            INSERT INTO ${tables.groceryTypes} VALUES ($1,$2);
        `;
        let queryValues = [type, color];
        await pool.query(queryText, queryValues);
    }
    catch (e) { throw new DatabaseError(codes.badRequest, "Failed to create grocery type"); }
}


/**
 * @throws {Error} 
 */
export const updateGroceryType = async (type: string, groceryType: GroceryType) => {
    try {
        let queryText = `
            UPDATE ${tables.groceryTypes} SET type = $2, color = $3 WHERE type = $1;
        `;
        let queryValues = [type, groceryType.type, groceryType.color];
        await pool.query(queryText, queryValues);
    }
    catch (e) { throw new DatabaseError(codes.badRequest, "Failed to update Grocery Type"); }
}


/**
 * @throws {Error} 
 */
export const deleteGroceryType = async (type: string) => {
    try {
        let queryText = `
            DELETE FROM ${tables.groceryTypes} WHERE type = $1;
        `;
        let queryValues = [type];
        await pool.query(queryText, queryValues);
    }
    catch (e) { throw new DatabaseError(codes.badRequest, "Failed to delete Grocery Type"); }
}


/**
 * @throws {Error} 
 */
export const getGroceryData = async (): Promise<GroceryData> => {
    try {
        let groceryData: GroceryData = {
            groceries: await getGroceries(),
            groceryTypes: await getGroceryTypes(),
            groceryCartEntries: await getGroceryCartEntries()
        }
        return groceryData;
    }
    catch (e) { throw new DatabaseError(codes.badRequest, "Failed to get grocery data"); }
}

export const setupDatabase = async () => {
    try {
        let queryText = `
            CREATE DOMAIN type_color AS VARCHAR CHECK (VALUE ~ '^#[0-9|a-f]{2}[0-9|a-f]{2}[0-9|a-f]{2}$');    
        `;
        await pool.query(queryText);
    }
    catch (e) {
        logDivider();
    }
    try {
        let queryText = `
            CREATE TABLE IF NOT EXISTS ${tables.groceryTypes} 
            (
                type VARCHAR PRIMARY KEY,
                color type_color NOT NULL 
            );
        `;
        await pool.query(queryText);

        queryText = `
            CREATE TABLE IF NOT EXISTS ${tables.groceries}
            (
                name VARCHAR PRIMARY KEY,
                type VARCHAR,
                FOREIGN KEY (type) REFERENCES ${tables.groceryTypes}(type) ON UPDATE CASCADE ON DELETE SET NULL
            );
        `;
        await pool.query(queryText);

        queryText = `
            CREATE TABLE IF NOT EXISTS ${tables.groceryCart}
            (
                name VARCHAR PRIMARY KEY,
                type VARCHAR,
                amount VARCHAR,
                FOREIGN KEY (type) REFERENCES ${tables.groceryTypes}(type) ON UPDATE CASCADE ON DELETE SET NULL
            );
        `;
        await pool.query(queryText);
    }
    catch (e) {
        console.error(e);
        console.log("Failed to setup database");
        logDivider();
    }
}