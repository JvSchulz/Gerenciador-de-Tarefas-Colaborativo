import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import {connectDb, connectPgDb} from "./config/db.js"
import userRoutes from "./NoRelational/routes/userRoutes.js";
import registerRoutes from "./NoRelational/routes/registerRoutes.js"


dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/users", userRoutes);
app.use("/api/registers", registerRoutes);

app.get("/", (req, res) => {
    res.json({ message: "API running"})
})

const PORT = process.env.PORT || 5000

// connectDb() No relational connection

connectPgDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
