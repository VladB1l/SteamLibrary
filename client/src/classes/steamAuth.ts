import { type SteamUser } from "../types/Auth";

class SteamAuth {
  CALLBACK_URL = `${window.location.origin}${window.location.pathname}?steam=auth`;

  getLoginUrl(): string {
    return (
      `https://steamcommunity.com/openid/login?` +
      `openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select&` +
      `openid.identity=http://specs.openid.net/auth/2.0/identifier_select&` +
      `openid.mode=checkid_setup&` +
      `openid.ns=http://specs.openid.net/auth/2.0&` +
      `openid.return_to=${encodeURIComponent(this.CALLBACK_URL)}`
    );
  }

  async handleCallback(): Promise<void> {
    const urlParams = new URLSearchParams(window.location.search);
    const claimedId = urlParams.get("openid.claimed_id");

    if (!claimedId) return;

    const steamIdMatch = claimedId.match(
      /steamcommunity\.com\/openid\/id\/(\d+)/,
    );
    if (!steamIdMatch) return;

    const steamId = steamIdMatch[1];
    console.log(steamId);

    try {
      const res = await fetch("https://steam-jet.vercel.app/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ steamId }),
      });

      const data = await res.json();
      if (data.success) {
        const userObj = {
          ...data.user,
          purchasedGames: data.user.purchasedGames || [],
        };
        localStorage.setItem("steamUser", JSON.stringify(userObj));
        window.location.href = "/index.html";
      }
    } catch (error) {
      console.error("Auth error:", error);
    }
  }

  getUser(): SteamUser | null {
    const userStr = localStorage.getItem("steamUser");

    if (!userStr) {
      return null;
    }

    try {
      const user: SteamUser = JSON.parse(userStr);
      return user;
    } catch (e) {
      localStorage.removeItem("steamUser");
      return null;
    }
  }

  updateUserDisplay(): void {
    const user = this.getUser();
    const balanceEl = document.querySelector(".userBalance") as HTMLElement;
    const avatarEl = document.querySelector(".userAvatar") as HTMLImageElement;
    const nameEl = document.querySelector(".userName") as HTMLElement;
    const userProfile = document.querySelector(".userProfile") as HTMLElement;
    const dropdownIcon = document.querySelector(
      ".dropdownIcon",
    ) as HTMLElement | null;
    const userDropdown = document.querySelector(
      ".userDropdown",
    ) as HTMLElement | null;

    if (user) {
      if (balanceEl) balanceEl.style.display = "";
      if (balanceEl) balanceEl.textContent = `€${user.balance.toFixed(2)}`;
      if (avatarEl) {
        avatarEl.src = user.avatar;
        avatarEl.style.display = "block";
      }
      if (nameEl) nameEl.textContent = user.name;
      if (userProfile) userProfile.style.justifyContent = "flex-start";
      if (dropdownIcon) dropdownIcon.style.display = "";
      if (userDropdown) userDropdown.style.display = "";
    } else {
      if (balanceEl) balanceEl.style.display = "none";
      if (avatarEl) avatarEl.style.display = "none";
      if (nameEl) nameEl.textContent = "LOGIN";
      if (userProfile) userProfile.style.justifyContent = "center";
      if (dropdownIcon) dropdownIcon.style.display = "none";
      if (userDropdown) {
        userDropdown.style.display = "none";
        userDropdown.classList.remove("show");
      }
    }
  }

  init(): void {
    const params = new URLSearchParams(window.location.search);
    const isSteamAuth = params.get("steam") === "auth";
    const hasOpenId = params.has("openid.claimed_id");

    if (isSteamAuth && hasOpenId) {
      this.handleCallback();
      return;
    }

    this.updateUserDisplay();
  }

  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }

  logout(): void {
    localStorage.removeItem("steamUser");
    this.updateUserDisplay();
  }
}

export default new SteamAuth();
