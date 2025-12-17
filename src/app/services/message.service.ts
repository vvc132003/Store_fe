import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages = [
    { code: '1001', text: 'Thêm loại code thành công!' },
    { code: '1002', text: 'Cập nhật loại code thành công!' },
    { code: '1003', text: 'Thêm mã nguồn thành công!' },
    { code: '1004', text: 'Đăng ký thành công!' },
    { code: '1005', text: 'Đăng nhập thành công!' },
    { code: '1006', text: 'Đã thêm dự án vào mục yêu thích!' },
    { code: '1007', text: 'Bạn đã thích dự án này!' },
    { code: '1008', text: 'Đánh giá thành công!' },






  
















  ];
  
  getMessageByCode(code: string) {
    const message = this.messages.find(msg => msg.code === code);
    return message ? message.text : 'Thông báo không tìm thấy!';
  }
}
