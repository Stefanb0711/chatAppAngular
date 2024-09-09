import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import cors from "cors";
import {configDotenv} from "dotenv";
import jwt from "jsonwebtoken";


/*const apiKey = process.env.API_KEY;
console.log("Api Key: ", apiKey);*/

const app = express();
const port = 3001;

const JWT_SECRET = "geheimSchlüssel";

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

const payload = {
    "username": "",
    "password": ""
};

/*
function verifyToken(req, res, next) {
    const authHeader = req.headers['Authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log("TokenVonAuthHeader", token);

    if (token == null) return res.sendStatus(401); // Kein Token vorhanden

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Token ist ungültig

        req.user = user; // Speichert die dekodierten Benutzerinformationen in der Anfrage
        next();
    });
}*/

app.get("/get-my-contacts", async (req, res) => {


});

app.post("/register", async (req, res) => {


    const registerData = req.body;

    console.log("RegistrationData", registerData);

    const resultSearchingExistingUsernamesOrEmails = db.query("SELECT username WHERE username = $1 OR email = $2", [])

    if (registerData.password !== registerData.passwordConfirm){
        return res.status(404).json({"message" : "Passwörter stimmen nicht überein"})
    }

    try {

        const response = await db.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3)", [registerData.username, registerData.email, registerData.password]);
        if (response.ok){
            return res.status(200).json({"message": "Benutzer erfolgreich registriert"});
        }


    } catch(err){
        return res.status(500).json({"message": "Internal Server Error"});
    }

});

app.get("/get-all-users", /*verifyToken()*/ async (req, res) => {

    try{
        const result = await db.query("SELECT * FROM users");

        return res.status(200).json({"data": result.rows});

    } catch (err){
        console.error(err);
    }


});

app.post("/get-users-matching-search", /*verifyToken(),*/ async(req, res) => {

    const searchInput = req.body["inputValue"];

    console.log("SearchInput: ", searchInput);

    try {
        const result = await db.query("SELECT * FROM users WHERE username ILIKE $1 ", [`%${searchInput}%`]);

        console.log("Result.Rows: ", result.rows);

        if (result.rows.length > 0)
            return res.status(200).json({"userData": result.rows});

        return res.status(404).json({"message": "Keine Kontakte gefunden"});

    } catch(err){
        console.error(err);
        return res.status(500).json({"message": "Internal Server error"});
    }

});



app.get("/login", async (req, res) => {

    const loginData = req.body;

    jwt.sign(payload, jwtSecret, {expiresIn: "1h"});

});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


