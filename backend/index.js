const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const flowchartRoute = require("./routes/flowchart");


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", flowchartRoute);

app.get("/",(req, res) => res.json({ status: "CodeFlow API running" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server is running on Port ${PORT}`));