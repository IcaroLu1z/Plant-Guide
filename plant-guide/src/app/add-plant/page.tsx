"use client";

import React, { useState } from "react";
import axios from "axios";

export default function AddPlant() {
  const [plantName, setPlantName] = useState("");
  const [acquisitionDate, setAcquisitionDate] = useState("");
  const [careDetails, setCareDetails] = useState("");
  const [observations, setObservations] = useState("");
  const [plantPhoto, setPlantPhoto] = useState(null);
  const [plantPhotoPreview, setPlantPhotoPreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Função para gerenciar a alteração da foto da planta
  const handlePlantPhotoChange = (event) => {
    const file = event.target.files[0];
    setPlantPhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPlantPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para cadastrar os detalhes da planta
  const handleAddPlant = async (e) => {
    e.preventDefault();

    // Criar form data para enviar a foto junto com os outros campos
    const formData = new FormData();
    formData.append("name", plantName);
    formData.append("acquisitionDate", acquisitionDate);
    formData.append("careDetails", careDetails);
    formData.append("observations", observations);
    if (plantPhoto) {
      formData.append("photo", plantPhoto);
    }

    try {
      const response = await axios.post("/api/plants", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setSuccessMessage("Planta cadastrada com sucesso!");

        // Limpar os campos do formulário
        setPlantName("");
        setAcquisitionDate("");
        setCareDetails("");
        setObservations("");
        setPlantPhoto(null);
        setPlantPhotoPreview(null);
      }
    } catch (error) {
      console.error("Erro ao cadastrar planta:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
          Cadastrar Planta
        </h1>
        <form onSubmit={handleAddPlant}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nome da Planta
            </label>
            <input
              type="text"
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              placeholder="Digite o nome da planta"
              className="border border-gray-300 p-2 rounded-lg w-full text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Data de Aquisição
            </label>
            <input
              type="date"
              value={acquisitionDate}
              onChange={(e) => setAcquisitionDate(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Cuidados Específicos
            </label>
            <textarea
              value={careDetails}
              onChange={(e) => setCareDetails(e.target.value)}
              placeholder="Detalhe os cuidados necessários"
              className="border border-gray-300 p-2 rounded-lg w-full resize-none text-black"
              rows={2}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Observações
            </label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Adicione quaisquer observações"
              className="border border-gray-300 p-2 rounded-lg w-full resize-none text-black"
              rows={2}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Foto da Planta
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePlantPhotoChange}
              className="border border-gray-300 p-2 rounded-lg w-full"
            />
            {plantPhotoPreview && (
              <div className="mt-4">
                <img
                  src={plantPhotoPreview}
                  alt="Pré-visualização da planta"
                  className="w-32 h-32 object-cover rounded-lg mx-auto"
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-lg w-full"
          >
            Cadastrar Planta
          </button>
        </form>

        {successMessage && (
          <p className="mt-4 text-green-600 text-center">{successMessage}</p>
        )}
      </div>
    </div>
  );
}
