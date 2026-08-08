import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();

  const [favorites, setFavorites] = useState([]);

  // Create a unique storage key for every user
  const getFavoritesKey = () => {
    if (!user) return null;

    return `favorites_${user._id || user.id || user.email}`;
  };

  // Load favorites whenever the logged-in user changes
  useEffect(() => {
    if (!user) {
      // Important: logout par favorites screen empty ho jayegi
      setFavorites([]);
      return;
    }

    const key = getFavoritesKey();
    const storedFavorites = localStorage.getItem(key);

    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error("Error loading favorites:", error);
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }
  }, [user]);

  // Save favorites whenever they change
  useEffect(() => {
    if (!user) return;

    const key = getFavoritesKey();

    if (key) {
      localStorage.setItem(key, JSON.stringify(favorites));
    }
  }, [favorites, user]);

  // Add / Remove favorite
  const toggleFavorite = (product) => {
    if (!user) {
      return false;
    }

    setFavorites((prevFavorites) => {
      const alreadyFavorite = prevFavorites.some(
        (item) => item._id === product._id
      );

      if (alreadyFavorite) {
        return prevFavorites.filter(
          (item) => item._id !== product._id
        );
      }

      return [...prevFavorites, product];
    });

    return true;
  };

  // Check whether a product is already favorite
  const isFavorite = (productId) => {
    return favorites.some(
      (item) => item._id === productId
    );
  };

  // Remove a specific favorite
  const removeFavorite = (productId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter(
        (item) => item._id !== productId
      )
    );
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        removeFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () =>
  useContext(FavoritesContext);