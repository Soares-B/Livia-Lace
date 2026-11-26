-- O formulário de endereço gravava o telefone na coluna "numero" (número da casa).
-- Agora o telefone tem coluna própria e "numero" guarda o número da casa de verdade.
-- Idempotente: pode ser aplicada depois do mesmo SQL ter sido rodado manualmente.

ALTER TABLE "Enderecos" ADD COLUMN IF NOT EXISTS "telefone" VARCHAR;
ALTER TABLE "Pedidos" ADD COLUMN IF NOT EXISTS "endereco_telefone" VARCHAR;

-- O que estava em "numero" é, na prática, o telefone. O número real da casa dos cadastros e
-- pedidos antigos não existe em lugar nenhum e fica vazio.
UPDATE "Enderecos"
SET "telefone" = "numero", "numero" = NULL
WHERE "telefone" IS NULL AND "numero" IS NOT NULL;

UPDATE "Pedidos"
SET "endereco_telefone" = "endereco_numero", "endereco_numero" = NULL
WHERE "endereco_telefone" IS NULL AND "endereco_numero" IS NOT NULL;
