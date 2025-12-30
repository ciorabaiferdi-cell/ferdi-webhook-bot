const express = require("express");
const app = express();

app.use(express.json());

app.post("/assign", (req, res) => {
  console.log("Received body:", req.body);
  res.json({ status: "ok", received: req.body });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
