import { cache } from "react";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

const getClient = cache(async () => {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const client = await prisma.clientes.findUnique({
    where: {
      id: session.id_client,
    },
  });

  if (!client) {
    return null;
  }

  return client;
});

export default getClient;
