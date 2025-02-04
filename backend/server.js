import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import cors from "cors";
import {configDotenv} from "dotenv";
import jwt from "jsonwebtoken";
import axios from "axios";
import http from 'http';
import { Server } from 'socket.io';
import res from "express/lib/response.js";

/*const apiKey = process.env.API_KEY;
console.log("Api Key: ", apiKey);*/

const app = express();
const port = 3001;

const JWT_SECRET = "geheimSchlüssel";

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "ChatApp",
    password: "stAnWe"/*"stAnWe"*/,
    port: 5432,
});
db.connect();

app.use(cors({
  origin: 'http://localhost:4200', // Erlaubt Anfragen von diesem Origin
  methods: 'GET,POST,PUT,DELETE, PATCH',
  allowedHeaders: 'Content-Type,Authorization'
}));


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
    origin: 'http://localhost:4200',  // Hier kannst du die Domäne, die erlaubt ist, angeben
    methods: ['GET', 'POST']
  }
});
io.on('connection', (socket) => {
    console.log('Ein Benutzer ist verbunden');

    socket.on('chatMessage', async (data) => {
    console.log("Im Socket");

    const { currentUserId, currentChatPartnerId, message, time_of_message } = data;
    console.log(`InSocketChatMessage: CurrentUserId: ${currentUserId}, CurrentChatPartnerId: ${currentChatPartnerId}, Message: ${message}, Time of Message: ${time_of_message}`);

    if (!currentUserId || !currentChatPartnerId || !message) {
        socket.emit('errorMessage', {
            message: 'Entweder Sie sind nicht angemeldet, oder es wurde kein Chatpartner ausgewählt, oder die Chatnachricht ist leer',
            code: 404
        });
        return;
    }

    try {

        try{
            const chatWriterAndChatPartner = await db.query("SELECT current_user_id, chat_partner FROM chats WHERE (current_user_id = $1 OR chat_partner = $2) AND (current_user_id = $3 OR chat_partner = $4)", [currentUserId, currentUserId, currentChatPartnerId, currentChatPartnerId]);
            console.log(`Wer ist currentUserId: ${chatWriterAndChatPartner.rows[0]["current_user_id"]} und wer der Chatpartner: `, chatWriterAndChatPartner.rows[0]["current_user_id"]);


            if (chatWriterAndChatPartner.rows.length > 0) {
            if (currentUserId === chatWriterAndChatPartner.rows[0]["current_user_id"]) {
                console.log("CurrentUserId gleicht CurrentUserId");
                // Nachricht vom Benutzer gesendet
                const response = await db.query(
                    "INSERT INTO chats (chat_partner, current_user_id, my_text_message, message_time) VALUES ($1, $2, $3, $4)",
                    [currentChatPartnerId, currentUserId, message, time_of_message]
                );

                if (response.rowCount > 0) {
                    const dataToSend = {
                        chat_partner: currentChatPartnerId,
                        current_user_id: currentUserId,
                        my_text_message: message,
                        chat_partner_message: null,
                        message_time: time_of_message
                    };

                    io.emit('chatMessage', dataToSend);  // Nachricht an alle senden
                } else {
                    socket.emit('errorMessage', { message: 'Konnte Nachricht nicht verschicken', code: 404 });
                }

            } else if (currentUserId === chatWriterAndChatPartner.rows[0]["chat_partner"]) {

                console.log("currentUserId gleicht der ChatPartnerId");
                // Nachricht vom Chatpartner gesendet
                const response = await db.query(
                    "INSERT INTO chats (chat_partner, current_user_id, chat_partner_message, message_time) VALUES ($1, $2, $3, $4)",
                    [currentUserId, currentChatPartnerId, message, time_of_message]
                );

                if (response.rowCount > 0) {
                    const dataToSend = {
                        chat_partner: currentChatPartnerId,
                        current_user_id: currentUserId,
                        chat_partner_message: message,
                        my_text_message: null,
                        message_time: time_of_message
                    };

                    io.emit('chatMessage', dataToSend);  // Nachricht an alle senden
                } else {
                    socket.emit('errorMessage', { message: 'Konnte Nachricht nicht verschicken', code: 404 });
                }
            }
        } else {
            socket.emit('errorMessage', { message: 'Kein passender Chatpartner oder Benutzer gefunden', code: 404 });
        }


        } catch (err){

            //In diesem Chat gibt es noch keine Nachrichten.

            //console.log("Konnte nicht userId und chat_partnerid finden");
            const response = await db.query(
                    "INSERT INTO chats (chat_partner, current_user_id, my_text_message, message_time) VALUES ($1, $2, $3, $4)",
                    [currentChatPartnerId, currentUserId, message, time_of_message]
                );

            if (response.rowCount > 0) {
                const dataToSend = {
                    chat_partner: currentChatPartnerId,
                    current_user_id: currentUserId,
                    my_text_message: message,
                    chat_partner_message: null,
                    message_time: time_of_message
                };

                io.emit('chatMessage', dataToSend);  // Nachricht an alle senden
            }
        }



    } catch (err) {
        socket.emit('errorMessage', { message: 'Internal Server Error', code: 500 });
    }
});

    socket.on('disconnect', () => {
        console.log('Ein Benutzer hat die Verbindung getrennt');
    });
});


