require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");
const port = 3000;
connectDB();
app.listen(port, () => {
  console.log("server created");
});
