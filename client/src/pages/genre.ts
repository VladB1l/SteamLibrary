import { type SteamGamesResponse, fetchData } from "../types/fetchData";
import { type SteamGame } from "../types/SteamGame";
import { renderGame, setupGameCardClick } from "../utils/gameUtils";

let currentPage = 0;
let currentGenre = "";

const gameListContainer = document.querySelector(".gameList") as HTMLElement;
const loadMoreBtn = document.getElementById("loadMore") as HTMLButtonElement;
const genreTitle = document.getElementById("genreTitle") as HTMLElement;

async function initGenrePage(): Promise<void> {
  const decodedHash = decodeURIComponent(location.hash);
  const hashParts = decodedHash.split("/");
  let genre = hashParts[1]?.trim() || "indie";

  const displayGenre = genre
    .split(/[-_%20]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  genreTitle.textContent = `${displayGenre} Games`;
  currentGenre = genre;

  await loadGamesPage(0);
}

async function loadGamesPage(page: number): Promise<void> {
  try {
    document.getElementById("gamesLoader")!.style.display = "block";
    loadMoreBtn.disabled = true;

    const url = `http://127.0.0.1:4000/api/genre?genre=${encodeURIComponent(currentGenre)}&page=${page}`;
    const data: SteamGamesResponse = await fetchData(url);

    currentPage = page;
    renderGames(data.games);

    loadMoreBtn.style.display =
      currentPage + 1 < data.totalPages ? "block" : "none";
  } catch (e) {
    console.error("Error:", e);
  } finally {
    document.getElementById("gamesLoader")!.style.display = "none";
    loadMoreBtn.disabled = false;
  }
}

function renderGames(games: SteamGame[]): void {
  if (!gameListContainer || !games.length) {
    return;
  }

  const fragment = document.createDocumentFragment();
  games.forEach((game) => {
    const gameElement = renderGame(game);
    gameElement && fragment.append(gameElement);
  });
  gameListContainer.append(fragment);
}

function loadNextPage(): void {
  loadGamesPage(currentPage + 1);
}

loadMoreBtn?.addEventListener("click", loadNextPage);
window.addEventListener("load", () => {
  initGenrePage();
  setupGameCardClick(gameListContainer);
});