app.set('view engine', 'ejs');
//app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(express.static("public"));

const payload = {
    "username": "",
    "password": ""
};

let currentUserId = null;
let currentUser;
let allTokens = [];

let decodedToken;

const defaultProfilePicture = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";


async function getCurrentUser(req, res, next) {
    try {
        const result = await db.query("SELECT * FROM users WHERE username=$1 OR email=$1", [decodedToken.loginData["usernameOrEmail"]]);
        req.currentUser = result.rows[0];
        req.currentUserId = result.rows[0]["id"];

        console.log("CurrentUserId und CurrentUser in getCurrentUser: ", currentUserId, currentUser);
        const myUserData = result.rows;

        if (result.rows.length === 1){
            //console.log("MyUserData: ", myUserData);
            return next();
        }

        return res.status(404).json({"message": "Kein Nutzer gefunden. Nutzer ist wahrscheinlich noch nicht angemeldet"});

    } catch (err) {
        return res.status(500).json({"message": "Internal Server error"});
    }


}

 function  verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log("Req: ", req.headers["authorization"]);

    decodedToken = jwt.decode(token, JWT_SECRET);


    console.log("DecodedToken: ", decodedToken);



    /*
    const result = await db.query("SELECT * FROM users WHERE (username = $1 OR email = $1) AND password = $2", [decodedToken.loginData["usernameOrEmail"], decodedToken.loginData["password"]]);

    console.log("Result in VerifyToken: ", result);

    currentUserId = result.rows[0]["id"];
    currentUser = result.rows[0];

    console.log("CurrentUserId und CurrentUser in verifyToken: ", currentUserId);

    */
    if (token == null) return res.sendStatus(401); // Kein Token vorhanden

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Token ist ungültig

        req.user = user; // Speichert die dekodierten Benutzerinformationen in der Anfrage
        next();
    });


}


