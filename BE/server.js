const app = require("./app");

var bodyParser = require("body-parser");
const { errorMiddleware } = require("./middlewares/errorMiddleware");
// Database connect
app.use(bodyParser.urlencoded({ extended: true }));
const database = require("./config/database");
database();

const cloudinary = require("cloudinary");

app.get("/", async (req, res) => {
  res.send("working");
});
let PORT = process.env.PORT || 4000;
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

app.use(errorMiddleware);

let server = app.listen(process.env.PORT, () => {
  console.log(`server is running at ${process.env.PORT}`);
});
