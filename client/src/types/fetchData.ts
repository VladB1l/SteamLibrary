import { type SteamGame } from "./SteamGame";

interface SteamGamesResponse {
  total: number;
  games: SteamGame[];
}

async function fetchData(url: string): Promise<SteamGamesResponse> {
  const response = await fetch(url);
  return response.json();
}

export { type SteamGamesResponse, fetchData };
