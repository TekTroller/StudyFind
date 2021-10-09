const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const routes = require("./routes");

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use("/", routes);

instance = app.listen(port, () => {
  console.log(`server running on PORT: ${port}`);
});

module.exports = {
  instance: instance,
}; // For testing purpose
