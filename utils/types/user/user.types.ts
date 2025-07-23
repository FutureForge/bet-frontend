export type UserResponse = {
  data: User;
  success: boolean;
};

export type User = {
  _id: string;
  address: string;
  totalWagered: number;
  totalWon: number;
  winCount: number;
  lossCount: number;
  crossfiTotalWagered: number;
  crossfiTotalWon: number;
  crossfiWinCount: number;
  crossfiLossCount: number;
  bnbTotalWagered: number;
  bnbTotalWon: number;
  bnbWinCount: number;
  bnbLossCount: number;
  createdAt: string;
  lastActiveAt: string;
  updatedAt: string;
  __v: number;
};
