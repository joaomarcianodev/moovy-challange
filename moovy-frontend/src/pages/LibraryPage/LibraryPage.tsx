import React, { useState, useEffect } from "react";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import Header from "../../components/Header/Header";
import { PageWrapper } from "./LibraryPage.styles";
import EmptyState from "../../components/EmptyState/EmptyState";
import MovieCard from "../../components/MovieCard/MovieCard";
import { type Movie } from "../../components/MovieCard/MovieCard.types";
import NotificationBar from "../../components/NotificationBar/NotificationBar";

interface ApiLibraryMovie {
  id: number;
  title: string;
  year: number;
  imdbId: string;
  type: string;
  poster: string;
  rating: string | null;
}

const mapResponseToMovie = (apiMovie: ApiLibraryMovie): Movie => {
  return {
    id: apiMovie.imdbId,
    movieId: apiMovie.id,
    title: apiMovie.title,
    imageUrl: apiMovie.poster,
    rating: apiMovie.rating ?? "0.0",
    isAdded: true,
    year: apiMovie.year,
    type: apiMovie.type,
  };
};

const LibraryPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:3000/movies");

        if (!response.ok) {
          throw new Error("Could not connect to the server.");
        }
        const data: ApiLibraryMovie[] = await response.json();
        const formattedMovies = data.map(mapResponseToMovie);
        setMovies(formattedMovies);
      } catch (err) {
        // Bloco catch simplificado
        if (err instanceof Error) {
          if (err.message === "Failed to fetch") {
            setError(
              "Could not connect to the server. Please check your internet connection or try again later."
            );
          } else {
            setError(err.message);
          }
        } else {
          setError("An unknown error has occurred.");
        }
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (notificationMessage) {
      const timer = setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [notificationMessage]);

  const handleRemoveFromLibrary = async (movieToRemove: Movie) => {
    const databaseId = movieToRemove.movieId;

    if (!databaseId) {
      setError("Unable to remove movie. Try reloading the page.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/movies/${databaseId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove movie from server.");
      }

      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.movieId !== databaseId)
      );

      setNotificationMessage(
        `${movieToRemove.title} deleted from your watchlist.`
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unknown error has occurred.";
      setError(message);
      setNotificationMessage(`Fail: ${message}`);
    }
  };

  const handleCloseNotification = () => {
    setNotificationMessage(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", my: 10 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Typography color="error" align="center" sx={{ my: 10 }}>
          Erro: {error}
        </Typography>
      );
    }

    if (movies.length === 0) {
      return (
        <EmptyState message="It looks like there are no movies in your library! Search for a movie you have watched and add it here!" />
      );
    }

    return (
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          justifyContent: "center",
        }}
      >
        {movies.map((movie) => (
          <MovieCard
            movie={movie}
            key={movie.id}
            onAdd={() => {}}
            onRemove={handleRemoveFromLibrary}
          />
        ))}
      </Box>
    );
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

        <Typography
          variant="h4"
          component="h1"
          sx={{ my: 4, fontWeight: "bold" }}
        >
          My Library
        </Typography>

        {renderContent()}
      </Container>
    </PageWrapper>
  );
};

export default LibraryPage;
