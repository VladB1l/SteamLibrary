export interface SteamUser {
  steamId: string;
  name: string;
  avatar: string;
  balance: number;
  purchasedGames?: number[];
}
