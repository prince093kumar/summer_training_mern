import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SavedRecipes from "./pages/SavedRecipes";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Login from "./components/Login";
import { DarkModeProvider } from "./context/DarkModeContext";
import GroceryList from "./pages/GroceryList";
import SignUp from "./pages/SignUp";
import Protected from "./components/Protected";
import axios from "axios"; 
import Landing from "./pages/Landing";

function App() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchSavedRecipes = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found in localStorage!");
            return; 
        }

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/recipes`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        setSavedRecipes(res.data);
    } catch (err) {
        console.error("Failed to load saved recipes", err);
    }
};


  useEffect(() => {
    const loadRecipes = async () => {
        await fetchSavedRecipes();
        setLoading(false);
    };

    loadRecipes();
}, []);

if (loading) {
    return <div>Loading saved recipes...</div>;
}

 
  const saveRecipes = async (recipe, ingredients) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/recipes/save`,
        { ...recipe, ingredients },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSavedRecipes((prev) => [...prev, res.data.recipe]); 
    } catch (err) {
      console.error("Failed to save recipe", err);
    }
  };

  return (
    <DarkModeProvider>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/home"
            element={
              <Protected>
                <Home saveRecipes={saveRecipes} />
              </Protected>
            }
          />
          <Route
            path="/saved"
            element={
              <Protected>
                <SavedRecipes savedRecipes={savedRecipes} />
              </Protected>
            }
          />
          <Route
            path="/grocery"
            element={
              <Protected>
                <GroceryList savedRecipes={savedRecipes} />
              </Protected>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
        </Routes>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;
