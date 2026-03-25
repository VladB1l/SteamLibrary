import { type SteamGame, type MediaItem } from "../types/SteamGame";
import { formatDate } from "../utils/dateUtils";
import { initHeader } from "../components/header";
import SteamAuth from "../classes/steamAuth";

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

    const response = await fetch(`https://steam-jet.vercel.app/api/game?id=${gameId}`);
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
    const tagsContainer = document.querySelector(".gameTagsList")!;
    tagsContainer.innerHTML = "";
    game.tags.split(",").forEach((element) => {
      tagsContainer.innerHTML += `<li class="gameTagsListItem">${element}</li>`;
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

  const buyBtn = document.getElementById(
    "buyButton",
  ) as HTMLButtonElement | null;

  function updateBuyButton(): void {
    if (!buyBtn) return;
    const user = SteamAuth.getUser();
    const purchased = !!user?.purchasedGames?.includes(game.sid);

    if (purchased) {
      buyBtn.textContent = "In Library";
      buyBtn.setAttribute("disabled", "true");
      buyBtn.classList.add("inLibrary");
    } else {
      buyBtn.textContent = "Buy";
      buyBtn.removeAttribute("disabled");
      buyBtn.classList.remove("inLibrary");
    }
  }

  updateBuyButton();

  if (buyBtn) {
    buyBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const price = game.current_price || 0;
      const user = SteamAuth.getUser();

      if (!user) {
        window.location.href = SteamAuth.getLoginUrl();
        return;
      }

      const purchased = !!user.purchasedGames?.includes(game.sid);
      if (purchased) {
        alert("Already in library");
        updateBuyButton();
        return;
      }

      const userBalanceCents = Math.round((user.balance || 0) * 100);

      if (price === 0) {
        user.purchasedGames = user.purchasedGames || [];
        if (!user.purchasedGames.includes(game.sid))
          user.purchasedGames.push(game.sid);
        localStorage.setItem("steamUser", JSON.stringify(user));
        SteamAuth.updateUserDisplay();
        alert("Added to library");
        updateBuyButton();
        return;
      }

      if (userBalanceCents >= price) {
        const newBalanceCents = userBalanceCents - price;
        user.balance = newBalanceCents / 100;
        user.purchasedGames = user.purchasedGames || [];
        if (!user.purchasedGames.includes(game.sid))
          user.purchasedGames.push(game.sid);
        localStorage.setItem("steamUser", JSON.stringify(user));
        SteamAuth.updateUserDisplay();
        alert("Purchase successful!");
        updateBuyButton();
      } else {
        alert("Insufficient balance");
      }
    });
  }

  document.title = `${game.name} - Steam Top`;
}

function renderMediaSlider(game: SteamGame): void {
  mediaItems = [];
  const media: MediaItem[] = [];

  const track = document.getElementById("sliderTrack") as HTMLElement;
  if (track) track.innerHTML = "";

  game.screenshots?.forEach((screenshot) => {
    media.push({
      type: "image" as const,
      src: screenshot.path_full,
    });
  });

  const mediaSliderEl = document.querySelector(
    ".mediaSlider",
  ) as HTMLElement | null;

  if (media.length === 0) {
    if (mediaSliderEl) mediaSliderEl.style.display = "none";

    const currentEl = document.getElementById("currentSlide");
    const totalEl = document.getElementById("totalSlides");
    if (currentEl) currentEl.textContent = "0";
    if (totalEl) totalEl.textContent = "0";
    return;
  }

  if (mediaSliderEl) mediaSliderEl.style.display = "block";

  mediaItems = media;
  currentSlide = 0;

  media.forEach((item, index) => {
    const slide = document.createElement("div");
    slide.className = "sliderItem";

    const img = document.createElement("img");
    img.src = item.src;
    img.alt = `Screenshot ${index + 1}`;
    slide.appendChild(img);

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

window.addEventListener("hashchange", () => {
  loadGame();
});
