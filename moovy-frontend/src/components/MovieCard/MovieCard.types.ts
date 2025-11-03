export interface Movie {
  movieId?: number;
  id: string; // Mudamos de number para string (para o imdbID)
  year: number;
  title: string;
  type: string;
  rating: string; // A API não fornece, vamos gerar um mock
  imageUrl: string; // A API fornece 'Poster'
  isAdded: boolean; // Estado da nossa aplicação
}
