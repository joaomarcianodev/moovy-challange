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

interface Response {
  Search?: ApiMovie[];
  Response: "True" | "False";
  Error?: string;
  totalResults?: string;
}

// Interface para os filmes salvos no seu banco de dados
interface ApiLibraryMovie {
  id: number; // O ID do banco (ex: 1, 2, 3)
  title: string;
  year: number;
  imdbId: string;
  type: string;
  poster: string;
  rating: number | null;
}

// Recebe a lista do banco de dados para comparar
const mapResponseToMovie = (
  apiMovie: ApiMovie,
  libraryMovies: ApiLibraryMovie[]
): Movie => {
  // Procura se o filme da API (OMDB) já existe na lista da biblioteca (banco)
  const movieInLibrary = libraryMovies.find(
    (libMovie) => libMovie.imdbId === apiMovie.imdbID
  );

  return {
    id: apiMovie.imdbID,
    title: apiMovie.Title,
    imageUrl: apiMovie.Poster,
    type: apiMovie.Type,
    year: parseInt(apiMovie.Year, 10),
    rating: 9.9, // Usando o seu valor fixo
    // Define 'isAdded' com base se o filme foi encontrado
    isAdded: !!movieInLibrary,
    // Salva o ID do banco (se existir) para usarmos no DELETE
    movieId: movieInLibrary ? movieInLibrary.id : undefined, // <-- ALTERADO
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
        // 1. Prepara as duas requisições
        const searchPromise = fetch(
          `http://localhost:3000/api/${debouncedSearchTerm}`
        );
        const libraryPromise = fetch("http://localhost:3000/movies");

        // 2. Executa as duas em paralelo
        const [searchResponse, libraryResponse] = await Promise.all([
          searchPromise,
          libraryPromise,
        ]);

        if (!searchResponse.ok) {
          throw new Error("Could not connect to the movie search API.");
        }
        if (!libraryResponse.ok) {
          // Trata falha ao buscar a biblioteca, mas não impede a busca
          console.error("Could not connect to your library database.");
          // Lança o erro para parar a execução
          throw new Error("Could not connect to your library database.");
        }

        // 3. Processa os resultados
        const data: Response = await searchResponse.json();
        const libraryData: ApiLibraryMovie[] = await libraryResponse.json();

        if (data.Response === "True" && data.Search && data.Search.length > 0) {
          // 4. Mapeia os resultados passando a lista da biblioteca
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
      // 2. Faça a requisição POST para "http://localhost:3000/movies"
      const response = await fetch("http://localhost:3000/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMovieDto),
      });

      if (!response.ok) {
        // Se o backend retornar um erro (ex: filme já existe), capture a mensagem
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add movie.");
      }

      // 3. Capture o filme salvo (que contém o ID do banco)
      const savedMovie: ApiLibraryMovie = await response.json();

      // 4. Atualize o estado, salvando o 'movieId' (ID do banco)
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.id === movieToAdd.id
            ? { ...movie, isAdded: true, movieId: savedMovie.id } // <-- ALTERADO
            : movie
        )
      );
      setNotificationMessage(`${movieToAdd.title} added to your Library`);
    } catch (err) {
      let errorMessage = "An unknown error has occurred.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }

      setNotificationMessage(`Fail: ${errorMessage}`);
      console.error("Failed to add movie:", err);

      // Reverter o estado visual se a API falhar
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.id === movieToAdd.id ? { ...movie, isAdded: false } : movie
        )
      );
    }
  };

  const handleRemoveFromLibrary = async (movieToRemove: Movie) => {
    // Pega o ID do banco que salvamos ao adicionar
    const databaseId = movieToRemove.movieId; // <-- ALTERADO

    if (!databaseId) {
      setNotificationMessage(`Error: Cannot remove movie. ID not found.`);
      return;
    }

    try {
      // 1. Faça a requisição DELETE para "http://localhost:3000/movies/{id_do_banco}"
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

      // 2. Se deu certo, atualize a UI
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.id === movieToRemove.id
            ? { ...movie, isAdded: false, movieId: undefined } // <-- ALTERADO
            : movie
        )
      );
      setNotificationMessage(
        `${movieToRemove.title} removed from your Library`
      );
    } catch (err) {
      // 3. Se falhar, mostre o erro e reverta a UI
      let errorMessage = "An unknown error has occurred.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setNotificationMessage(`Fail: ${errorMessage}`);
      console.error("Failed to remove movie:", err);

      // Reverte o botão para "Remove"
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.id === movieToRemove.id ? { ...movie, isAdded: true } : movie
        )
      );
    }
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
    </PageWrapper>
  );
};

export default SearchPage;