app.post("/get-my-contacts-ids", verifyToken, getCurrentUser, async (req, res) => {

    const currentUserId = req.currentUserId;

    console.log("CurrentUserID in get-my-contacts-ids: ", currentUserId);
    try {
        const result = await db.query("SELECT contacts_of_user FROM users WHERE id=$1", [currentUserId]);

        //console.log("Contacts of user in my-contacts-ids:", result.rows[0]["contacts_of_user"]);

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

    console.log("MyContactsIds in get-my-contacts: ", myContactsIds);

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

    const saltRounds = 10;

    if (registerData.username === '' || registerData.email === '' || registerData.password === '' || registerData.passwordConfirm === ""){
        return res.status(500).json({"message": "Füllen Sie bitte alle Felder aus"})
    }

    //const resultSearchingExistingUsernamesOrEmails = await db.query("SELECT * WHERE username = $1 OR email = $2", [])

    if (registerData.password !== registerData.passwordConfirm){
        return res.status(404).json({"message" : "Passwörter stimmen nicht überein"})
    }

    //Checken ob username oder email bereits exitsiern
    try{
        const resultUsernameEmailDublicity = await db.query("SELECT * FROM users WHERE username = $1 OR email = $2", [registerData.username, registerData.email]);

        if (resultUsernameEmailDublicity.rows.length > 0){
            return res.status(404).json({"message": "Benutzername oder Email existieren bereits. Sie müssen andere Zugangsdaten verwenden"});
        }

    } catch (err){

        return res.status(500).json({"message": "Internal Server Error"});
    }

    try {


        const hashedPassword = await bcrypt.hash(registerData.password, saltRounds);

        const response = await db.query(
            "INSERT INTO users (username, email, password, profile_picture) VALUES ($1, $2, $3, $4)",
            [registerData.username, registerData.email, hashedPassword, defaultProfilePicture]
        );

        // Überprüfen, ob eine Zeile erfolgreich eingefügt wurde
        if (response.rowCount > 0) {
            console.log("Registrierung erfolgreich");
            return res.status(200).json({ "message": "Benutzer erfolgreich registriert" });
        } else {
            console.log("Fehler bei der Registrierung");
            return res.status(400).json({ "message": "Fehler bei der Registrierung" });
        }

    } catch (err) {
        console.error("Datenbankfehler:", err);
        return res.status(500).json({ "message": "Internal Server Error" });
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
    let myContactsIds = req.body["myContactsIds"];
    //console.log("SearchInput: ", searchInput);
    if (myContactsIds === null){
        myContactsIds = [];

    }
    console.log("SearchInput und myContactsIds aus get-users-matching-search: ", searchInput, myContactsIds);

    try {
        const result = await db.query(
          `SELECT * FROM users 
           WHERE username ILIKE $1 
           ${myContactsIds.length > 0 ? `AND id NOT IN (${myContactsIds.map((_, i) => `$${i + 2}`).join(",")})` : ""}`,
          [`%${searchInput}%`, ...myContactsIds]
        );
        //console.log("Result.Rows: ", result.rows);

        if (result.rows.length > 0)
            console.log("Users matching search: ", result.rows);
            return res.status(200).json({"userData": result.rows});

        return res.status(404).json({"message": "Keine Kontakte gefunden"});

    } catch(err){
        console.error("Fehler beim filtern von benutzern: ", err);
        return res.status(500).json({"message": "Internal Server error"});
    }

});



app.post("/login", async (req, res) => {

    const loginData = req.body;

    try{
        //Benutzernamen finden
        const resultUsername = await db.query("SELECT * FROM users WHERE username = $1", [loginData["usernameOrEmail"]]);
        //loginData["password"]

        console.log("Result.Rows von Login: ", resultUsername.rows[0].password);

        const currentUser = resultUsername.rows[0];

        if (resultUsername.rows.length > 0){

            const isMatch = await bcrypt.compare(loginData.password, resultUsername.rows[0].password);

            if (isMatch){

                console.log("Password stimmt überein");
                jwt.sign({ loginData }, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
                if (err) {

                    console.log("Result.Rows größer als 1 aber Fehler beim erstellen des Tokens");


                    res.status(500).json({ message: 'Fehler beim Erstellen des Tokens' });
                } else {
                    // Rückgabe des Tokens als Antwort

                    //console.log("CurrentUserId: ", result.rows[0]["id"]);
                    allTokens.push(token);
                    //console.log("All Tokens after Login: ", allTokens);

                    const currentUserId = resultUsername.rows[0]["id"];

                    //console.log("CurrentUserId: ", currentUserId);

                    return res.status(200).json({token, currentUserId, currentUser});

                }
            });

            }

            else {
                return res.status(401).json({ message: 'Falsches Passwort' });
            }

        }
        else {

            return res.status(404).json({"message" : "Benutzer konnte nicht gefunden werden"});
        }



    } catch (err){
        console.error(err);
        return res.status(500);
    }

    //jwt.sign(payload, jwtSecret, {expiresIn: "1h"});

});


//app.get("/get-user-info", (req, res) => )

/*
app.get("/get-current-own-user-id", async (req, res) => {

    try {
        const result = await db.query("SELECT * FROM users WHERE username = $1 AND password = $2");

    } catch (err) {

    }
    //req.headers["Authorization"]

});*/

app.post("/add-user-for-chat", async (req, res) => {

    const currentUserId = req.body["currentUserId"];
    const contactId = req.body["contactId"];

    console.log("KontaktId: ", contactId);
    console.log("CurrentUserId: ", currentUserId);

    try {
        await db.query(
            "UPDATE users SET contacts_of_user = array_append(contacts_of_user, $1) WHERE id = $2",
            [contactId, currentUserId]
        );

        await db.query(
            "UPDATE users SET contacts_of_user = array_append(contacts_of_user, $1) WHERE id = $2",
            [currentUserId, contactId]
        );

        console.log("User adden hat geklappt");
        return res.status(200).json({"message": "Adding User was successfull"});
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




})




app.post("/load-chat", async (req, res) => {

    const currentUserId = req.body["currentUserId"];
    const currentChatPartnerId = req.body["currentChatPartnerId"];


    try {
        const result = await db.query("SELECT * FROM chats WHERE (current_user_id = $1 AND chat_partner = $2) OR (current_user_id = $3 AND chat_partner = $4)", [currentUserId, currentChatPartnerId, currentChatPartnerId, currentUserId]);

        //if (result.rows.length > 0){

            const loadedChat = result.rows;

            //console.log("Loaded Chat: ", loadedChat);

            //console.log("LoadedChat Erste NAchricht MessageTime: ", result.rows[0]["message_time"]);
            return res.status(200).json({loadedChat});

        //}

        //return res.status(404).json({"message": "Could not find any chats with this user"});

    } catch (err) {
        return res.status(500).json({"message": "There is a Internal Server error"});

    }
})

app.post("/get-my-user", getCurrentUser, async (req, res) => {

    const currentUserId = req.currentUserId;


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


app.delete("/delete-chat/:idOfUserToDelete/:id", async (req, res) => {

    const idOfUserToDelete = req.params.idOfUserToDelete;
    const myUserId = req.params.id;

    console.log(`My User Id ${myUserId}, IdOfUserToDelete: ${idOfUserToDelete} `);

    try {
            const response = await db.query("UPDATE users SET contacts_of_user = array_remove(contacts_of_user, $1) WHERE id = $2", [idOfUserToDelete, myUserId]);
            //console.log("Response.RowCount nach dem löschen des Benutzers: ", response.rowCount);
            if (response.rowCount > 0) {
                try {

                    //const result = await axios.post("http://localhost:3001/get-my-contacts-ids");
                    const contactIdsOfUserRes = await db.query("SELECT contacts_of_user FROM users WHERE id = $1", [myUserId]);

                    //console.log("ContactsIds of User in delete: ", contactIdsOfUserRes.rows[0]["contacts_of_user"]);

                    const contactIdsOfUser = contactIdsOfUserRes.rows[0]["contacts_of_user"];

                    if (contactIdsOfUser !== []) {

                        try {
                            const result = await axios.post("http://localhost:3001/get-my-contacts", {"myContactsIds": contactIdsOfUser});

                            //console.log("Result von getMyContacts in Delete: ", result["data"]);


                            const myContacts = result["data"];

                            console.log("MyContactsInDeleteChat: ", myContacts);

                            return res.status(200).json({myContacts});

                        } catch (err) {

                            console.log("Konnte nicht KOntaktdaten in delete-chat laden.")
                            return res.status(500).json({"message": "Internal Server Error"});
                        }

                    }
                    const contactsOfUserData = result.rows;

                    console.log("Contacts of user in delete-chat: ", contactsOfUserData);


                    //Meine Kontakte mittels der Api finden


                } catch(err){

                    console.log("Fehler beim laden der Kontaktlistenids");

                    return res.status(500).json({"message": "Internal Server Error"});
                }

        }

    } catch (err){

    }

})



app.post("/get-user-when-you-have-username-and-password", verifyToken, async (req, res) => {

    //const loginData = req.body["loginData"];

    console.log("ReqBody von get-user-when-you-have-username-and-password: ");

    let authHeader = req.headers['authorization'];

    let token = authHeader.split(' ')[1];


    const decodedToken = jwt.decode(token);

    //return res.status(200).json({"currentUser": decodedToken});


    console.log("Decoded Token: ", decodedToken);

    const loginData = decodedToken.loginData;

    //console.log("loginData in get-user-when-you-have-username-and-password: ", loginData);
    //console.log("ReqBody von get-user-when-you-have-username-and-password: ", req.body);


    try {
        const result = await db.query("SELECT * FROM users WHERE (username = $1 OR email = $1) AND password = $2", [loginData["usernameOrEmail"], loginData["password"]]);

        if (result.rowCount > 0) {

            console.log("Current user aus get-user-when-you-have-username-and-password: ", result.rows );

            return res.status(200).json({"currentUser": result.rows});
        }

        console.log("Current user aus get-user-when-you-have-username-and-password konnte nicht gefunden werden");

        return res.status(404).json({"message": "User coudld not be found"});

    } catch (err) {
        return res.status(500).json({"messsage": "Internal Server error"});
    }

})


server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


