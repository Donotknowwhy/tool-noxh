# RiceCity Auto Submit - Chrome Extension

Extension tự động submit form và retry khi gặp lỗi quá tải.

## ✨ Tính năng

- ✅ Tự động click nút submit liên tục
- ✅ Tự động xử lý JavaScript alert (window.alert)
- ✅ Giữ nguyên form data và file upload (không reload trang)
- ✅ UI control panel trên trang web
- ✅ Báo cáo số lần retry
- ✅ Có thể dừng/start bất cứ lúc nào

## 🚀 Cài đặt

### Cách 1: Load extension từ thư mục (development)

1. Mở Chrome, vào `chrome://extensions/`
2. Bật **Developer mode** (góc trên bên phải)
3. Click **Load unpacked**
4. Chọn thư mục chứa extension này
5. Extension sẽ xuất hiện trên trang ricecitylongchau.com

### Cách 2: Cài từ file (production)

1. Đóng gói extension thành file `.crx`
2. Vào `chrome://extensions/`
3. Kéo thả file `.crx` vào Chrome

## 📖 Cách sử dụng

### Bước 1: Điền form thủ công lần đầu

1. Mở trang: https://ricecitylongchau.com/nop-ho-so-scan
2. Điền tất cả các trường form
3. Upload file
4. Tick các checkbox cần thiết
5. **KHÔNG CLICK SUBMIT YẾT**

### Bước 2: Bắt đầu Auto Submit

**Cách A: Dùng UI control**
- Nhìn góc trên bên phải trang web
- Click nút "▶️ Bắt đầu"
- Tool sẽ tự động click submit liên tục

**Cách B: Dùng Console**
```javascript
autoSubmitStart(); // Bắt đầu
autoSubmitStop();  // Dừng lại
```

**Cách C: Dùng Popup**
- Click icon extension trên Chrome toolbar
- Click "Bắt đầu Auto Submit"

### Bước 3: Để tool tự động chạy

- Tool sẽ tự động click submit
- Nếu xuất hiện alert "quá tải"
- Tool tự động click OK và thử lại
- Form data và file vẫn được giữ nguyên!

### Bước 4: Dừng khi cần

- Click nút "⏹️ Dừng" trên UI hoặc popup

## ⚙️ Cấu hình

Chỉnh sửa trong file `content.js`:

```javascript
let maxRetries = 50;              // Số lần submit tối đa
let delayBetweenRetries = 3000;   // Delay giữa các lần (ms)
```

## 🎯 Cách hoạt động

1. Extension inject content script vào trang web
2. Override `window.alert()` để tự động accept alert
3. Tìm nút submit và click tự động
4. Retry liên tục cho đến khi thành công hoặc đạt max retries
5. **Form data và file upload được giữ nguyên** (không reload trang)

## 🔍 Debug

Mở Console (F12) để xem logs:

```
✅ [AutoSubmit] Lần submit thứ 1...
✅ [AutoSubmit] Đang click submit...
📢 [AutoSubmit] Alert: "Hiện đang có nhiều người nộp hồ sơ..."
```

## 📝 Lưu ý

- ✅ **Form data được giữ nguyên** - không cần reload
- ✅ **File upload được giữ nguyên** - không cần upload lại
- ✅ Tự động xử lý alert OK
- ⚠️ Nhớ điền form đầy đủ trước khi start
- ⚠️ Có thể bị server block nếu submit quá nhiều

## 🆚 So sánh với Puppeteer Script

| Tính năng | Extension ✅ | Puppeteer Script |
|-----------|-------------|------------------|
| Giữ form data | ✅ Có | ❌ Phải điền lại mỗi lần |
| Giữ file upload | ✅ Có | ❌ Phải upload lại mỗi lần |
| Retry nhanh | ✅ Ngay lập tức | ⏱️ Phải reload page |
| Dễ sử dụng | ✅ Click 1 nút | 🔧 Phải setup code |
| Performance | ✅ Cao | ⚠️ Chậm hơn |

**Extension là lựa chọn tốt nhất** cho use case của bạn! 🎯

