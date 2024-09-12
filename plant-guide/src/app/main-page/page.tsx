"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const apiKey = process.env.NEXT_PUBLIC_PERENUAL_API_KEY;

export default function MainPage() {
  const [activeTab, setActiveTab] = useState("search");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [userPlants, setUserPlants] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("jwtToken") || "");

  const handleSearch = async () => {
    const scientificName = searchTerm;  // Use the search term as the scientific name

    try {
      const response = await axios.get(`https://perenual.com/api/species-list`, {
        params: {
          key: apiKey,        // API key
          q: scientificName   // Scientific name query
        }
      });
      console.log("Plantas encontradas:", response.data);
      setSearchResults(response.data.data);
    } catch (error) {
      console.error("Erro ao buscar plantas:", error);
    }
  };

  // Load favorites from the database on component mount
  useEffect(() => {
    if (token) {
      axios.get('/get-favorites', { headers: { Authorization: `Bearer ${token}` } })
        .then(response => {
          setFavorites(response.data.favorites);
        })
        .catch(error => {
          console.error("Erro ao carregar favoritos:", error);
        });
    }
  }, [token]);

  const addToFavorites = (plant) => {
    const token = localStorage.getItem('token');
  
    if (token) {
      axios.post(
        'http://localhost:5000/add-favorite', 
        { plant },  // Send the plant as part of a payload object
        { headers: { Authorization: `Bearer ${token}` } }  // Authorization header
      )
      .then(response => {
        // If the request succeeds, add the plant to the local state
        setFavorites([...favorites, plant]);
      })
      .catch(error => {
        console.error("Erro ao adicionar planta aos favoritos:", error);
      });
    } else {
      console.error("Usuário não autenticado.");
    }
  };

  const PlantsGrid = ({ searchResults }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // Calculate total pages
    const totalPages = Math.ceil(searchResults.length / itemsPerPage);

    // Get the plants to display on the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPlants = searchResults.slice(startIndex, startIndex + itemsPerPage);

    const handleNextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    };

    const handlePreviousPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };

    return (
      <div>
        <div className="grid grid-cols-1 gap-4">
          {currentPlants.map((plant, index) => (
            <div key={index} className="border p-4 rounded-lg shadow-sm bg-white">
              <h3 className="text-lg font-bold text-green-600">
                {plant.common_name}
              </h3>
              <p className="text-lg font-bold text-green-600">
                {plant.scientific_name?.join(", ")}
              </p>
              <button
                onClick={() => addToFavorites(plant)}
                className="bg-yellow-500 text-white px-2 py-1 rounded mt-2"
              >
                Adicionar aos Favoritos
              </button>
            </div>
          ))}
        </div>

        {/* Pagination controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1 ? "bg-gray-400" : "bg-green-600 text-white"
            }`}
          >
            Anterior
          </button>

          <span className="text-gray-700">
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages ? "bg-gray-400" : "bg-green-600 text-white"
            }`}
          >
            Próxima
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "search":
        return (
          <div className="p-4">
            <div className="mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite o nome comum da planta"
                className="border border-gray-300 p-2 rounded-lg w-full text-black"
              />
              <button
                onClick={handleSearch}
                className="bg-green-600 text-white px-4 py-2 rounded-lg mt-2 w-full"
              >
                Buscar
              </button>
            </div>
            <PlantsGrid searchResults={searchResults} />
          </div>  
        );
          
      case "favorites":
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold text-green-600 mb-4">
              Plantas Favoritas
            </h2>
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {favorites.map((plant, index) => (
                  <div
                    key={index}
                    className="border p-4 rounded-lg shadow-sm bg-white"
                  >
                    <h3 className="text-lg font-bold text-green-600">
                      {plant.common_name}
                    </h3>
                    <p className="text-lg font-bold text-green-600">
                      {plant.scientific_name}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-black">Nenhuma planta favorita ainda.</p>
            )}
          </div>
        );
      case "userPlants":
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold text-green-600 mb-4">
              Minhas Plantas
            </h2>
            {userPlants.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {userPlants.map((plant, index) => (
                  <div
                    key={index}
                    className="border p-4 rounded-lg shadow-sm bg-white"
                  >
                    <h3 className="text-lg font-bold text-green-600">
                      {/*plant.name*/}
                    </h3>
                    <p>Data de Aquisição: {/*plant.acquisitionDate*/}</p>
                    <p>Cuidados: {/*plant.careDetails*/}</p>
                    <p>Observações: {/*plant.observations*/}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-black">Você ainda não cadastrou nenhuma planta.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
          Plant Guide
        </h1>
        <div className="flex justify-around mb-6">
          <button
            className={`${
              activeTab === "search" ? "text-green-600" : "text-gray-500"
            } font-bold`}
            onClick={() => setActiveTab("search")}
          >
            Pesquisar Plantas
          </button>
          <button
            className={`${
              activeTab === "favorites" ? "text-green-600" : "text-gray-500"
            } font-bold`}
            onClick={() => setActiveTab("favorites")}
          >
            Favoritas
          </button>
          <button
            className={`${
              activeTab === "userPlants" ? "text-green-600" : "text-gray-500"
            } font-bold`}
            onClick={() => setActiveTab("userPlants")}
          >
            Minhas Plantas
          </button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
