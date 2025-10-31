import React, { useState, useEffect } from "react";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import Header from "../../components/Header/Header";
import { PageWrapper } from "./LibraryPage.styles";
import EmptyState from "../../components/EmptyState/EmptyState";
import MovieCard from "../../components/MovieCard/MovieCard";
import { type Movie } from "../../components/MovieCard/MovieCard.types";

interface ApiLibraryMovie {
  id: number;
  title: string;
  year: number;
  imdbId: string;
  type: string;
  poster: string;
}

interface Response {
  id: number;
  rating: number | null;
  path: string | null;
  movie: ApiLibraryMovie;
}

const mapResponseToMovie = (review: Response): Movie => {
  return {
    id: review.movie.imdbId, // O ID do Card (key) é o imdbId
    reviewId: review.id, // <-- 1. ADICIONE ISTO: O ID da review para o DELETE
    title: review.movie.title,
    imageUrl: review.movie.poster,
    rating: review.rating ?? Math.random() * 4 + 6,
    isAdded: true,
  };
};

const LibraryPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:3000/reviews");

        if (!response.ok) {
          throw new Error("Could not connect to the server.");
        }
        const data: Response[] = await response.json();
        const formattedMovies = data.map(mapResponseToMovie);
        setMovies(formattedMovies);
      } catch (err) {
        let userFriendlyMessage = "An unknown error has occurred.";

        if (err instanceof Error) {
          if (err.message === "Failed to fetch") {
            userFriendlyMessage =
              "Could not connect to the server. Please check your internet connection or try again later.";
          } else {
            userFriendlyMessage = err.message;
          }
        }
        setError(userFriendlyMessage);
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleRemoveFromLibrary = async (movieToRemove: Movie) => {
    // Verifica se temos o ID da review (essencial para o DELETE)
    if (!movieToRemove.reviewId) {
      setError("Unable to remove movie. Try reloading the page.");
      return;
    }

    const reviewId = movieToRemove.reviewId;

    try {
      // Faz a requisição DELETE para a API
      const response = await fetch(
        `http://localhost:3000/reviews/${reviewId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove movie from server.");
      }

      // Se a API removeu com sucesso, atualize o estado da UI
      // Filtrando a lista para remover o filme
      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.reviewId !== reviewId)
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error has occurred."
      );
    }
  };

  const renderContent = () => {
    if (isLoading) {
      // ... (código do loading)
      return (
        <Box sx={{ display: "flex", justifyContent: "center", my: 10 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      // ... (código do erro)
      return (
        <Typography color="error" align="center" sx={{ my: 10 }}>
          Erro: {error}
        </Typography>
      );
    }

    if (movies.length === 0) {
      // ... (código do EmptyState)
      return (
        <EmptyState message="It looks like there are no movies in your library! Search for a movie you have watched and add it here!" />
      );
    }

    // 10. Sucesso! Renderiza o grid de MovieCards
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
            onAdd={() => {}} // onAdd não é usado aqui
            // 3. PASSE O NOVO HANDLER PARA A PROP
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
