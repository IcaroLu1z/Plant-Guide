"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface Plant {
  id: string;
  common_name: string;
  scientific_name: string[];
}

interface ProfileData {
  name: string;
  email: string;
  plants: Plant[];
  photo?: string;
}

interface MyPlant{
  name: string;
  date: string;
  care: string;
  obs: string;
  photo?: string;
}

export default function UserProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [newPlant, setNewPlant] = useState<Plant>({ id: "", common_name: "", scientific_name: [] });
  const [favorites, setFavorites] = useState<Plant[]>([]);
  const [myPlants, setMyPlants] = useState<MyPlant[]>([])
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const decoded: any = jwtDecode(token);
        const userId = decoded.user_id;

        // Fetch user profile data
        const profileResponse = await axios.get(`http://localhost:5000/user-profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(profileResponse.data);

        // Fetch favorite plants
        const favoritesResponse = await axios.get(`http://localhost:5000/get-favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const myPlants = await axios.get(`http://localhost:5000/get-plants`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFavorites(favoritesResponse.data.favorites || []);
        setMyPlants(myPlants.data.plants || []);
      } catch (err) {
        setError("Error fetching profile data");
        console.error(err);
      }
    };

    fetchProfile();
  }, [router]);

  const addPlant = async () => {
    router.push("/add-plant");
  };

  const removeFavoritePlant = async (plantId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/remove-favorite",
        { plantId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavorites(favorites.filter((plant) => plant.id !== plantId));
    } catch (err) {
      console.error("Error removing favorite plant:", err);
    }
  };

  const removeMyPlant = async (plantName: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/remove-plant",
        { plantId: plantName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMyPlants(myPlants.filter((plant) => plant.name !== plantName));
    } catch (err) {
      console.error("Error removing my plant:", err);
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-6">User Profile</h1>
      {profile ? (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
          <div className="flex items-center mb-4">
            {profile.photo ? (
              <img
                src={`http://localhost:5000/${profile.photo}`}
                alt="Profile Photo"
                className="w-16 h-16 rounded-full border"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 border"></div>
            )}
            <div className="ml-4">
              <h2 className="text-xl font-bold text-green-600">{profile.name}</h2>
              <p className="text-gray-600">{profile.email}</p>
            </div>
            <div className="ml-auto">
              <button
                onClick={() => router.push("/user")}
                className="bg-green-600 text-white p-2 rounded"
              >
                Edit Profile
              </button>
            </div>
          </div>

          <h2 className="text-xl font-bold text-green-600 mb-4">My Plants</h2>
          {myPlants.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {myPlants.map((plant) => (
                <div key={plant.name} className="border p-4 rounded-lg shadow-sm bg-white flex justify-between">
                  <h3 className="text-lg font-bold text-green-600">{plant.name}</h3>
                  <p className="text-lg font-bold text-green-600">plant.date</p>
                  <p className="text-lg font-bold text-green-600">plant.care</p>
                  <p className="text-lg font-bold text-green-600">plant.obs</p>
                  <button
                    onClick={() => removeMyPlant(plant.name)}
                    className="bg-red-600 text-white p-2 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p >
            </p>
          )}
          <div>
            <button onClick={addPlant} className="ml-2 bg-green-600 text-white p-2 rounded">
              Add Plant
            </button>
          </div>

          <h2 className="text-xl font-bold text-green-600 mb-4 mt-6">Favorite Plants</h2>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {favorites.map((plant) => (
                <div key={plant.id} className="border p-4 rounded-lg shadow-sm bg-white flex justify-between">
                  <h3 className="text-lg font-bold text-green-600">{plant.common_name}</h3>
                  <p className="text-lg font-bold text-green-600">
                    {plant.scientific_name?.join(", ")}
                  </p>
                  <button
                    onClick={() => removeFavoritePlant(plant.id)}
                    className="bg-red-600 text-white p-2 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className = "bg-red-600 text-white p-2 rounded">
              No favorite plants added yet.
            </p>
          )}
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}
