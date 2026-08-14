import express from "express";
import db from "./database.js";

const router = express.Router();

import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN });

router.post('/checkout', async (req, res) =>{
    const { IDCliente } = req.body;

    const result = await db.query(
        `SELECT
            jsonb_agg(
                jsonb_build_object(
                    'nome', a.nome,
                    'valor', a.valor,
                    'quantidade', (p.item->>'quantidade')::integer
                )
            ) AS produtos
        FROM "Carrinho" b
        CROSS JOIN LATERAL jsonb_array_elements(b.produtos) AS p(item)
        JOIN "Produtos" a
            ON a.product_id = (p.item->>'produto')::integer
        `
    )

    const data = result.rows[0];

    const products = data.produtos;

    const preferenceClient = new Preference(client);

    const items = products.map(produto => ({
    title: produto.nome,
    quantity: produto.quantidade,
    unit_price: produto.valor
    }));

    const preference = await preferenceClient.create({
    body: {
        items
    }
    });

    console.log(preference);
});

export default router;