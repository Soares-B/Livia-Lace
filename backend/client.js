import express from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import db from "./database.js";

const router = express.Router();

router.post("/registerClient", async (req, res) => {

    const {email, username, password} = req.body;

    const hash = await bcrypt.hash(password, 10);

    try {
        await db.query("/BEGIN");

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

        await db.query("/COMMIT");

        return res.status(201).json({message: 'Cadastro concluido com sucesso!'});
    }catch(err){
        await db.query("/ROLLBACK");

        console.error(err);

        return res.status(500).json({
            message: "Erro ao cadastrar cliente"
        });
    }
});

router.post("/loginClient", async (req, res) => {

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

router.post("/getClientInfo", async (req, res) =>{
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

router.post("/clientInfoModify", async (req, res) =>{
    
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
                await db.query("/ROLLBACK");
                
                return res.status(400).json({
                    message: "CEP não encontrado."
                });
            }

            await db.query("/BEGIN");

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

            await db.query("/COMMIT");

            return res.status(201).json({message: 'Cadastro de endereço concluido com sucesso!'});
        }catch(err){
            await db.query("/ROLLBACK");

            console.log(err);

            return res.status(500).json({
                message: "Erro ao cadastrar o endereço do cliente"
                });
        }
    }else{
        try{
            await db.query("/BEGIN");

            const result = await db.query(
                `UPDATE "Enderecos"
                SET cpf = $1
                WHERE id_client = $2
                `,
                [cpf, IDCliente]
            );

            await db.query("/COMMIT");

            return res.status(201).json({
                message: "Cadastro de CPF concluido!"
            });

        }catch(err){
            await db.query("/ROLLBACK");

            console.log(err);

            return res.status(500).json({
                message: "Erro ao cadastrar o CPF do cliente"
            });
        };
    };
});

export default router;