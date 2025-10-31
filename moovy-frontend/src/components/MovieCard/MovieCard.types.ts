export interface Movie {
  id: string; // Mudamos de number para string (para o imdbID)
  title: string;
  rating: number; // A API não fornece, vamos gerar um mock
  imageUrl: string; // A API fornece 'Poster'
  isAdded: boolean; // Estado da nossa aplicação
}
