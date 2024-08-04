import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
//import Users from "./models/UserModel.js";
import UserRouts from "./routers/UserRoute.js";
import AuthRouts from "./routers/AuthRoute.js";
dotenv.config();

const app = express();
const sessionStore =  SequelizeStore(session.Store);
const store = new sessionStore({
    db: db
    });

    try {
        await db.authenticate();
        console.log("Connection has been established successfully.");
        // await Users.sync();
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Gunakan secure cookie hanya dalam produksi
        httpOnly: true
    }
    }));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
    }));

app.use(express.json());
app.use(UserRouts);
app.use(AuthRouts);

//store.sync();

app.listen(process.env.APP_PORT, () => {
    console.log("Server is running on port 3000");
    });