require("dotenv").config(); // Load environment variables
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const connectDB = require("./config/db"); // Import connectDB function
const schema = require("./schemas/schema");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// GraphQL Endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true, // Enables GraphiQL UI for testing queries
  })
);

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

const mongoose = require("mongoose");
const Employee = require("./models/Employee"); // Import Employee model

// Create employee function (Manually call or use GraphQL mutation)
async function createEmployee() {
  const newEmployee = new Employee({
    first_name: "Nazneen Akter",
    last_name: "Nitu",
    email: "nazanitu@gmail.com",
    gender: "Female",
    department: "IT",
    designation: "Software Engineer",
    salary: 60000,
    date_of_joining: "2024-01-15",
    employee_photo: "https://example.com/photo.jpg",
  });

  try {
    await newEmployee.save(); // Insert the new employee into the database
    console.log("Employee added successfully!");
  } catch (error) {
    console.error("Error inserting employee:", error);
  }
}

// If you want to seed data on startup, you can call createEmployee here (or manually)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    // Optional: Call the createEmployee function if needed
    // createEmployee();
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
