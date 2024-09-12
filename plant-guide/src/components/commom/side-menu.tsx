"use client";

import { Home, User } from "lucide-react"; // Importação dos ícones necessários
import Link from "next/link"; // Componente Next.js para links
import toast from "react-hot-toast"; // Biblioteca para notificações

export default function SideMenu() {
  const handleClick = () => {
    toast.error("Essa funcionalidade ainda não foi implementada.");
  };

  return (
    <nav className="flex flex-col bg-green-700 text-white w-56 min-h-screen">
      {/* Alinhamento centralizado das opções */}
      <ul className="flex flex-col items-start justify-center flex-grow mx-auto space-y-4">
        {/* Link para a página inicial */}
        <li className="flex items-center py-2 px-12 w-full hover:bg-green-600 hover:rounded-lg">
          <Home className="mr-2" />
          <Link href="/main-page">
            <span>Início</span>
          </Link>
        </li>
        {/* Link para o perfil do usuário */}
        <li className="flex items-center py-2 px-12 w-full hover:bg-green-600 hover:rounded-lg">
          <User className="mr-2" />
          <Link href="/user">
            <span>Perfil</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
