import { Rating } from "@mui/material";

function StarRating(props: StarRatingProps) {
  return (
    <div className="flex flex-col gap-2 my-auto">
      <Rating
        sx={{ fontSize: "3rem" }}
        value={Number(props.rating) / 2}
        precision={0.1}
        readOnly
      />
      <div className="text-base text-center">{props.reviews} Reviews</div>
    </div>
  );
}

export default StarRating;

interface StarRatingProps {
  rating: string;
  reviews: string;
}
