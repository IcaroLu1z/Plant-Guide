"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function CreateProfile() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [plants, setPlants] = useState([""]);
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | ArrayBuffer | null>(null);
    const [message, setMessage] = useState("");

    const handleAddPlant = () => {
        setPlants([...plants, ""]);
    };

    const handlePlantChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newPlants = [...plants];
        newPlants[index] = event.target.value;
        setPlants(newPlants);
    };

    const handleRemovePlant = (index: number) => {
        const newPlants = plants.filter((_, i) => i !== index);
        setPlants(newPlants);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const token = localStorage.getItem('token');  // Replace with the actual method to retrieve the user ID

        if (!token) {
            setMessage("User ID is missing. Please log in again.");
            return;
        }

        let userId;
        try {
            const decodedToken: any = jwtDecode(token); // Use 'any' to bypass TypeScript type checks for simplicity
            userId = decodedToken.user_id; // Adjust based on your token structure
        } catch (error) {
            setMessage("Invalid token. Please log in again.");
            return;
        }

        const form = new FormData();
        form.append('user_id', userId);
        form.append('name', name);
        form.append('email', email);
        form.append('plants', JSON.stringify(plants));
        if (photo) {
            form.append('photo', photo);
        }

        try {
            const response = await fetch('http://localhost:5000/create-profile', {
                method: 'POST',
                body: form,
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Profile created successfully!");
                // Optionally fetch and display the created profile data
                // fetchProfile();
                router.push("/user-perfil");
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.");
        }
    };

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setPhoto(file || null);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-green-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
                    Plant Guide
                </h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                            Nome Completo:
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full text-black px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            placeholder="Digite seu nome completo"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full text-black px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            placeholder="Digite seu email"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="photo" className="block text-gray-700 font-bold mb-2">
                            Foto de Perfil:
                        </label>
                        <input
                            type="file"
                            id="photo"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                        />
                        {photoPreview && (
                            <div className="mt-4">
                                <img
                                    src={photoPreview as string}
                                    alt="Pré-visualização da foto"
                                    className="w-32 h-32 object-cover rounded-full mx-auto"
                                />
                            </div>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">
                            Suas Plantas:
                        </label>
                        {plants.map((plant, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <input
                                    type="text"
                                    value={plant}
                                    onChange={(e) => handlePlantChange(index, e)}
                                    className="w-full text-black px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                                    placeholder={`Planta ${index + 1}`}
                                />
                                {plants.length > 1 && (
                                    <button
                                        type="button"
                                        className="ml-2 text-red-600 hover:underline"
                                        onClick={() => handleRemovePlant(index)}
                                    >
                                        Remover
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 mt-2"
                            onClick={handleAddPlant}
                        >
                            Adicionar Planta
                        </button>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
                        >
                            Salvar Perfil
                        </button>
                    </div>
                    {message && <p className="text-center text-green-600">{message}</p>}
                </form>
            </div>
        </div>
    );
}
