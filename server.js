const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

// DB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/mams_system")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Asset Schema
const AssetSchema = new mongoose.Schema({
  name: String,
  base: String,
  type: String,
  quantity: Number,
  condition: String,
  lastUpdated: { type: Date, default: Date.now },
});

const Asset = mongoose.model("Asset", AssetSchema);

// Routes

// Get all assets
app.get("/api/assets", async (req, res) => {
  const assets = await Asset.find();
  res.json(assets);
});

// Add asset
app.post("/api/assets", async (req, res) => {
  const asset = new Asset(req.body);
  await asset.save();
  res.json({ message: "Asset added", asset });
});

// Update asset
app.put("/api/assets/:id", async (req, res) => {
  const updated = await Asset.findByIdAndUpdate(
    req.params.id,
    { ...req.body, lastUpdated: Date.now() },
    { new: true }
  );
  res.json(updated);
});

// Delete asset
app.delete("/api/assets/:id", async (req, res) => {
  await Asset.findByIdAndDelete(req.params.id);
  res.json({ message: "Asset Deleted" });
});

// Server
app.listen(5000, () => console.log("Server running on port 5000"));
