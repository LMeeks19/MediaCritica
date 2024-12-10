import { ReviewModel } from "./ReviewModel";

export interface ReviewsModel {
    movieReviews: ReviewModel[];
    seriesReviews: ReviewModel[]
    gameReviews: ReviewModel[]
    episodeReviews: ReviewModel[]
}