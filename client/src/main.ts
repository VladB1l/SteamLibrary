import { type SteamGamesResponse, fetchData } from "./types/fetchData";
import { type SteamGame } from "./types/SteamGame";
import { renderGame, setupGameCardClick } from "./utils/gameUtils";

let data: SteamGamesResponse;
let gamesListData: SteamGame[] = [];

let gameListContainer = document.querySelector(".gameList") as HTMLElement;

async function getData(): Promise<void> {
  try {
    document.getElementById("gamesLoader")!.style.display = "block";

    data = await fetchData("http://127.0.0.1:4000/api/top20");
    gamesListData = data.games;

    renderPage(gamesListData);
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

  // updatePagination(page);
}

function setupGenreLinks(): void {
  const genreButtons = document.querySelectorAll(".genreButton");

  genreButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const genre = (btn.textContent || "").trim().toLowerCase();
      console.log("Переход к жанру:", genre);
      window.location.href = `./pages/genre/genre.html#genre/${genre}`;
    });
  });
}

// function formatDate(date: string): string {
//   let newDate = new Date(date).toLocaleDateString("en-US", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   });
//   return newDate;
// }

// function getPlatformSvg(platform: string): string {
//   type Platform = "WIN" | "MAC" | "LNX";
//   const cleanPlatform: Platform = platform as Platform;
//   const svgs: Record<Platform, string> = {
//     WIN: `<svg class="platform-icon" viewBox="0 0 24 24" fill="currentColor"> <path xmlns="http://www.w3.org/2000/svg" d="M112,144v51.63672a7.9983,7.9983,0,0,1-9.43115,7.87061l-64-11.63623A8.00019,8.00019,0,0,1,32,184V144a8.00008,8.00008,0,0,1,8-8h64A8.00008,8.00008,0,0,1,112,144ZM109.126,54.2217a7.995,7.995,0,0,0-6.55713-1.729l-64,11.63623A8.00017,8.00017,0,0,0,32,72v40a8.00008,8.00008,0,0,0,8,8h64a8.00008,8.00008,0,0,0,8-8V60.3633A7.99853,7.99853,0,0,0,109.126,54.2217Zm112-20.36377a7.99714,7.99714,0,0,0-6.55713-1.729l-80,14.5459A7.99965,7.99965,0,0,0,128,54.54543V112a8.00008,8.00008,0,0,0,8,8h80a8.00008,8.00008,0,0,0,8-8V40A8.00028,8.00028,0,0,0,221.126,33.85793ZM216,136H136a8.00008,8.00008,0,0,0-8,8v57.45459a7.99967,7.99967,0,0,0,6.56885,7.87061l80,14.5459A8.0001,8.0001,0,0,0,224,216V144A8.00008,8.00008,0,0,0,216,136Z"/> </svg>`,
//     MAC: `<svg class="platform-icon" viewBox="0 0 24 24" fill="currentColor"> <path xmlns="http://www.w3.org/2000/svg" d="M380.844 297.529c.787 84.752 74.349 112.955 75.164 113.314-.622 1.988-11.754 40.191-38.756 79.652-23.343 34.117-47.568 68.107-85.731 68.811-37.499.691-49.557-22.236-92.429-22.236-42.859 0-56.256 21.533-91.753 22.928-36.837 1.395-64.889-36.891-88.424-70.883-48.093-69.53-84.846-196.475-35.496-282.165 24.516-42.554 68.328-69.501 115.882-70.192 36.173-.69 70.315 24.336 92.429 24.336 22.1 0 63.59-30.096 107.208-25.676 18.26.76 69.517 7.376 102.429 55.552-2.652 1.644-61.159 35.704-60.523 106.559M310.369 89.418C329.926 65.745 343.089 32.79 339.498 0 311.308 1.133 277.22 18.785 257 42.445c-18.121 20.952-33.991 54.487-29.709 86.628 31.421 2.431 63.52-15.967 83.078-39.655"/>  </svg>`,
//     LNX: `<svg class="platform-icon" viewBox="0 0 24 24" fill="currentColor"> <path xmlns="http://www.w3.org/2000/svg" d="M18.102 12.129c0-0 0-0 0-0.001 0-1.564 1.268-2.831 2.831-2.831s2.831 1.268 2.831 2.831c0 1.564-1.267 2.831-2.831 2.831-0 0-0 0-0.001 0h0c-0 0-0 0-0.001 0-1.563 0-2.83-1.267-2.83-2.83 0-0 0-0 0-0.001v0zM24.691 12.135c0-2.081-1.687-3.768-3.768-3.768s-3.768 1.687-3.768 3.768c0 2.081 1.687 3.768 3.768 3.768v0c2.080-0.003 3.765-1.688 3.768-3.767v-0zM10.427 23.76l-1.841-0.762c0.524 1.078 1.611 1.808 2.868 1.808 1.317 0 2.448-0.801 2.93-1.943l0.008-0.021c0.155-0.362 0.246-0.784 0.246-1.226 0-1.757-1.424-3.181-3.181-3.181-0.405 0-0.792 0.076-1.148 0.213l0.022-0.007 1.903 0.787c0.852 0.364 1.439 1.196 1.439 2.164 0 1.296-1.051 2.347-2.347 2.347-0.324 0-0.632-0.066-0.913-0.184l0.015 0.006zM15.974 1.004c-7.857 0.001-14.301 6.046-14.938 13.738l-0.004 0.054 8.038 3.322c0.668-0.462 1.495-0.737 2.387-0.737 0.001 0 0.002 0 0.002 0h-0c0.079 0 0.156 0.005 0.235 0.008l3.575-5.176v-0.074c0.003-3.12 2.533-5.648 5.653-5.648 3.122 0 5.653 2.531 5.653 5.653s-2.531 5.653-5.653 5.653h-0.131l-5.094 3.638c0 0.065 0.005 0.131 0.005 0.199 0 0.001 0 0.002 0 0.003 0 2.342-1.899 4.241-4.241 4.241-2.047 0-3.756-1.451-4.153-3.38l-0.005-0.027-5.755-2.383c1.841 6.345 7.601 10.905 14.425 10.905 8.281 0 14.994-6.713 14.994-14.994s-6.713-14.994-14.994-14.994c-0 0-0.001 0-0.001 0h0z"/> </svg>`,
//   };

//   return svgs[cleanPlatform];
// }

// const platforms: HTMLElement = document.createElement("p");
// platforms.classList.add("gamePlatforms");
// const platformsImages: string = game.platforms
//   .split(",")
//   .map((platform) => getPlatformSvg(platform))
//   .join("");

// platforms.innerHTML = `${platformsImages}`;

window.addEventListener("load", () => {
  getData();
  setupGenreLinks();
  setupGameCardClick(gameListContainer);
});
