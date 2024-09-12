"use client";

import React, { useState } from "react";
import axios from "axios";

export default function MainPage() {
  const [activeTab, setActiveTab] = useState("search");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [userPlants, setUserPlants] = useState([]);


  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/plants/search?name=${searchTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Erro ao buscar plantas:", error);
    }
  };


  {/*const addToFavorites = (plant: any) => {
    setFavorites([...favorites, plant]);
  };*/}

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
              <div className="flex justify-center items-center">
                <button
                  onClick={handleSearch}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg mt-2 w-1/2"
                >
                  Buscar
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {searchResults.map((plant, index) => (
                <div
                  key={index}
                  className="border p-4 rounded-lg shadow-sm bg-white"
                >
                  <h3 className="text-lg font-bold text-green-600">
                    {/*plant.common_name*/}
                  </h3>
                  <p>{/*plant.scientific_name*/}</p>
                  <button
                    /*onClick={() => addToFavorites(plant)}*/
                    className="bg-yellow-500 text-white px-2 py-1 rounded mt-2"
                  >
                    Adicionar aos Favoritos
                  </button>
                </div>
              ))}
            </div>
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
                      {/*plant.common_name*/}Planta 1
                    </h3>
                    <p>{/*plant.scientific_name*/}Planta 1</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-black">Nenhuma planta favorita ainda.</p>
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
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
