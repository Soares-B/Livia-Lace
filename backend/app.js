import "dotenv/config";
import express from "express";
import db from "./database.js";
import bcrypt from "bcrypt"
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "http://localhost:5000",
    "https://livia-lace.vercel.app"
  ]
}));
app.use(express.json());
app.use(express.static('../frontend'));

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "../frontend" });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "online",
    message: "Servidor funcionando",
    timestamp: new Date()
  });
});

app.post("/registerClient", async (req, res) => {

    const {email, username, password} = req.body;

    const hash = await bcrypt.hash(password, 10);

    const result = await db.query(
        `
        INSERT INTO clientes(nome,email,senha)
        VALUES($1,$2,$3)
        RETURNING *
        `,
        [username,email,hash]
    );


    res.json(true);
});

app.post("/loginClient", async (req, res) => {

    const { email, password } = req.body;

    const result = await db.query(
        "SELECT * FROM clientes WHERE email = $1",
        [email]
    );


    const cliente = result.rows[0];


    if (!cliente) {
        return res.status(404).json({
            message: "Usuário não encontrado"
        });
    }

    const senhaCorreta = await bcrypt.compare(
        password,
        cliente.senha
    );


    if (!senhaCorreta) {
        return res.status(401).json({
            message: "Senha incorreta"
        });
    }
    
    const token = jwt.sign(
        { id: cliente.id },
        process.env.JWT_Secret,
        { expiresIn: "7d" }
        )

    res.json({token});
});

db.query("SELECT NOW()", (err, result) => {
    if(err){
        console.log(err);
    } else {
        console.log(result.rows);
    }
});

app.listen(PORT, () => {
    console.log(`Server initialized in port: ${PORT}`);
});