const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const roomRoutes = require("./routes/roomRoutes");
const metaRoutes = require("./routes/metaRoutes");
const correlationId = require("./middleware/correlationId");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.disable("x-powered-by");
app.use(correlationId);
app.use((_req, res, next) => {
  res.setHeader("X-API-Version", "1");
  next();
});

app.use(cors());
app.use(express.json());

app.use("/api/rooms", roomRoutes);
app.use("/api/meta", metaRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
