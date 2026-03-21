import { PrismaService } from '../prisma/prisma.service';

function generateLogin(): string {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `110${random}`;
}

export async function generateUniqueLogin(
  prisma: PrismaService,
): Promise<string> {
  let login: string;
  let exists = true;

  while (exists) {
    login = generateLogin();

    const user = await prisma.user.findUnique({
      where: { login },
    });

    if (!user) exists = false;
  }

  return login!;
}
