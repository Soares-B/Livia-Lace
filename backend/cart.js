import express from "express";
import db from "./database.js";

const router = express.Router();

router.post("/getCart", async (req, res) =>{
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

router.post("/AddtoCart", async (req, res) =>{
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

router.post("/inserttoCart", async (req, res) => {
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

export default router;