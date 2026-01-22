import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/AuthService';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  stars: { top: string; left: string; size: string; delay: string }[] = [];

  birdStyles: {
    top: string;
    duration: string;
    delay: string;
    scale: string;
  }[] = [];
  otp = '';
  newPassword = '';
  confirmPassword = '';

  showNewPassword = false;
  showConfirmPassword = false;
  isSubmitting = false;
  constructor(private titleService: Title, private auth: AuthService,
    private _user: UserService, private router: Router, private route: ActivatedRoute, private _notification: NotificationService) { }
  private subscription = new Subscription();
  ngOnInit(): void {
    this.titleService.setTitle("Đăng nhập");
    this.generateBirds();
    this.generateStars();
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

  submitResetPassword() {
    if (this.newPassword !== this.confirmPassword) return;

    this.isSubmitting = true;

    // call API reset password
  }

}
