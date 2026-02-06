import express from "express";
import cors from "cors";
import healthRoute from "./routes/health.route";

const app = express();

app.use(cors());
app.use(express.json());
// routes
app.use("/api", healthRoute);

// app.get("/", (req, res) => {
//   res.send("Echo backend is running");
// });

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
