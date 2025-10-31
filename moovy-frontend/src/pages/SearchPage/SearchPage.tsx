import React, { useState, useEffect } from "react";
import { Container, Box, CircularProgress, Typography } from "@mui/material";
import Header from "../../components/Header/Header";
import NotificationBar from "../../components/NotificationBar/NotificationBar";
import SearchBar from "../../components/SearchBar/SearchBar";
import MovieCard from "../../components/MovieCard/MovieCard";
import { PageWrapper } from "./SearchPage.styles";
import { type Movie } from "../../components/MovieCard/MovieCard.types";
import { useDebounce } from "../../hooks/useDebounce";

interface ApiMovie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

interface ApiResponse {
  Search?: ApiMovie[];
  Response: "True" | "False";
  Error?: string;
  totalResults?: string;
}

const mapApiToMovie = (apiMovie: ApiMovie): Movie => {
  return {
    id: apiMovie.imdbID,
    title: apiMovie.Title,
    imageUrl: apiMovie.Poster,
    rating: Math.random() * 4 + 6,
    isAdded: false,
  };
};

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(
    null
  );

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (!debouncedSearchTerm) {
      setMovies([]);
      setInfoMessage(null);
      return;
    }

    const fetchMovies = async () => {
      setIsLoading(true);
      setError(null);
      setInfoMessage(null);

      try {
        const response = await fetch(
          `http://localhost:3000/api/${debouncedSearchTerm}`
        );

        if (!response.ok) {
          throw new Error("Could not connect to the server.");
        }

        const data: ApiResponse = await response.json();

        if (data.Response === "True" && data.Search && data.Search.length > 0) {
          console.log(data);
          //Tudo ok, mostrar filmes
          setMovies(data.Search.map(mapApiToMovie));
        } else if (data.Response === "False") {
          //Erro, não mostrar filmes
          setMovies([]);

          if (data.Error === "Movie not found!") {
            setInfoMessage(`No movies found for "${debouncedSearchTerm}".`);
          } else if (data.Error === "Too many results.") {
            setInfoMessage(
              "Your search is too broad. Please be more specific."
            );
          } else {
            throw new Error(data.Error);
          }
        } else {
          setMovies([]);
          setInfoMessage(`An unknown error has occurred.`);
        }
      } catch (err) {
        //Entra no catch quando há falha com a API
        //Erro padrão genérico
        let userFriendlyMessage = "An unknown error has occurred.";

        if (err instanceof Error) {
          if (err.message === "Failed to fetch") {
            // Este é o erro de API fora do ar ou sem internet
            userFriendlyMessage =
              "Could not connect to the server. Please check your internet connection or try again later.";
          } else {
            // Outros erros que podem ter vindo (ex: "Invalid API key")
            userFriendlyMessage = err.message;
          }
        }

        setError(userFriendlyMessage);
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [debouncedSearchTerm]);

  const handleAddToLibrary = (movieToAdd: Movie) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === movieToAdd.id ? { ...movie, isAdded: true } : movie
      )
    );
    setNotificationMessage(`${movieToAdd.title} added to your Library`);
  };

  const handleRemoveFromLibrary = (movieToRemove: Movie) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === movieToRemove.id ? { ...movie, isAdded: false } : movie
      )
    );
  };

  const handleCloseNotification = () => {
    setNotificationMessage(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Typography color="error" align="center" sx={{ my: 4 }}>
          Erro: {error}
        </Typography>
      );
    }

    if (infoMessage) {
      return (
        <Typography color="text.secondary" align="center" sx={{ my: 4 }}>
          {infoMessage}
        </Typography>
      );
    }

    if (movies.length > 0) {
      return (
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            justifyContent: "center",
          }}
        >
          {movies.map((movie) => (
            <MovieCard
              movie={movie}
              key={movie.id}
              onAdd={handleAddToLibrary}
              onRemove={handleRemoveFromLibrary}
            />
          ))}
        </Box>
      );
    }

    return null;
  };

  return (
    <PageWrapper>
      <Header />
      <Container maxWidth="lg">
        {notificationMessage && (
          <NotificationBar
            message={notificationMessage}
            onClose={handleCloseNotification}
          />
        )}

        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        {renderContent()}
      </Container>
    </PageWrapper>
  );
};

export default SearchPage;
