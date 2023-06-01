import parseDatabaseUrl from "parse-database-url";
const sqlurl = process.env.MYSQLURL ||"mysql://root:alesonic111.@localhost:3306/mydb";
const dbCon = parseDatabaseUrl(sqlurl);

export const PORT = process.env.PORT || 3000;

export const dbConfig = dbCon;