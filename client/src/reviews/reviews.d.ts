export type Review = {
  id: string;
  score: number;
  description: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
};

export type PartialReview = Pick<Review, `score` | `description`>;
