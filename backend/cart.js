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

        const info = result.rows[0];

        const pedidoId = await makeOrder(
            info.id_client,
            info.id,
            Number(info.valor_total)
        );

        return res.json({
            carrinho: info,
            pedidoId: pedidoId
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Erro ao atualizar carrinho"
        });
    }
});


async function makeOrder(IDCliente, IDCarrinho, valor) {

    const result = await db.query(
        `INSERT INTO Pedidos (id_client, id_carrinho, valor_total)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [IDCliente, IDCarrinho, valor]
    );

    return result.rows[0].id;
}

export default router;