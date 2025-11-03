export interface Movie {
  movieId?: number;
  id: string;
  year: number;
  title: string;
  type: string;
  rating: string;
  imageUrl: string;
  isAdded: boolean;
  audioPath?: string | null;
}
