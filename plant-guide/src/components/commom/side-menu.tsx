"use client";

import { Home, User, LogOut, MessageSquareText } from "lucide-react"; 
import Link from "next/link"; 
import toast from "react-hot-toast"; 
import { signOut } from "next-auth/react";

export default function SideMenu() {
  // Função de exemplo para exibir uma notificação de funcionalidade não implementada
  const handleClick = () => {
    toast.error("Essa funcionalidade ainda não foi implementada.");
  };

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      toast.error("Erro ao fazer logout.");
    }
  };

  return (
    <nav className="flex flex-col bg-green-700 text-white w-56 min-h-screen">
      <ul className="flex flex-col items-start justify-center flex-grow mx-auto">
        <li className="flex items-center py-2 px-12 w-full hover:bg-green-600 hover:rounded-lg">
          <Home className="mr-2" />
          <Link href="/main-page">
            <span>Início</span>
          </Link>
        </li>
        <li className="flex items-center py-2 px-12 w-full hover:bg-green-600 hover:rounded-lg">
          <User className="mr-2" />
          <Link href="/user">
            <span>Perfil</span>
          </Link>
        </li>
        <li className="flex items-center py-2 px-12 w-full hover:bg-green-600 hover:rounded-lg">
          <MessageSquareText className="mr-2"/>
          <Link href="/forum">
            <span>Fórum</span>
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="flex items-center py-2 px-12 w-full hover:bg-red-600 hover:rounded-lg mt-auto mb-4"
          >
            <LogOut className="mr-2" />
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
