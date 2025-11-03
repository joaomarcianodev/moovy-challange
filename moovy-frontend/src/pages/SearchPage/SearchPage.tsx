import React, { useState, useEffect } from "react";
import { PageWrapper } from "./SearchPage.styles";
import { Container, Box, CircularProgress, Typography } from "@mui/material";
import Header from "../../components/Header/Header";
import NotificationBar from "../../components/NotificationBar/NotificationBar";
import SearchBar from "../../components/SearchBar/SearchBar";
import MovieCard from "../../components/MovieCard/MovieCard";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import { type Movie } from "../../components/MovieCard/MovieCard.types";
import { useDebounce } from "../../hooks/useDebounce";

interface ApiMovie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

interface Response {
  Search?: ApiMovie[];
  Response: "True" | "False";
  Error?: string;
  totalResults?: string;
}

interface ApiLibraryMovie {
  id: number;
  title: string;
  year: number;
  imdbId: string;
  type: string;
  poster: string;
  rating?: string;
  audioPath?: string;
}

const mapResponseToMovie = (
  apiMovie: ApiMovie,
  libraryMovies: ApiLibraryMovie[]
): Movie => {
  const movieInLibrary = libraryMovies.find(
    (libMovie) => libMovie.imdbId === apiMovie.imdbID
  );

  return {
    id: apiMovie.imdbID,
    title: apiMovie.Title,
    imageUrl: apiMovie.Poster,
    type: apiMovie.Type,
    year: parseInt(apiMovie.Year, 10),
    rating: "0.0",
    isAdded: !!movieInLibrary,
    movieId: movieInLibrary ? movieInLibrary.id : undefined,
    audioPath: movieInLibrary ? movieInLibrary.audioPath : null,
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
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
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
        const searchPromise = fetch(
          `http://localhost:3000/api/${debouncedSearchTerm}`
        );
        const libraryPromise = fetch("http://localhost:3000/movies");

        const [searchResponse, libraryResponse] = await Promise.all([
          searchPromise,
          libraryPromise,
        ]);

        if (!searchResponse.ok) {
          throw new Error("Could not connect to the movie search API.");
        }
        if (!libraryResponse.ok) {
          console.error("Could not connect to your library database.");
          throw new Error("Could not connect to your library database.");
        }

        const data: Response = await searchResponse.json();
        const libraryData: ApiLibraryMovie[] = await libraryResponse.json();

        if (data.Response === "True" && data.Search && data.Search.length > 0) {
          const mappedMovies = data.Search.map((apiMovie) =>
            mapResponseToMovie(apiMovie, libraryData)
          );
          setMovies(mappedMovies);
        } else if (data.Response === "False") {
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

    fetchMovies();
  }, [debouncedSearchTerm]);

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

  const handleAddToLibrary = async (movieToAdd: Movie) => {
    const newMovieDto = {
      title: movieToAdd.title,
      year: movieToAdd.year,
      imdbId: movieToAdd.id,
      type: movieToAdd.type,
      poster: movieToAdd.imageUrl,
    };

    try {
      const response = await fetch("http://localhost:3000/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMovieDto),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add movie.");
      }

      const savedMovie: ApiLibraryMovie = await response.json();
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.id === movieToAdd.id
            ? {
                ...movie,
                isAdded: true,
                movieId: savedMovie.id,
                audioPath: savedMovie.audioPath,
              }
            : movie
        )
      );
      setNotificationMessage(`${movieToAdd.title} added to your Library.`);
    } catch (err) {
      let errorMessage = "An unknown error has occurred.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }

      setNotificationMessage(`Fail: ${errorMessage}`);
      console.error("Failed to add movie:", err);

      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.id === movieToAdd.id ? { ...movie, isAdded: false } : movie
        )
      );
    }
  };

  const executeDelete = async (movieToRemove: Movie) => {
    const databaseId = movieToRemove.movieId;
    if (!databaseId) {
      setNotificationMessage(`Error: Cannot remove movie. ID not found.`);
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
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove movie.");
      }
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.id === movieToRemove.id
            ? { ...movie, isAdded: false, movieId: undefined, audioPath: null }
            : movie
        )
      );
      setNotificationMessage(
        `${movieToRemove.title} deleted from your watchlist.`
      );
    } catch (err) {
      let errorMessage = "An unknown error has occurred.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setNotificationMessage(`Fail: ${errorMessage}`);
      console.error("Failed to remove movie:", err);
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.id === movieToRemove.id ? { ...movie, isAdded: true } : movie
        )
      );
    }
  };

  const handleRemoveClick = (movie: Movie) => {
    if (movie.audioPath) {
      // Se tem áudio, abre o modal de confirmação
      setMovieToDelete(movie);
      setIsConfirmModalOpen(true);
    } else {
      // Se não tem áudio, deleta direto
      executeDelete(movie);
    }
  };

  const handleConfirmDelete = () => {
    if (movieToDelete) {
      executeDelete(movieToDelete);
    }
    setMovieToDelete(null);
    setIsConfirmModalOpen(false);
  };

  const handleCloseConfirmModal = () => {
    setMovieToDelete(null);
    setIsConfirmModalOpen(false);
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
              onRemove={handleRemoveClick}
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

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr auto",
              md: "1fr auto",
              lg: "1fr auto",
            },
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ my: 4, fontWeight: "bold" }}
          >
            Search
          </Typography>

          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </Box>
        {renderContent()}
      </Container>

      {movieToDelete && (
        <ConfirmationModal
          open={isConfirmModalOpen}
          onClose={handleCloseConfirmModal}
          onConfirm={handleConfirmDelete}
          movieTitle={movieToDelete.title}
        />
      )}
    </PageWrapper>
  );
};

export default SearchPage;
