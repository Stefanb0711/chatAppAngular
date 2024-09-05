import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import cors from "cors";
import {configDotenv} from "dotenv";

/*const apiKey = process.env.API_KEY;
console.log("Api Key: ", apiKey);*/

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "ChatApp",
    password: "bonez187",
    port: 5432,
});
db.connect();

app.use(cors({
  origin: 'http://localhost:4200', // Erlaubt Anfragen von diesem Origin
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

app.set('view engine', 'ejs');
//app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(express.static("public"));



app.post("/get-my-contacts", async (req, res) => {



});

app.post("/register", async (req, res) => {


    const registerData = req.body;

    console.log("RegistrationData", registerData);


    const result = await db.query("INSERT INTO users (username, email, password) VALUES (1, 'Cheese', 9.99)")


});


app.get("/login", async (req, res) => {

});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


