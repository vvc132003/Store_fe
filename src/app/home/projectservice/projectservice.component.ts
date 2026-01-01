import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-projectservice',
  templateUrl: './projectservice.component.html',
  styleUrls: ['./projectservice.component.scss']
})
export class ProjectserviceComponent implements OnInit {
  bubbleStyles: {
    animationDuration: string;
    animationDelay: string;
    left: string;
    top: string;
    size: string;
    color: string;
  }[] = [];

  birdStyles: {
    top: string;
    duration: string;
    delay: string;
    scale: string;
  }[] = [];

  lanternStyles: {
    left: string;
    top: string;
    size: string;
    height: string;
    duration: string;
    delay: string;
  }[] = [];


  stars: { top: string; left: string; size: string; delay: string }[] = [];


  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Dịch vụ làm đồ án tốt nghiệp");
    this.generateBubbleStyles();
    this.generateBirds();
    this.generateLanterns();
    this.generateStars();
  }

  generateStars() {
    const numStars = 100;
    this.stars = [];

    for (let i = 0; i < numStars; i++) {
      this.stars.push({
        top: `${Math.random() * 100 + 15}vh`,
        left: `${Math.random() * 100}vw`,
        size: `${Math.random() * 2 + 1}px`,  // ngôi sao nhỏ 1-3px
        delay: `${Math.random() * 5}s`
      });
    }
  }

  generateLanterns() {
    const count = 10;
    this.lanternStyles = [];

    for (let i = 0; i < count; i++) {
      const width = Math.random() * 30 + 40;

      this.lanternStyles.push({
        left: `${Math.random() * 100}vw`,
        top: `${100 + Math.random() * 50}vh`,
        size: `${width}px`,
        height: `${width * 1.4}px`,
        duration: `${20 + Math.random() * 15}s`,
        delay: `${Math.random() * 5}s`
      });
    }
  }

  generateBirds() {
    const numBirds = 10; // số chim
    this.birdStyles = [];

    for (let i = 0; i < numBirds; i++) {
      this.birdStyles.push({
        top: `${Math.random() * 60 + 10}vh`,        // bay từ trên xuống giữa
        duration: `${20 + Math.random() * 20}s`,    // bay chậm
        delay: `${Math.random() * 10}s`,
        scale: `scale(${0.3 + Math.random() * 0.4})`
      });
    }
  }

  generateBubbleStyles() {
    const numBubbles = 10; // Số lượng bong bóng
    const colors = [
      '#ff6b6b', // đỏ
      '#ffd93d', // vàng
      '#6bcfff', // xanh dương
      '#6bff95', // xanh lá
      '#c77dff', // tím
      '#ff9ff3', // hồng
      '#feca57'  // cam
    ];

    this.bubbleStyles = [];

    for (let i = 0; i < numBubbles; i++) {
      const duration = (12 + Math.random() * 10).toFixed(2) + 's'; // Thời gian di chuyển ngẫu nhiên
      const delay = (Math.random() * 5).toFixed(2) + 's'; // Thời gian delay ngẫu nhiên
      const left = `${Math.random() * 100}vw`; // Vị trí ngang ngẫu nhiên (100% chiều rộng màn hình)
      const top = `${Math.random() * 100 + 50}vh`; // Vị trí dọc ngẫu nhiên, bắt đầu từ 50vh đến 100vh

      // Kích thước bong bóng ngẫu nhiên
      const size = `${Math.random() * 30 + 20}px`; // Kích thước bong bóng từ 20px đến 50px
      const color = colors[Math.floor(Math.random() * colors.length)]

      this.bubbleStyles.push({
        animationDuration: duration,
        animationDelay: delay,
        left,
        top,
        size,
        color
      });
    }
  }
  transformStyles: string[] = ['', '', '']; // 3 thẻ

  onMouseMove(event: MouseEvent, index: number) {
    const card = event.currentTarget as HTMLElement;
    const { left, top, width, height } = card.getBoundingClientRect();

    const mouseX = event.clientX - left;
    const mouseY = event.clientY - top;

    const rotateX = ((mouseY / height) - 0.5) * 20; // Xoay X
    const rotateY = ((mouseX / width) - 0.5) * 20;  // Xoay Y

    this.transformStyles[index] = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;

    card.style.transformOrigin = `${(mouseX / width) * 100}% ${(mouseY / height) * 100}%`;
  }

  onMouseLeave(index: number) {
    this.transformStyles[index] = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  }

}
