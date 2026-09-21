const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req,res) => {
  res.json({
    name:"Profolio API",
    status:"running",
    message:"Portfolio & Resume Builder backend is ready."
  });
});

app.post("/api/health", (req,res) => {
  res.json({ok:true});
});

// Add your AI provider integration here later.
// Keep API keys in environment variables, never in frontend code.

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
