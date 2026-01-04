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
    { code: '1009', text: 'Không thể thay đổi trạng thái Admin!' },
    { code: '1010', text: 'Cập nhật trạng thái thành công!' },
    { code: '1011', text: 'Vui lòng nhập tiêu đề Source Code!' },
    { code: '1012', text: 'Vui lòng nhập phí tải Source Code!' },
    { code: '1013', text: 'Vui lòng nhập chọn file Source Code!' },
    { code: '1014', text: 'File quá lớn, không thể tải lên!' },
    { code: '1015', text: 'Email không tồn tại!' },
    { code: '1016', text: 'Tài khoản đã bị khóa!' },
    { code: '1017', text: 'Tài khoản chưa được kích hoạt!' },
    { code: '1018', text: 'Mật khẩu không đúng!' },
    { code: '1019', text: 'Bạn chưa nhập email hoặc mật khẩu!' },
    { code: '1020', text: 'Thêm cấu hình thành công!' },
    { code: '1021', text: 'Cập nhật cấu hình thành công!' },
    { code: '1022', text: 'Bạn chưa chọn ảnh!' },
    { code: '1023', text: 'Mật khẩu chưa đạt yêu cầu bảo mật!' },
    { code: '1024', text: 'Mật khẩu không khớp!' },
    { code: '1025', text: 'Đăng ký dự án thành công!' },
    { code: '1026', text: 'Vui lòng chọn loại đồ án!' },
    { code: '1027', text: 'Vui lòng chọn ngân sách!' },
    { code: '1028', text: 'Số dư không đủ!' },
    { code: '1029', text: 'Tải thành công!' },





















  
















  ];
  
  getMessageByCode(code: string) {
    const message = this.messages.find(msg => msg.code === code);
    return message ? message.text : 'Thông báo không tìm thấy!';
  }
}
