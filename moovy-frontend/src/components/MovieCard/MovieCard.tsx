import React, { useState } from "react";
import { Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { type Movie } from "./MovieCard.types";
import {
  CardWrapper,
  ImageContainer,
  CardImage,
  CardImagePlaceholder,
  RecordOverlay,
  CardBody,
  TitleRow,
  Rating,
  AddButton,
  RemoveButton,
} from "./MovieCard.styles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import MicIcon from "@mui/icons-material/Mic";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

interface MovieCardProps {
  movie: Movie;
  onAdd: (movie: Movie) => void;
  onRemove: (movie: Movie) => void;
  onRecordClick?: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onAdd,
  onRemove,
  onRecordClick,
}) => {
  const [imageError, setImageError] = useState(false);
  const isValidImageUrl =
    movie.imageUrl && movie.imageUrl !== "N/A" && !imageError;

  const showOverlay = !!onRecordClick;

  return (
    <CardWrapper>
      <ImageContainer>
        {isValidImageUrl ? (
          <CardImage
            src={movie.imageUrl}
            alt={movie.title}
            onError={() => setImageError(true)}
          />
        ) : (
          <CardImagePlaceholder>No Image Available</CardImagePlaceholder>
        )}

        {showOverlay && (
          <RecordOverlay onClick={() => onRecordClick(movie)}>
            {movie.audioPath ? (
              <>
                <PlayCircleOutlineIcon sx={{ fontSize: 40 }} />
                <Typography variant="caption">Play Audio</Typography>
              </>
            ) : (
              <>
                <MicIcon sx={{ fontSize: 40 }} />
                <Typography variant="caption">Pending record</Typography>
              </>
            )}
          </RecordOverlay>
        )}
      </ImageContainer>

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
            onClick={() => onRemove(movie)}
          >
            Remove
          </RemoveButton>
        ) : (
          <AddButton
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => onAdd(movie)}
          >
            Add to My Library
          </AddButton>
        )}
      </CardBody>
    </CardWrapper>
  );
};

export default MovieCard;
