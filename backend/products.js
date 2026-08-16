import express from "express";
import db from "./database.js";

const router = express.Router();

router.post("/getProducts", async (req, res) =>{
    
    let { bicoDePato, xuxinha, tiara, faixaDeBebe, presilha, pulseira, inicial, final} = req.body;
        
        bicoDePato = bicoDePato ? 'Bico de pato' : ''
        xuxinha = xuxinha ? 'Xuxinha' : ''
        tiara = tiara ? 'Tiara' : ''
        faixaDeBebe = faixaDeBebe ? 'Faixa de bebe' : ''
        presilha = presilha ? 'Presilha' : ''
        pulseira = pulseira ? 'Pulseira' : ''

        const result = await db.query(
            `SELECT *
            FROM Produtos
            WHERE tipo IN ($1, $2, $3, $4, $5, $6) AND valor BETWEEN $7 AND $8
            ORDER BY tipo, valor, nome
            `,
            [bicoDePato, xuxinha, tiara, faixaDeBebe, presilha, pulseira, inicial, final]
        )

        const data = result.rows

        return res.json(data)
})

router.post("/get_5Best", async (req, res) =>{

    const { prod1, prod2, prod3, prod4, prod5 } = req.body;

    const result = await db.query(
        `SELECT *
        FROM Produtos
        WHERE product_id IN ($1, $2, $3, $4, $5)`,
        [prod1, prod2, prod3, prod4, prod5]
    )
    
    const data = result.rows

    return res.json(data)
})

router.post("/ProductPage", async (req, res) =>{
    const { produto } = req.body;

    const result = await db.query(
        `SELECT *
        FROM Produtos
        WHERE product_id = $1
        `,
        [produto]
    )

    const data = result.rows

    return res.json(data)
})

router.post("/productInfo", async (req, res) =>{
    const { product_id } = req.body;

    const result = await db.query(
        `SELECT nome, imagem, valor
        FROM Produtos
        WHERE product_id = $1
        `,
        [product_id]
    )

    const data = result.rows[0];

    return res.json(data)
})

export default router;