import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { FavoriteService } from 'src/app/services/favorite.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy {

  showViewDetail: boolean = false;
  favorites: any[] = [];
  favorite_id: any = {};
  count: number = 0;




  constructor(private titleService: Title, private _favorite: FavoriteService) { }
  private subscription = new Subscription();

  ngOnInit(): void {
    this.titleService.setTitle('Quản lý code được lưu');
    this.loadFavorite();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  loadFavorite() {
    this.subscription.add(
      this._favorite.getData().subscribe((data: any) => {
        this.favorites = data.sort((a: any, b: any) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        this.favorite_id = this.favorites[0];
        this.count = this.favorites.length;

      })
    );
  }

  //#region event
  selectFavorite(event: any) {
    this.favorite_id = event;
  }


  click(event: any) {
    const modalMap: { [key: string]: () => void } = {
      '103': () => setTimeout(() => this.showViewDetail = true, 0),
      // '102': () => setTimeout(() => this.showcategory_add = true, 0)
    };

    const openModal = modalMap[event];
    if (openModal) {
      openModal();
    }
    switch (event) {
      case '101':
      case '103':
        break;
      default:
        break;
    }
  }
}
