import express from "express";
import routes from "./routes/routes.js";
import cookieParser from "cookie-parser";
import { storage_token_middleware } from "./middlewares/storage_token.js";
const app = express();

// use body-parser to parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("uploaded_files");
//   // perform actions on the collection object
//   client.close();
// });
app.use(cookieParser());
app.use(storage_token_middleware);
app.use(routes);

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

server.on("connection", (socket) => {
  // console.log("A new connection was made by a client.");
  socket; // 5 minutes
});
