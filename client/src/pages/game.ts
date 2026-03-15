import { type SteamGame } from "../types/SteamGame";

const gamePage = document.getElementById("gamePage") as HTMLElement;
const loader = document.getElementById("gamesLoader") as HTMLElement;
const backButton = document.querySelector(".backButton") as HTMLAnchorElement;

async function loadGame(): Promise<void> {
  try {
    loader!.style.display = "block";
    gamePage.style.display = "none";

    const hashParts = location.hash.split("/");
    const gameId = parseInt(hashParts[1] || "0");

    if (!gameId) {
      throw new Error("Game ID not found");
    }

    const response = await fetch(`http://127.0.0.1:4000/api/game?id=${gameId}`);
    const game: SteamGame = await response.json();

    renderGamePage(game);
  } catch (error) {
    console.error("Game load error:", error);
    document.getElementById("gameTitle")!.textContent = "Game not found";
  } finally {
    loader!.style.display = "none";
    gamePage.style.display = "block";
  }
}

function renderGamePage(game: SteamGame): void {
  (document.getElementById("gameHeroImg") as HTMLImageElement).src =
    game.imageHor || game.imageVer;
  document.getElementById("gameName")!.textContent = game.name;

  document.getElementById("gameGenres")!.textContent = game.genres;
  document.getElementById("gamePlatforms")!.textContent = game.platforms;
  game.tags.split(",").forEach((element) => {
    document.querySelector(".gameTagsList")!.innerHTML +=
      `<li class="gameTagsListItem">${element}</li>`;
  });

  const priceEl = document.getElementById("gamePrice")!;
  if (game.current_price === null || game.current_price === 0) {
    priceEl.innerHTML = '<span class="current">Free To Play</span>';
  } else {
    const discount = game.discount || 0;
    let priceHTML = `<span class="current">${(game.current_price / 100).toFixed(2)}€</span>`;
    if (discount > 0 && game.full_price) {
      priceHTML += `<span class="full">${(game.full_price / 100).toFixed(2)}€</span>`;
    }
    priceEl.innerHTML = priceHTML;
  }

  document.getElementById("metaScore")!.textContent =
    `Metacritic: ${game.meta_score || "N/A"}`;
  document.getElementById("userScore")!.textContent =
    `Users: ${game.meta_uscore || "N/A"}`;

  document.getElementById("gameDesc")!.innerHTML = game.description;

  document.getElementById("developers")!.textContent = game.developers || "N/A";
  document.getElementById("publishers")!.textContent = game.publishers || "N/A";
  document.getElementById("languages")!.textContent = game.languages || "N/A";
  document.getElementById("voiceovers")!.textContent = game.voiceovers || "N/A";

  const steamBtn = document.querySelector(".steamButton") as HTMLAnchorElement;
  steamBtn.href = `${game.store_url}`;

  document.title = `${game.name} - Steam Top`;
}

backButton?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/";
});

window.addEventListener("load", loadGame);
