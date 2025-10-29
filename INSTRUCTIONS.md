# Hướng Dẫn Cài Đặt Extension

## 📦 Bước 1: Cài đặt Extension

### Trên Windows/Mac

1. Mở Google Chrome
2. Gõ vào address bar: `chrome://extensions/`
3. Bật **Developer mode** (switch góc trên bên phải)
4. Click **Load unpacked** hoặc **Tải tiện ích chưa đóng gói**
5. Chọn thư mục này (tool-noxh)
6. Done! Icon extension sẽ xuất hiện

### Kiểm tra

- Mở trang: https://ricecitylongchau.com/nop-ho-so-scan
- Sẽ thấy một control panel màu tím ở góc trên bên phải
- Console sẽ hiện: "Extension đã được load!"

## 🎯 Bước 2: Sử dụng

### 1. Điền form thủ công lần đầu tiên
- Điền tất cả các trường
- Upload file
- Tick checkbox
- **QUAN TRỌNG:** Đừng click submit vội!

### 2. Bắt đầu Auto Submit
- Nhìn góc trên bên phải → thấy panel màu tím
- Click nút **"▶️ Bắt đầu"**
- Hoặc mở console (F12) gõ: `autoSubmitStart()`

### 3. Để tool tự động chạy
- Tool sẽ tự động click submit
- Khi gặp alert "quá tải", tool tự động click OK
- Form data và file upload **VẪN GIỮ NGUYÊN**
- Tiếp tục retry cho đến khi thành công!

### 4. Dừng khi nào muốn
- Click nút **"⏹️ Dừng"** trên panel
- Hoặc console: `autoSubmitStop()`

## 🔍 Cấu hình

Nếu muốn chỉnh số lần retry hoặc delay, sửa file `content.js`:

```javascript
let maxRetries = 50;              // Số lần tối đa
let delayBetweenRetries = 3000;   // Delay (ms)
```

## 💡 Tips

- Để xem log chi tiết, mở Console (F12)
- Nếu không thấy control panel, refresh trang
- Sử dụng popup: click icon extension trên toolbar
- Gõ `autoSubmitStop()` trong console nếu UI bị lỗi

## 🐛 Xử lý lỗi

### Không thấy control panel?
- Kiểm tra extension đã được cài đặt chưa
- Refresh trang web
- Mở Console xem có lỗi không

### Tool không click submit?
- Kiểm tra selector của button submit trong `content.js`
- Inspect nút submit trên trang web để xem class/id
- Update selector trong code

### Alert không bị tự động OK?
- Extension đang override `window.alert()`
- Kiểm tra console có log alert không
- Có thể trang web dùng cách khác để hiển thị thông báo

## 🎉 Xong!

Giờ bạn chỉ cần:
1. Điền form
2. Upload file
3. Click "Bắt đầu"
4. Uống cà phê ☕ và đợi kết quả!

