'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateUser() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const backToLogin = () => {
        router.push("/");
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                // Redirect to login page after successful signup
                router.push("/");
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-green-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
                    Plant Guide
                </h1>
                <form onSubmit={handleSignup}>
                    <div className="mb-4">
                        <label
                            htmlFor="name"
                            className="block text-gray-700 font-bold mb-2"
                        >
                            Nome Completo:
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="w-full text-black px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            placeholder="Digite seu nome completo"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-gray-700 font-bold mb-2"
                        >
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full text-black px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            placeholder="Digite seu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-gray-700 font-bold mb-2"
                        >
                            Senha:
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full text-black px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="confirm-password"
                            className="block text-gray-700 font-bold mb-2"
                        >
                            Confirmar Senha:
                        </label>
                        <input
                            type="password"
                            id="confirm-password"
                            className="w-full text-black px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            placeholder="Confirme sua senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
                        >
                            Cadastrar
                        </button>
                    </div>
                    {message && (
                        <div className="text-red-500 text-center mt-4">
                            {message}
                        </div>
                    )}
                    <div className="text-center">
                        <button
                            type="button"
                            className="text-sm text-green-600 hover:underline"
                            onClick={backToLogin}
                        >
                            Já tenho uma conta. Entrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
