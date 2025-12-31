import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-projectservice',
  templateUrl: './projectservice.component.html',
  styleUrls: ['./projectservice.component.scss']
})
export class ProjectserviceComponent implements OnInit {
  bubbleStyles: { animationDuration: string, animationDelay: string, left: string, top: string, size: string }[] = [];


  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Dịch vụ làm đồ án tốt nghiệp");
    this.generateBubbleStyles();
  }

  generateBubbleStyles() {
    const numBubbles = 10; // Số lượng bong bóng
    this.bubbleStyles = [];

    for (let i = 0; i < numBubbles; i++) {
      const duration = (12 + Math.random() * 10).toFixed(2) + 's'; // Thời gian di chuyển ngẫu nhiên
      const delay = (Math.random() * 5).toFixed(2) + 's'; // Thời gian delay ngẫu nhiên
      const left = `${Math.random() * 100}vw`; // Vị trí ngang ngẫu nhiên (100% chiều rộng màn hình)
      const top = `${Math.random() * 100 + 50}vh`; // Vị trí dọc ngẫu nhiên, bắt đầu từ 50vh đến 100vh

      // Kích thước bong bóng ngẫu nhiên
      const size = `${Math.random() * 30 + 20}px`; // Kích thước bong bóng từ 20px đến 50px

      this.bubbleStyles.push({
        animationDuration: duration,
        animationDelay: delay,
        left,
        top,
        size
      });
    }
  }
  transformStyles = [
    '', // Giá trị transform mặc định cho thẻ 1
    '', // Thẻ 2
    ''  // Thẻ 3
  ];


  onMouseMove(event: MouseEvent, index: number) {
    const card = event.currentTarget as HTMLElement;
    const { left, top, width, height } = card.getBoundingClientRect();

    // Tính toán vị trí chuột trong thẻ
    const mouseX = event.clientX - left;
    const mouseY = event.clientY - top;

    // Tính toán góc xoay dựa trên vị trí chuột
    const rotateX = ((mouseY / height) - 0.5) * 20; // Xoay theo trục X
    const rotateY = ((mouseX / width) - 0.5) * 20; // Xoay theo trục Y

    // Cập nhật transform-origin và transform cho thẻ tương ứng
    this.transformStyles[index] = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    card.style.transformOrigin = `${(mouseX / width) * 100}% ${(mouseY / height) * 100}%`;
  }


  // Reset khi chuột rời khỏi thẻ
  onMouseLeave(index: number) {
    this.transformStyles[index] = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  }
}
