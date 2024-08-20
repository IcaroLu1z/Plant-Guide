"use client";

import React, { useState } from "react";

export default function CreateProfile() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [plants, setPlants] = useState([""]);
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    const handleAddPlant = () => {
    setPlants([...plants, ""]);
    };

    const handlePlantChange = (index: any, event: any) => {
    const newPlants = [...plants];
    newPlants[index] = event.target.value;
    setPlants(newPlants);
    };

    const handleRemovePlant = (index: any) => {
    const newPlants = plants.filter((_, i) => i !== index);
    setPlants(newPlants);
    };

    const handleSubmit = (e: any) => {
    e.preventDefault();
    // Lógica para salvar o perfil e plantas no backend
    alert("Perfil e plantas cadastrados com sucesso!");
    };
  const handlePhotoChange = (event: any) => {
    const file = event.target.files[0];
    setPhoto(file);
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
              <label
                htmlFor="name"
                className="block text-gray-700 font-bold mb-2"
              >
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
              <label
                htmlFor="email"
                className="block text-gray-700 font-bold mb-2"
              >
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
              <label
                htmlFor="photo"
                className="block text-gray-700 font-bold mb-2"
              >
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
                    src={photoPreview}
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
          </form>
        </div>
      </div>
    );
}
