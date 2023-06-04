import parseDatabaseUrl from "parse-database-url";
const sqlurl = process.env.MYSQLURL ||"mysql://root:n0m3l0@localhost:3306/mydb";
const dbCon = parseDatabaseUrl(sqlurl);

export const PORT = process.env.PORT || 3000;

export const dbConfig = dbCon;