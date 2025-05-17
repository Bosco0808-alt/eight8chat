import { auth } from "@/lib/auth";
import ColorThemeToggler from "./ColorThemeToggler";
import prisma from "@/lib/prisma";

export default async function ColorThemeTogglerWrapper() {
  const session = await auth();
  if (!session) {
    return <ColorThemeToggler preferUseDarkMode={null} userId={null} />;
  }
  const currentUser = await prisma.users.findUnique({
    where: {
      id: Number(session?.user?.id),
    },
  });
  if (!currentUser?.preferedColorMode) {
    return (
      <ColorThemeToggler
        preferUseDarkMode={null}
        userId={currentUser?.id ?? null}
      />
    );
  }
  const { preferedColorMode, id } = currentUser;
  if (preferedColorMode === "light") {
    return <ColorThemeToggler preferUseDarkMode={false} userId={id} />;
  }
  return <ColorThemeToggler preferUseDarkMode={true} userId={id} />;
}
