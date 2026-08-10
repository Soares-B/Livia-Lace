import "dotenv/config";
import express from "express";
import db from "./database.js";
import bcrypt from "bcrypt"
import cors from "cors";
import jwt from "jsonwebtoken";
import axios from "axios";

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

app.post("/api/registerClient", async (req, res) => {

    const {email, username, password} = req.body;

    const hash = await bcrypt.hash(password, 10);

    try {
        await db.query("BEGIN");

        const result = await db.query(
            `
            INSERT INTO "Clientes" (nome, email, senha, is_admin)
            VALUES ($1, $2, $3, $4);
            `,
            [username, email, hash, false]
        );

        const dados = await db.query(
            `SELECT id
            FROM "Clientes"
            WHERE email = $1
            `,
            [email]
        )

        const address = await db.query(
            `INSERT INTO "Enderecos" (id_client) 
            VALUES ($1)
            `,
            [dados.rows[0].id]
        );

        const cart = await db.query(
            `INSERT INTO "Carrinho" (id_client) 
            VALUES ($1)
            `,
            [dados.rows[0].id]
        )

        await db.query("COMMIT");

        return res.status(201).json({message: 'Cadastro concluido com sucesso!'});
    }catch(err){
        await db.query("ROLLBACK");

        console.error(err);

        return res.status(500).json({
            message: "Erro ao cadastrar cliente"
        });
    }
});

