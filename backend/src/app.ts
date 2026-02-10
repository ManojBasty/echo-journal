import express from "express";
import cors from "cors";
import healthRoute from "./routes/health.route";
import authRoute from "./routes/auth.route";
import "dotenv/config";
import profileRoute from "./routes/profile.route";

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api", healthRoute);
app.use("/api/auth", authRoute);
app.use("/api", profileRoute);

// app.get("/", (req, res) => {
//   res.send("Echo backend is running");
// });

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
