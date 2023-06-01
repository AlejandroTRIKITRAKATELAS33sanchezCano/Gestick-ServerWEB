import {createPool} from "mysql2/promise"
import {dbConfig} from "./config.js"

var dataBase = createPool(dbConfig);

export const db = dataBase;