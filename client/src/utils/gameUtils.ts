import { type SteamGame } from "../types/SteamGame";

export function renderGame(game: SteamGame): HTMLElement {
  const gameCard = document.createElement("div");
  gameCard.classList.add("gameCard");
  gameCard.dataset.sid = game.sid.toString();

  const gameImg = document.createElement("div");
  gameImg.classList.add("gameImg");
  gameImg.style.backgroundImage = `url(${game.imageVer})`;

  const priceContainer = document.createElement("div");
  priceContainer.classList.add("gamePriceContainer");

  const discountDiv = document.createElement("div");
  discountDiv.classList.add("gameDiscount");
  const discount = game.discount || 0;
  discountDiv.textContent = `-${discount}%`;

  const priceDiv = document.createElement("div");
  priceDiv.classList.add("gamePrice");

  const fullPriceP = document.createElement("p");
  fullPriceP.classList.add("fullGamePrice");
  const fullPriceText = game.full_price
    ? `${(game.full_price / 100).toFixed(2)}€`
    : "";
  fullPriceP.textContent = fullPriceText;

  const currentPriceP = document.createElement("p");
  currentPriceP.classList.add("currentGamePrice");
  let currentPriceText: string;
  if (game.current_price === null || game.current_price === 0) {
    currentPriceText = "Free To Play";
  } else {
    currentPriceText = `${(game.current_price / 100).toFixed(2)}€`;
  }
  currentPriceP.textContent = currentPriceText;

  priceDiv.append(fullPriceP, currentPriceP);

  const isDiscounted = discount > 0;
  const isFree = game.current_price === null || game.current_price === 0;

  if (!isDiscounted) {
    discountDiv.classList.add("display-none");
    fullPriceP.classList.add("display-none");
  }
  if (isFree) {
    fullPriceP.classList.add("display-none");
  }

  priceContainer.append(discountDiv, priceDiv);

  const gameDetails = document.createElement("div");
  gameDetails.classList.add("gameDetails");

  const gameTitle = document.createElement("p");
  gameTitle.classList.add("gameTitle");
  gameTitle.textContent = game.name;
  gameDetails.append(gameTitle);

  gameCard.append(gameImg, priceContainer, gameDetails);
  return gameCard;
}

export function setupGameCardClick(container: HTMLElement): void {
  container.addEventListener("click", (e) => {
    const card = (e.target as HTMLElement).closest(".gameCard") as HTMLElement;
    if (card?.dataset.sid) {
      window.location.href = `/pages/game/game.html#game/${card.dataset.sid}`;
    }
  });
}
