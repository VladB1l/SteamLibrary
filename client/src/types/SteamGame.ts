interface SteamGame {
  sid: number;
  store_url: string;
  store_promo_url: string;
  store_uscore: number;
  published_store: string;
  imageHor: string;
  imageVer: string;
  name: string;
  description: string;
  full_price: number;
  current_price: number;
  discount: number | null;
  platforms: string;
  developers: string;
  publishers: string;
  languages: string;
  voiceovers: string;
  categories: string;
  genres: string;
  tags: string;
  meta_url: string;
  meta_score: number;
  meta_uscore: number;
}

export { type SteamGame };
