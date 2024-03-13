const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sql = require("msnodesqlv8");

const app = express();

// Define connection string
const connectionString =
  "Driver={SQL Server};Server=tcp:ukukhulaserver.database.windows.net,1433;Database=UmsiziDB;Uid=bbdadmin;Pwd=password@1234;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;";

app.use(cors());
async function getUsers() {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM [dbo].[User]";
    sql.query(connectionString, query, (err, rows) => {
      if (err) {
        console.error("Error executing query:", err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
async function newTasksForUser(
  id,
  title,
  description,
  deadline,
  priority,
  stage
) {
  new Promise((resolve, reject) => {
    const deadlineISO = deadline.split("T")[0];
    const query =
      "INSERT INTO [dbo].[Tasks]([id],[title],[description],[deadline],[priority],[stage]) VALUES (?,?,?,?,?,?)";
    sql.query(
      connectionString,
      query,
      [id, title, description, deadlineISO, priority, stage],
      (err, rows) => {
        if (err) {
          console.error("Error executing query:", err);
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
  return;
}
async function getTasksForUser(userID) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM [dbo].[Tasks] WHERE id = ?";
    sql.query(connectionString, query, [userID], (err, rows) => {
      if (err) {
        console.error("Error executing query:", err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

app.use(bodyParser.json());

async function createUser(name, email) {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO [dbo].[User] (name, email) VALUES (?, ?)";
    sql.query(connectionString, query, [name, email], (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

app.get("/getUsers", async (req, res) => {
  try {
    const results = await getUsers();
    res.status(200).send(results);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).send("Error getting users");
  }
});

app.get("/getTasksForUser/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;
    const results = await getTasksForUser(userID);
    res.status(200).send(results);
  } catch (error) {
    console.error("Error getting tasks for user:", error);
    res.status(500).send("Error getting tasks for user");
  }
});

app.post("/Newuser", async (req, res) => {
  const { name, email } = req.body;
  try {
    await createUser(name, email);
    res.status(201).send("User created successfully");
  } catch (err) {
    res.status(500).send("Error creating user");
  }
});
app.post("/NewTask", async (req, res) => {
  const { id, title, description, deadline, priority, stage } = req.body;
  try {
    await newTasksForUser(id, title, description, deadline, priority, stage);
    res.status(201).send({ message: "task created successfully" });
  } catch (err) {
    res.status(500).send({ message: "Error creating user" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
