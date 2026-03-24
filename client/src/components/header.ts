import SteamAuth from "../classes/steamAuth";

export function initHeader(): void {
  setupEvents();
  SteamAuth.init();
}

function setupEvents(): void {
  document.querySelector(".headerLogo")?.addEventListener("click", () => {
    window.location.href = "./index.html";
  });

  const userProfile = document.querySelector(
    ".userProfile",
  ) as HTMLElement | null;
  if (userProfile) {
    userProfile.addEventListener("click", (e) => {
      e.stopPropagation();

      if (!SteamAuth.isLoggedIn()) {
        window.location.href = SteamAuth.getLoginUrl();
      } else {
        toggleDropdown();
      }
    });
  }

  document.querySelectorAll(".dropdownItem").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!SteamAuth.isLoggedIn()) {
        window.location.href = SteamAuth.getLoginUrl();
        return;
      }

      const action = (e.target as HTMLElement).dataset.action;
      handleDropdownAction(action!);
    });
  });
  document.getElementById("cancelTopup")?.addEventListener("click", closeModal);
  document
    .getElementById("confirmTopup")
    ?.addEventListener("click", topupBalance);

  document.addEventListener("click", (e) => {
    if (!userProfile) return;
    if (!userProfile.contains(e.target as Node)) {
      closeDropdown();
    }
  });
}

function toggleDropdown(): void {
  const dropdown = document.querySelector(".userDropdown") as HTMLElement;
  dropdown.classList.toggle("show");
}

function closeDropdown(): void {
  const dropdown = document.querySelector(".userDropdown") as HTMLElement;
  dropdown.classList.remove("show");
}

function handleDropdownAction(action: string): void {
  closeDropdown();

  switch (action) {
    case "logout":
      SteamAuth.logout();
      break;
    case "topup":
      openTopupModal();
      break;
  }
}

function openTopupModal(): void {
  if (!SteamAuth.isLoggedIn()) {
    window.location.href = SteamAuth.getLoginUrl();
    return;
  }

  const modal = document.getElementById("balanceModal") as HTMLElement;
  modal.classList.add("show");
  (document.getElementById("balanceAmount") as HTMLInputElement).focus();
}

function closeModal(): void {
  document.getElementById("balanceModal")?.classList.remove("show");
  (document.getElementById("balanceAmount") as HTMLInputElement).value = "";
}

async function topupBalance(): Promise<void> {
  const amountInput = document.getElementById(
    "balanceAmount",
  ) as HTMLInputElement;
  const amount = parseFloat(amountInput.value);

  if (isNaN(amount) || amount <= 0) {
    alert("Enter amount > 0");
    return;
  }

  const user = SteamAuth.getUser();
  if (user) {
    user.balance += amount;
    localStorage.setItem("steamUser", JSON.stringify(user));
    SteamAuth.updateUserDisplay();
    closeModal();
    alert(
      `+€${amount.toFixed(2)} added! New balance: €${user.balance.toFixed(2)}`,
    );
  }
}
