import http from "../../utils/http.helper.js";
import { LEADERBOARD_ROUTES } from "../../config/api.config.js";

export const getLeaderboard = (sortBy) =>
  http.get(LEADERBOARD_ROUTES.LIST, { params: { sortBy } });

export const getMyRank = () => http.get(LEADERBOARD_ROUTES.ME);