app.post("/api/loginClient", async (req, res) => {

    const { email, password } = req.body;

    const result = await db.query(
        `SELECT *
        FROM "Clientes"
        CROSS JOIN "Enderecos"
        CROSS JOIN "Carrinho"
        WHERE email = $1`,
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
        { id: cliente.id,
        name: cliente.nome,
        email: cliente.email,
        admin: cliente.is_admin  
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
        )

    res.json({token});
});

app.post("/api/getClientInfo", async (req, res) =>{
    const { IDCliente } = req.body;

    const result = await db.query(
            `SELECT *
            FROM "Enderecos"
            WHERE id_client = $1
            `,
            [IDCliente]
            )

    const data = result.rows[0];

    return res.json(data);
})

app.post("/api/clientInfoModify", async (req, res) =>{
    
    const { IDCliente, state, city, road, reference, number, cep, cpf } = req.body;

    if (!cpf){
        try {
        
            const cepLimpo = cep.replace(/\D/g, "");

            if (!/^\d{8}$/.test(cepLimpo)) {
                return res.status(400).json({
                    message: "CEP inválido."
                });
            }

            const resposta = await fetch(
                `https://viacep.com.br/ws/${cepLimpo}/json/`
            );

            const endereco = await resposta.json();

            if (endereco.erro) {
                await db.query("ROLLBACK");
                
                return res.status(400).json({
                    message: "CEP não encontrado."
                });
            }

            await db.query("BEGIN");

            await db.query(
                `UPDATE "Enderecos"
                SET estado = $2,
                    cidade = $3,
                    rua = $4,
                    referencia = $5,
                    telefone = $6,
                    cep = $7
                WHERE id_client = $1`,
                [IDCliente, state, city, road, reference, number, cepLimpo]
            );

            await db.query("COMMIT");

            return res.status(201).json({message: 'Cadastro de endereço concluido com sucesso!'});
        }catch(err){
            await db.query("ROLLBACK");

            console.log(err);

            return res.status(500).json({
                message: "Erro ao cadastrar o endereço do cliente"
                });
        }
    }else{
        try{
            await db.query("BEGIN");

            const result = await db.query(
                `UPDATE "Enderecos"
                SET cpf = $1
                WHERE id_client = $2
                `,
                [cpf, IDCliente]
            );

            await db.query("COMMIT");

            return res.status(201).json({
                message: "Cadastro de CPF concluido!"
            });

        }catch(err){
            await db.query("ROLLBACK");

            console.log(err);

            return res.status(500).json({
                message: "Erro ao cadastrar o CPF do cliente"
            });
        };
    };
});

app.post("/api/getProducts", async (req, res) =>{
    
    let { bicoDePato, xuxinha, tiara, faixaDeBebe, presilha, pulseira, inicial, final} = req.body;
        
        bicoDePato = bicoDePato ? 'Bico de pato' : ''
        xuxinha = xuxinha ? 'Xuxinha' : ''
        tiara = tiara ? 'Tiara' : ''
        faixaDeBebe = faixaDeBebe ? 'Faixa de bebe' : ''
        presilha = presilha ? 'Presilha' : ''
        pulseira = pulseira ? 'Pulseira' : ''

        const result = await db.query(
            `SELECT *
            FROM "Produtos"
            WHERE tipo IN ($1, $2, $3, $4, $5, $6) AND valor BETWEEN $7 AND $8
            ORDER BY tipo, valor, nome
            `,
            [bicoDePato, xuxinha, tiara, faixaDeBebe, presilha, pulseira, inicial, final]
        )

        const data = result.rows

        return res.json(data)
})

app.post("/api/get_5Best", async (req, res) =>{

    const { prod1, prod2, prod3, prod4, prod5 } = req.body;

    const result = await db.query(
        `SELECT *
        FROM "Produtos"
        WHERE product_id IN ($1, $2, $3, $4, $5)`,
        [prod1, prod2, prod3, prod4, prod5]
    )
    
    const data = result.rows

    return res.json(data)
})

app.post("/api/ProductPage", async (req, res) =>{
    const { produto } = req.body;

    const result = await db.query(
        `SELECT *
        FROM "Produtos"
        WHERE product_id = $1
        `,
        [produto]
    )

    const data = result.rows

    return res.json(data)
})

app.post("/api/productInfo", async (req, res) =>{
    const { product_id } = req.body;

    const result = await db.query(
        `SELECT nome, imagem, valor
        FROM "Produtos"
        WHERE product_id = $1
        `,
        [product_id]
    )

    const data = result.rows[0];

    return res.json(data)
})

app.post("/api/getCart", async (req, res) =>{
    const { IDCliente } = req.body;

    const result = await db.query(
        `SELECT produtos
        FROM "Carrinho"
        WHERE id_client = $1
        `,
        [IDCliente]
    )

    const data = result.rows[0];

    return res.json(data)
})

app.post("/api/AddtoCart", async (req, res) =>{
    const { IDCliente, purchase } = req.body;

    const result = await db.query(
        `UPDATE "Carrinho"
        SET produtos = COALESCE(produtos, '[]'::jsonb) || $1::jsonb
        WHERE id_client = $2
        `,
        [JSON.stringify([purchase]), IDCliente]
    )

    return res.json({message: 'chegou'})
})

app.post("/api/inserttoCart", async (req, res) => {
    try {
        const { IDCliente, carrinhoCompleto, valorTotal } = req.body;

        const result = await db.query(
            `UPDATE "Carrinho"
             SET produtos = $1::jsonb,
             valor_total = $2
             WHERE id_client = $3
             RETURNING *`,
            [
                JSON.stringify(carrinhoCompleto),
                valorTotal,
                IDCliente
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Carrinho não encontrado"
            });
        }

        return res.json(result.rows[0]);

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Erro ao atualizar carrinho"
        });
    }
});

app.get("/melhor-envio/auth", (req, res) => {
    const params = new URLSearchParams({
        client_id: process.env.MELHOR_ENVIO_CLIENTID,
        redirect_uri: process.env.MELHOR_ENVIO_REDIRECT_URI,
        response_type: "code",
        scope: "shipping-calculate",
    });

    const url = `https://sandbox.melhorenvio.com.br/oauth/authorize?${params.toString()}`;

    res.redirect(url);
});

app.get("/melhor-envio/callback", async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({
            message: "Código de autorização não recebido."
        });
    }

    try {
        const response = await axios.post(
            "https://sandbox.melhorenvio.com.br/oauth/token",
            {
                grant_type: "authorization_code",
                client_id: process.env.MELHOR_ENVIO_CLIENTID,
                client_secret: process.env.MELHOR_ENVIO_SECRET,
                redirect_uri: process.env.MELHOR_ENVIO_REDIRECT_URI,
                code
            },
            {
                headers: {
                    "User-Agent": "Livia Lace"
                }
            }
        );

        console.log("Token recebido!");

        res.json({
            message: "Autorização concluída com sucesso!"
        });

        console.log(response.data);

    } catch (err) {
        console.error(
            err.response?.data || err.message
        );

        res.status(500).json({
            message: "Erro ao obter token do Melhor Envio",
            error: err.response?.data || err.message
        });
    }
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