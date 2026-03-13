import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class FaviconService {

  setFavicon(iconUrl: string) {
    const link: HTMLLinkElement | null =
      document.querySelector("link[rel*='icon']");

    if (link) {
      link.href = iconUrl;
    }
  }

}