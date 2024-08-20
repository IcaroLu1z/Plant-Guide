'use client'
import { useRouter } from "next/navigation";
export default function Home() {
 const router = useRouter();  
 const goToForgotPassword = () => {
  router.push("/forgot-password");
 };
 const goToCreateUser = () => {
  router.push("/create-user");
 };
 
 return (
    <div className="flex items-center justify-center min-h-screen bg-green-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-6">Plant Guide</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="w-full text-black px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Digite seu email"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
              Senha:
            </label>
            <input
              type="password"
              id="password"
              className="w-full text-black px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Digite sua senha"
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Entrar
            </button>
          </div>
          <div className="text-center">
            <button
              type="button"
              className="text-sm text-green-600 hover:underline"
              onClick={goToForgotPassword}
            >
              Esqueci minha senha
            </button>
          </div>
          <div className="text-center mt-4">
            <button
              type="button"
              className="text-sm text-green-600 hover:underline"
              onClick={goToCreateUser}
            >
              Cadastrar usuário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  }
