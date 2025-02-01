
import { redirect } from "next/navigation";
import { prismadb } from "@/lib/db";
import { auth } from "@/auth";
import { QRCodeView } from "./components/qr-code-view";

async function getUser(userId: string) {
  const user = await prismadb.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      qrCode: true,
    },
  });
  return user;
}

export default async function QRCodePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await getUser(session.user.id);
  if (!user) redirect("/login");

  return (
    <div className="container max-w-5xl py-8">
      <QRCodeView user={user} />
    </div>
  );
}