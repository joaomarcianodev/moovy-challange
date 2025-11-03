import React, { useState } from "react";
import { Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { type Movie } from "./MovieCard.types";
import {
  CardWrapper,
  CardImage,
  CardImagePlaceholder,
  CardBody,
  TitleRow,
  Rating,
  AddButton,
  RemoveButton,
  AddCircleOutlineIcon,
  RemoveCircleOutlineIcon,
} from "./MovieCard.styles";

interface MovieCardProps {
  movie: Movie;
  onAdd: (movie: Movie) => void; // Função chamada ao clicar em "Add"
  onRemove: (movie: Movie) => void; // Função chamada ao clicar em "Remove"
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onAdd, onRemove }) => {
  const [imageError, setImageError] = useState(false);
  const isValidImageUrl =
    movie.imageUrl && movie.imageUrl !== "N/A" && !imageError;

  return (
    <CardWrapper>
      {isValidImageUrl ? (
        <CardImage
          src={movie.imageUrl}
          alt={movie.title}
          onError={() => setImageError(true)}
        />
      ) : (
        <CardImagePlaceholder>No Image Available</CardImagePlaceholder>
      )}

      <CardBody>
        <TitleRow>
          <Typography variant="h6" component="div">
            {movie.title}
          </Typography>
          <Rating>
            <StarIcon sx={{ fontSize: "1.1rem" }} />
            &nbsp;{movie.rating}
          </Rating>
        </TitleRow>

        {movie.isAdded ? (
          <RemoveButton
            startIcon={<RemoveCircleOutlineIcon />}
            onClick={() => onRemove(movie)} // Avisa o pai
          >
            Remove
          </RemoveButton>
        ) : (
          <AddButton
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => onAdd(movie)} // Avisa o pai
          >
            Add to My Library
          </AddButton>
        )}
      </CardBody>
    </CardWrapper>
  );
};

export default MovieCard;
