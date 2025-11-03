import React, { useState, useEffect } from "react";
import { PageWrapper } from "./LibraryPage.styles";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import Header from "../../components/Header/Header";
import EmptyState from "../../components/EmptyState/EmptyState";
import MovieCard from "../../components/MovieCard/MovieCard";
import { type Movie } from "../../components/MovieCard/MovieCard.types";
import NotificationBar from "../../components/NotificationBar/NotificationBar";
import AudioRecorderModal from "../../components/AudioRecorderModal/AudioRecorderModal";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";

interface ApiLibraryMovie {
  id: number;
  title: string;
  year: number;
  imdbId: string;
  type: string;
  poster: string;
  rating: string | null;
  audioPath: string | null;
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
    audioPath: apiMovie.audioPath ?? null,
  };
};

const LibraryPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(
    null
  );

  // Estados do Modal de Gravação
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // 2. Estados para o Modal de Confirmação de Exclusão
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);

  useEffect(() => {
    // ... (lógica do fetchMovies não muda) ...
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
    // ... (lógica da notificationMessage não muda) ...
    if (notificationMessage) {
      const timer = setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [notificationMessage]);

  // 3. Renomeada: Esta é a lógica de execução da exclusão
  const executeDelete = async (movieToRemove: Movie) => {
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

  // 4. Nova função: Chamada quando o botão "Remove" do Card é clicado
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

  // 5. Nova função: Chamada pelo botão "Remove" do modal de confirmação
  const handleConfirmDelete = () => {
    if (movieToDelete) {
      executeDelete(movieToDelete);
    }
    // Fecha o modal
    setMovieToDelete(null);
    setIsConfirmModalOpen(false);
  };

  // 6. Nova função: Chamada pelo botão "Cancel" do modal de confirmação
  const handleCloseConfirmModal = () => {
    setMovieToDelete(null);
    setIsConfirmModalOpen(false);
  };

  const handleCloseNotification = () => {
    setNotificationMessage(null);
  };

  // ... (funções do modal de gravação não mudam) ...
  const handleOpenRecordModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsRecordModalOpen(true);
  };
  const handleCloseRecordModal = () => {
    setSelectedMovie(null);
    setIsRecordModalOpen(false);
  };
  const handleSaveAudio = async (audioBlob: Blob) => {
    if (!selectedMovie || !selectedMovie.movieId) {
      setNotificationMessage("Error: No movie selected for saving audio.");
      return;
    }
    const formData = new FormData();
    formData.append("file", audioBlob, `${selectedMovie.movieId}.webm`);
    try {
      const response = await fetch(
        `http://localhost:3000/movies/${selectedMovie.movieId}/audio`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to upload audio.");
      }
      const updatedMovie: ApiLibraryMovie = await response.json();
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.movieId === updatedMovie.id
            ? { ...movie, audioPath: updatedMovie.audioPath }
            : movie
        )
      );
      setNotificationMessage(`Audio saved for ${updatedMovie.title}.`);
      handleCloseRecordModal();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setNotificationMessage(`Audio save failed: ${message}`);
      console.error(err);
    }
  };

  const renderContent = () => {
    // ... (isLoading, error, movies.length === 0 não mudam) ...
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
            onRemove={handleRemoveClick} // 7. ATUALIZADO
            onRecordClick={handleOpenRecordModal}
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

      {/* Modal de Gravação */}
      {selectedMovie && (
        <AudioRecorderModal
          open={isRecordModalOpen}
          onClose={handleCloseRecordModal}
          onSave={handleSaveAudio}
          movieTitle={selectedMovie.title}
          existingAudioPath={selectedMovie.audioPath ?? null}
        />
      )}

      {/* 8. Adicionar o Modal de Confirmação de Exclusão */}
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

export default LibraryPage;
