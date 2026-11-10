CREATE TABLE "Pagamentos" (
  "id" TEXT NOT NULL,
  "id_pedido" BIGINT NOT NULL,
  "status" VARCHAR NOT NULL,
  "valor_total" DECIMAL(10,2) NOT NULL,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Pagamentos_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Pagamentos_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "Pedidos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE INDEX "Pagamentos_id_pedido_idx" ON "Pagamentos"("id_pedido");
