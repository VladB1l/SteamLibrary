interface SteamGame {
  sid: number;
  store_url: string;
  store_promo_url: string;
  store_uscore: number;
  published_store: string;
  image: string;
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

function extractGenres(games: SteamGame[]): string[] {
  const genresSet = new Set<string>();

  games.forEach((game) => {
    const genres = game.genres.split(",").map((genre) => genre.trim());
    genres.forEach((genre) => {
      if (genre) genresSet.add(genre);
    });
  });

  return Array.from(genresSet).sort();
}

export { type SteamGame, extractGenres };
