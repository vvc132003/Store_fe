import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit, OnDestroy, OnChanges {
  @Output() closeDetail = new EventEmitter<void>();
  @Input() showoffcanvas: boolean = false;
  @Input() project: any = {};
  text: string = "";

  private subscription = new Subscription();

  constructor() { }


  ngOnInit(): void {
  }
  //#region load
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['project'] && this.project) {
      this.text = "Xem chi tiết: " + this.project.title;
      // console.log(this.project);
      this.mainImage = this.project.thumbnailUrl;
      if (!this.project.images.includes(this.mainImage)) {
        this.project.images.push(this.mainImage);
      }
      this.startAutoSlide();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  //#region  event

  showZoomBtn: boolean = false;
  isModalOpen: boolean = false;

  onHover() {
    this.showZoomBtn = true;
  }
  onLeave() {
    this.showZoomBtn = false;
  }

  openModal() {
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
  }


  close() {
    this.closeDetail.emit();
  }
  mainImage: string = "";
  slideIndex = 0;
  intervalId: any;
  @ViewChild('thumbList') thumbList!: ElementRef<HTMLDivElement>;

  selectImage(img: string) {
    this.mainImage = img;
    this.slideIndex = this.project.images.indexOf(img);
    this.scrollThumbnailIntoView();

  }
  private startAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(() => {
      this.slideIndex = (this.slideIndex + 1) % this.project.images.length;
      this.mainImage = this.project.images[this.slideIndex];
      this.scrollThumbnailIntoView();
    }, 3000);
  }
  private scrollThumbnailIntoView() {
    const container = this.thumbList.nativeElement; // container ngang
    const images = container.querySelectorAll('img');
    const activeImg = images[this.slideIndex] as HTMLElement;

    if (activeImg) {
      // Tọa độ ảnh so với container
      const containerWidth = container.clientWidth;
      const imgOffsetLeft = activeImg.offsetLeft;
      const imgWidth = activeImg.offsetWidth;

      // Scroll sao cho ảnh active nằm giữa container
      const scrollTo = imgOffsetLeft - (containerWidth / 2) + (imgWidth / 2);

      container.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  }
}
