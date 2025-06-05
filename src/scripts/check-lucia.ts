import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function checkLucia() {
  const user = await prisma.user.findFirst();
  if (!user) return console.log("❌ Aucun user trouvé en DB.");

  const session = await auth.createSession(user.id, {
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)
  });

  console.log("✅ Session créée avec Lucia :", session);
}

checkLucia();
