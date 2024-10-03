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
  methods: 'GET,POST,PUT,DELETE, PATCH',
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

let currentUserId = null;



function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log("Req: ", req.headers["authorization"]);

    if (token == null) return res.sendStatus(401); // Kein Token vorhanden

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Token ist ungültig

        req.user = user; // Speichert die dekodierten Benutzerinformationen in der Anfrage
        next();
    });
}

app.post("/get-my-contacts-ids", verifyToken, async (req, res) => {

    const currentUserId = req.body["currentUserId"];

    try {
        const result = await db.query("SELECT contacts_of_user FROM users WHERE id=$1", [currentUserId]);

        const data = result.rows[0]["contacts_of_user"];
        //console.log("My Contacts: ", data);

        return res.status(200).json({data});


    } catch (err){
        console.log(err);

        return res.status(500).json({"message": "Internal Server Error"});

    }


});


app.post("/get-my-contacts"/*, verifyToken*/, async (req, res) => {

    const myContactsIds = req.body["myContactsIds"];

    //console.log("MyContactsId: ", myContactsIds);

    try {
        const result = await db.query("SELECT * FROM users WHERE id = ANY($1::int[])", [myContactsIds]);
        //console.log("MyContacts: ", result.rows);

        const data = result.rows;

        return res.status(200).json({data});

    } catch (err) {
        console.error(err);
        return res.status(500).json({"message": "Internal Server Error"});
    }
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

app.get("/get-all-users", verifyToken, async (req, res) => {

    try{
        const result = await db.query("SELECT * FROM users");

        return res.status(200).json({"data": result.rows});

    } catch (err){
        console.error(err);
    }


});

app.post("/get-users-matching-search", verifyToken, async(req, res) => {

    const searchInput = req.body["inputValue"];

    //console.log("SearchInput: ", searchInput);

    try {
        const result = await db.query("SELECT * FROM users WHERE username ILIKE $1 ", [`%${searchInput}%`]);

        //console.log("Result.Rows: ", result.rows);

        if (result.rows.length > 0)
            return res.status(200).json({"userData": result.rows});

        return res.status(404).json({"message": "Keine Kontakte gefunden"});

    } catch(err){
        console.error(err);
        return res.status(500).json({"message": "Internal Server error"});
    }

});



app.post("/login", async (req, res) => {

    const loginData = req.body;


    try{
        const result = await db.query("SELECT * FROM users WHERE username = $1 AND password = $2", [loginData["usernameOrEmail"], loginData["password"]]);

        //console.log("Result.Rows von Login: ", result.rows[0]);

        const currentUser = result.rows[0];

        if (result.rows.length > 0){


            jwt.sign({ loginData }, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
                if (err) {

                    console.log("Result.Rows größer als 1 aber Fehler beim erstellen des Tokens");


                    res.status(500).json({ message: 'Fehler beim Erstellen des Tokens' });
                } else {
                    // Rückgabe des Tokens als Antwort

                    //console.log("CurrentUserId: ", result.rows[0]["id"]);

                    const currentUserId = result.rows[0]["id"];

                    //console.log("CurrentUserId: ", currentUserId);

                    return res.status(200).json({token, currentUserId, currentUser});

                }
            });



        }
    } catch (err){
        console.error(err);
    }

    //jwt.sign(payload, jwtSecret, {expiresIn: "1h"});

});


app.get("/get-current-own-user-id", async (req, res) => {

    //req.headers["Authorization"]

});

app.post("/add-user-for-chat", async (req, res) => {

    const currentUserId = req.body["currentUserId"];
    const contactId = req.body["contactId"];

    console.log("KontaktId: ", contactId);
    console.log("CurrentUserId: ", currentUserId);

    try {
        await db.query("UPDATE users SET contacts_of_user = array_append(contacts_of_user, $1) WHERE id = $2", [contactId, currentUserId]);
        console.log("User adden hat geklappt");
        return res.status(200);
    } catch (err){
        return res.status(500).json({"message": "Internal Server Error"});
    }

})

/*
app.post("/load-chat-messages", async (req, res) => {

   currentUserId = req.body["currentUserId"];
   const currentChatPartnerId = req.body["currentChatPartnerId"];

    try {
        const result = db.query("SELECT * FROM users WHERE current_user_id = $1 AND chat_partner = $2", [currentUserId, currentChatPartnerId]);

        const data = result.rows;

        return res.status(200).json({data});

    } catch (err) {

        return res.status(500).json({"message": "Internal Server Error"});
    }

})*/


app.post("/add-chat-message", async (req, res) => {

    const currentUserId = req.body["currentUserId"];
    const currentChatPartnerId = req.body["currentChatPartnerId"];
    const message = req.body["message"];
    const time_of_message = req.body["time_of_message"];


    //console.log(`CurrentUserId: ${currentUserId}, CurrentChatPartnerId: ${currentChatPartnerId}, Message: ${message}, Time of Message: ${time_of_message}`);

    if (currentUserId === null || currentChatPartnerId === null || message === ""){
        return res.status(404).json({"message": "Entweder Sie sind nicht angemeldet, oder es wurde kein Chatpartner ausgewählt, oder die Chatnachricht ist leer"})
    }

    //Checken ob meine currentUserId der current_user_id oder chat_partner in der datenbank entspricht

    const chatWriterAndChatPartner = await db.query("SELECT current_user_id, chat_partner FROM chats WHERE (current_user_id = $1 OR chat_partner = $2) AND (current_user_id = $3 OR chat_partner = $4)", [currentUserId, currentUserId, currentChatPartnerId, currentChatPartnerId]);

    if (currentUserId === chatWriterAndChatPartner.rows[0]["current_user_id"]){

        try{
            const response = await db.query("INSERT INTO chats (chat_partner, current_user_id, my_text_message, message_time) VALUES ($1, $2, $3, $4)", [currentChatPartnerId, currentUserId, message, time_of_message]);

            if (response.ok){
                return res.status(200).json({"message": "Nachricht erfolgreich verschickt"});
            }
            return res.status(404).json({"message": "Konnte Nachricht nicht verschicken"});

        } catch (err) {

            return res.status(500).json({"message": "Internal Servere error"});
        }

        console.log("CurrentUserId = CurrentUserId");



    } else if (currentUserId === chatWriterAndChatPartner.rows[0]["chat_partner"]){


        try{
            const response = await db.query("INSERT INTO chats (chat_partner, current_user_id, chat_partner_message, message_time) VALUES ($1, $2, $3, $4)", [currentUserId, currentChatPartnerId , message, time_of_message]);

            if (response.ok){
                return res.status(200).json({"message": "Nachricht erfolgreich verschickt"});
            }
            return res.status(404).json({"message": "Konnte Nachricht nicht verschicken"});

        } catch (err) {

            return res.status(500).json({"message": "Internal Servere error"});
        }


        console.log("CurrentUserId = ChatPartner");

    }



})




app.post("/load-chat", async (req, res) => {

    const currentUserId = req.body["currentUserId"];
    const currentChatPartnerId = req.body["currentChatPartnerId"];


    try {
        const result = await db.query("SELECT * FROM chats WHERE current_user_id = $1 AND chat_partner = $2", [currentUserId, currentChatPartnerId]);

        if (result.rows.length > 0){

            const loadedChat = result.rows;

            //console.log("Loaded Chat: ", loadedChat);

            //console.log("LoadedChat Erste NAchricht MessageTime: ", result.rows[0]["message_time"]);
            return res.status(200).json({loadedChat});

        }

        return res.status(404).json({"message": "Could not find any chats with this user"});

    } catch (err) {
        return res.status(500).json({"message": "There is a Internal Server error"});

    }
})

app.post("/get-my-user", async (req, res) => {

    const currentUserId = req.body["currentUserId"];


    try {
        const result = await db.query("SELECT * FROM users WHERE id=$1", [currentUserId]);

        const myUserData = result.rows;

        if (result.rows.length === 1){
            //console.log("MyUserData: ", myUserData);
            return res.status(200).json(myUserData);
        }

        return res.status(404).json({"message": "Kein Nutzer gefunden. Nutzer ist wahrscheinlich noch nicht angemeldet"});

    } catch (err) {
        return res.status(500).json({"message": "Internal Server error"});
    }
})

app.patch("/edit-user", async (req, res) => {

    //console.log("ReqBody EditData: ", req.body["editData"]);

    const editData = req.body["editData"];
    const currentUserId = req.body["currentUserId"];

    console.log("EditData in edit-user: ", editData);
    console.log("Current User Id in edit-user: ", currentUserId);

    //console.log("EditDataÚsername: ", editData['username']);

    if (editData["username"]){
        try {

            console.log("Username wird bearbeitet");
            const response = await db.query("UPDATE users SET username = $1 WHERE id = $2", [editData['username'], currentUserId]);

            if (response.ok){
                console.log("Username erfolgreich bearbeitet");
                return res.status(200);
            }

            return res.status(404);

        } catch (err) {
            return res.status(500).json({"message": "Internal Server Error"});
        }

    } else if (editData["email"]) {
        try {
            console.log("Email wird bearbeitet");

            const response = await db.query("UPDATE users SET email = $1 WHERE id = $2", [editData['email'], currentUserId]);

            if (response.ok){
                console.log("Email erfolgreich bearbeitet");

                return res.status(200);
            }

            return res.status(404);

        } catch (err) {
            return res.status(500).json({"message": "Internal Server Error"});
        }

    } else if (editData["password"]) {
        try {

            console.log("Password wird bearbeitet");

            const response = await db.query("UPDATE users SET password = $1 WHERE id = $2", [editData['password'], currentUserId]);

            if (response.ok){
                console.log("Password erfolgreich bearbeitet");

                return res.status(200);
            }

            return res.status(404);

        } catch (err) {
            return res.status(500).json({"message": "Internal Server Error"});
        }

    } else if (editData["profile_picture"])

        try {
            const response = await db.query("UPDATE users SET profile_picture = $1 WHERE id = $2", [editData['profile_picture'], currentUserId]);

            if (response.ok){
                console.log("ProfilePic erfolgreich bearbeitet");

                return res.status(200);
            }

            return res.status(404);

        } catch (err) {
            return res.status(500).json({"message": "Internal Server Error"});
        }

})



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


