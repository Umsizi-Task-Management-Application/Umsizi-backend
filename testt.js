const sql = require("msnodesqlv8");


function getUsers() {
  const query = "SELECT * FROM [dbo].[User]";
  sql.query(connectionString, query, (err, rows) => {
    if (err) {
      console.error("Error executing query:", err);
      return;
    }
    console.log(rows);
  });
}
getUsers();
