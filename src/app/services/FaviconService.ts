import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class FaviconService {

  setFavicon(iconUrl: string) {
    const head = document.head;

    const oldLink = document.querySelector("link[rel='icon']");
    if (oldLink) {
      oldLink.remove();
    }

    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    link.href = iconUrl + "?v=" + Date.now(); // tránh cache

    head.appendChild(link);
  }

}