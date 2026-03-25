import { type SteamGame } from "../types/SteamGame";
import { type SearchResult } from "../types/GameSearch";

class GameSearch {
  static searchContainer: HTMLElement;
  static searchInput: HTMLInputElement;
  static resultsDropdown: HTMLElement;
  static gamesCache: Map<string, SteamGame[]> = new Map();
  static currentController: AbortController | null = null;
  static debounceTimer: number | null = null;
  static readonly MAX_RESULTS = 20;

  static async init(container: HTMLElement): Promise<void> {
    this.searchContainer = container;
    this.searchInput = container.querySelector(".searchInput")!;
    this.resultsDropdown = this.createDropdown();

    this.searchInput.removeAttribute("readonly");
    this.searchInput.placeholder = "Search games...";

    this.searchInput.addEventListener("input", (e) => {
      if (this.debounceTimer) window.clearTimeout(this.debounceTimer);
      this.debounceTimer = window.setTimeout(
        () => this.onInput(e as InputEvent),
        300,
      );
    });

    this.searchInput.addEventListener("focus", () => {
      if (this.searchInput.value) this.showResults([]);
    });

    document.addEventListener("click", (e) => {
      if (!this.searchContainer.contains(e.target as Node)) {
        this.hideResults();
      }
    });
  }

  private static createDropdown(): HTMLElement {
    const dropdown = document.createElement("div");
    dropdown.className = "searchResults";
    this.searchContainer.appendChild(dropdown);
    return dropdown;
  }

  private static async onInput(e: InputEvent): Promise<void> {
    const query = (e.target as HTMLInputElement).value.trim();

    if (query.length < 2) {
      this.hideResults();
      return;
    }

    const qKey = query.toLowerCase();

    if (this.gamesCache.has(qKey)) {
      const cached = this.gamesCache.get(qKey) || [];
      const results = cached.map((game) => ({
        game,
        highlight: this.highlightMatch(game.name, qKey),
      }));
      this.showResults(results.slice(0, this.MAX_RESULTS));
      return;
    }

    if (this.currentController) this.currentController.abort();
    this.currentController = new AbortController();
    const signal = this.currentController.signal;

    try {
      const params = new URLSearchParams({
        q: query,
        limit: String(this.MAX_RESULTS),
      });
      const res = await fetch(
        `http://127.0.0.1:4000/api/search?${params.toString()}`,
        {
          signal,
        },
      );
      if (!res.ok) throw new Error(`Search request failed: ${res.status}`);
      const games: SteamGame[] = await res.json();
      this.gamesCache.set(qKey, games);
      const results = games.map((game) => ({
        game,
        highlight: this.highlightMatch(game.name, qKey),
      }));
      this.showResults(results.slice(0, this.MAX_RESULTS));
    } catch (err) {
      if ((err as any).name === "AbortError") return;
      console.error("Search error:", err);
      this.showResults([]);
    }
  }

  private static highlightMatch(text: string, query: string): string {
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  }

  private static showResults(results: SearchResult[]): void {
    this.resultsDropdown.innerHTML = "";

    if (results.length === 0) {
      this.resultsDropdown.innerHTML =
        '<div class="noResults">No games found</div>';
    } else {
      results.forEach(({ game, highlight }, index) => {
        const result = document.createElement("div");
        result.className = "searchResult";
        result.innerHTML = highlight;
        result.dataset.sid = game.sid.toString();
        result.addEventListener("click", () => this.selectGame(game.sid));
        this.resultsDropdown.appendChild(result);
      });
    }

    this.resultsDropdown.style.display = "block";
  }

  private static hideResults(): void {
    this.resultsDropdown.style.display = "none";
  }

  private static selectGame(sid: number): void {
    window.location.href = `/pages/game/game.html#game/${sid}`;
  }
}

export { GameSearch };
