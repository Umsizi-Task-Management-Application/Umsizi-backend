// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
// const swaggerJsdoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");
const sql = require("msnodesqlv8");

const app = express();

// Define connection string
const connectionString =
  "server=MXOLISIS\\SQLEXPRESS01;Database=UmsiziDB;Integrated Security=sspi;Connection Timeout=30;Driver={SQL SERVER}";

// sql
//   .connect(connectionString)
//   .then(() => console.log("Database connection successful"))
//   .catch((err) => console.error("Database connection failed:", err));

// getUsers();
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
async function getTasksForUser(userID) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM [dbo].[Tasks] WHERE UserID = ?";
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
// const swaggerOptions = {
//   swaggerDefinition: require("./swagger.yaml"),
//   apis: ["./routes/*.yaml"],
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "My API",
//       version: "1.0.0",
//       description: "API documentation using Swagger",
//     },
//   },
//   apis: ["./routes/*.js"],
// };

// const swaggerDocs = swaggerJsdoc(swaggerOptions);

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
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

/**
 * @swagger
 * /getUsers:
 *   get:
 *     summary: Retrieve all users
 *     description: Retrieve a list of all users from the database
 *     responses:
 *       '200':
 *         description: A JSON array of user objects
 *       '500':
 *         description: Internal server error
 */
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
/**
 * @swagger
 * /Newuser:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user with the provided name and email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       '201':
 *         description: User created successfully
 *       '500':
 *         description: Error creating user
 */
app.post("/Newuser", async (req, res) => {
  const { name, email } = req.body;
  try {
    await createUser(name, email);
    res.status(201).send("User created successfully");
  } catch (err) {
    res.status(500).send("Error creating user");
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
