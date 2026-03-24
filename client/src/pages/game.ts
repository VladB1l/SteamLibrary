import { type SteamGame, type MediaItem } from "../types/SteamGame";
import { formatDate } from "../utils/dateUtils";
import { initHeader } from "../components/header";

const gamePage = document.getElementById("gamePage") as HTMLElement;
const loader = document.getElementById("gamesLoader") as HTMLElement;

let currentSlide = 0;
let mediaItems: MediaItem[] = [];

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
  if (game.tags) {
    game.tags.split(",").forEach((element) => {
      document.querySelector(".gameTagsList")!.innerHTML +=
        `<li class="gameTagsListItem">${element}</li>`;
    });
  }

  renderMediaSlider(game);

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
  document.getElementById("publishDate")!.textContent =
    formatDate(game.published_store) || "N/A";

  const steamBtn = document.querySelector(".steamButton") as HTMLAnchorElement;
  steamBtn.href = `${game.store_url}`;

  document.title = `${game.name} - Steam Top`;
}

function renderMediaSlider(game: SteamGame): void {
  mediaItems = [];
  const media: MediaItem[] = [];

  if (game.movies?.length) {
    const highlightVideo = game.movies.find((movie) => movie.highlight);
    if (highlightVideo?.hls_h264) {
      media.push({
        type: "video" as const,
        src: highlightVideo.hls_h264,
        name: highlightVideo.name,
      });
    }
  }

  game.screenshots?.forEach((screenshot) => {
    media.push({
      type: "image" as const,
      src: screenshot.path_full,
    });
  });

  if (media.length === 0) {
    return;
  }

  mediaItems = media;
  currentSlide = 0;

  const track = document.getElementById("sliderTrack")!;
  track.innerHTML = "";

  media.forEach((item, index) => {
    const slide = document.createElement("div");
    slide.className = "sliderItem";

    if (item.type === "video") {
      const video = document.createElement("video");
      video.src = item.src;
      video.muted = true;
      video.loop = true;
      video.autoplay = true;
      video.playsInline = true;
      slide.appendChild(video);
    } else {
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = `Screenshot ${index + 1}`;
      slide.appendChild(img);
    }

    track.appendChild(slide);
  });

  updateSlider();
}

function updateSlider(): void {
  const track = document.getElementById("sliderTrack")!;
  const currentEl = document.getElementById("currentSlide")!;
  const totalEl = document.getElementById("totalSlides")!;

  currentEl.textContent = (currentSlide + 1).toString();
  totalEl.textContent = mediaItems.length.toString();

  track.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide(): void {
  currentSlide = (currentSlide + 1) % mediaItems.length;
  updateSlider();
}

function prevSlide(): void {
  currentSlide = (currentSlide - 1 + mediaItems.length) % mediaItems.length;
  updateSlider();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".prevBtn")?.addEventListener("click", prevSlide);
  document.querySelector(".nextBtn")?.addEventListener("click", nextSlide);

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  loadGame();
  initHeader();
});
