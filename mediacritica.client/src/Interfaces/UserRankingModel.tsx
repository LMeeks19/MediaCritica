export interface UserRankingModel {
  rank: number;
  name: string;
  reviews: number;
}

export interface UserRankingModelObject {
  first: UserRankingModel;
  second: UserRankingModel;
  third: UserRankingModel;
  other: UserRankingModel[];
}
