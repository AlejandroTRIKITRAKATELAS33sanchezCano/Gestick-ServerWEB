import parseDatabaseUrl from "parse-database-url";
const sqlurl = process.env.MYSQLURL ||"mysql://root:alesonic111.@localhost:3306/mydb" ||"mysql://root:rfbhAEG03UOygPEGBteZ@containers-us-west-197.railway.app:7632/railway";
const dbCon = parseDatabaseUrl(sqlurl);

export const PORT = process.env.PORT || 3000;

export const dbConfig = dbCon;