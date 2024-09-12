// client-layout.tsx
"use client";

import SideMenu from "@/components/commom/side-menu"; // Ajuste o caminho conforme necessário
import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Definindo as rotas que não devem exibir o SideMenu
  const excludedPaths = ["/","/create-user", "/forgot-password"];

  // Verifica se a rota atual está entre as que devem ser excluídas
  const shouldHideSideMenu = excludedPaths.includes(pathname);

  if (!shouldHideSideMenu) {
    return (
      <div className="h-full flex bg-green-100">
        <SideMenu />
        <main className="flex-grow">{children}</main>
      </div>
    );
  }

  return <>{children}</>; // Renderiza apenas o conteúdo quando o SideMenu não deve ser exibido
}
