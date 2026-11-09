ALTER TABLE "Pedidos" ADD COLUMN "id_pagamento" TEXT;
CREATE UNIQUE INDEX "Pedidos_id_pagamento_key" ON "Pedidos"("id_pagamento");
