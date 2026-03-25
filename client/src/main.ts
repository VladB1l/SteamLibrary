import { type SteamGamesResponse, fetchData } from "./types/fetchData";
import { type SteamGame } from "./types/SteamGame";
import { renderGame, setupGameCardClick } from "./utils/gameUtils";
import { initHeader } from "./components/header";

let data: SteamGamesResponse;
let gamesListData: SteamGame[] = [];

let gameListContainer: HTMLElement | null = null;

async function getData(): Promise<void> {
  try {
    document.getElementById("gamesLoader")!.style.display = "block";

    data = await fetchData("http://127.0.0.1:4000/api/top20");
    gamesListData = data.games;

    renderPage(gamesListData);

    initHeader();
  } catch (e) {
    console.log(e);
  } finally {
    document.getElementById("gamesLoader")!.style.display = "none";
  }
}

function renderPage(games: SteamGame[]): void {
  if (!gameListContainer || !gamesListData) {
    return;
  }

  gameListContainer.innerHTML = "";

  const fragment = document.createDocumentFragment();
  games.forEach((game) => {
    const gameElement = renderGame(game);
    gameElement && fragment.append(gameElement);
  });
  gameListContainer.append(fragment);
}

function setupGenreLinks(): void {
  const genreButtons = document.querySelectorAll(".activeButton");

  genreButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const genre = (btn.textContent || "").trim().toLowerCase();
      console.log("Переход к жанру:", genre);
      window.location.href = `/pages/genre/genre.html#genre/${genre}`;
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  getData();
  setupGenreLinks();
  gameListContainer = document.querySelector(".gameList") as HTMLElement | null;
  if (gameListContainer) setupGameCardClick(gameListContainer);
});
