# RiceCity Auto Submit - Chrome Extension

Công cụ tự động submit form cho trang web **ricecitylongchau.com/nop-ho-so-scan** với khả năng retry khi gặp lỗi "quá tải".

## 🎯 Tính năng

- ✅ **Giữ nguyên form data** (không reload trang)
- ✅ **Giữ nguyên file upload** (không cần upload lại)
- ✅ Tự động submit liên tục
- ✅ Tự động xử lý JavaScript alert (window.alert)
- ✅ UI control panel trên trang web
- ✅ Có thể dừng/start bất cứ lúc nào
- ✅ Retry nhanh chóng

## 🚀 Quick Start

### Bước 1: Cài Extension

1. Mở **Chrome** và vào: `chrome://extensions/`
2. Bật **Developer mode** (switch góc trên bên phải)
3. Click **"Load unpacked"** hoặc **"Tải tiện ích chưa đóng gói"**
4. Chọn **thư mục này** (tool-noxh)
5. ✅ Done! Icon extension sẽ xuất hiện

### Bước 2: Sử dụng

1. Vào trang: https://ricecitylongchau.com/nop-ho-so-scan
2. **Điền form** + **upload file** (đừng submit vội!)
3. Nhìn góc trên bên phải → Control panel màu tím sẽ xuất hiện
4. Click nút **"▶️ Bắt đầu"**
5. ☕ Uống cà phê và đợi kết quả!

### Bước 3: Xem kết quả

- Logs hiển thị trên **Console (F12)**
- Control panel hiển thị **số lần đã submit**
- Tự động dừng khi thành công hoặc đạt max retries

## 💡 Cách hoạt động

1. **Điền form thủ công lần đầu** (nhập thông tin, upload file, tick checkbox)
2. **Không click submit vội!**
3. Click **"▶️ Bắt đầu"** trên control panel
4. Tool sẽ tự động:
   - Click nút submit
   - Nếu xuất hiện alert "quá tải" → tự động click OK
   - Retry ngay lập tức
   - **Form data và file vẫn giữ nguyên!**

## ⚙️ Cấu hình

Mở file `content.js`, tìm dòng 12-13:

```javascript
let maxRetries = 50;              // Số lần submit tối đa
let delayBetweenRetries = 3000;   // Delay giữa các lần (ms)
```

## 🔍 Tìm selector (nếu cần)

Nếu tool không tìm thấy nút submit:

1. Mở trang web và **F12** để mở DevTools
2. Click **Inspect** element
3. Chọn nút submit
4. Copy selector (ví dụ: `button[type="submit"]`)
5. Update trong `content.js` dòng 11:

```javascript
let submitButtonSelector = 'button[type="submit"]';
```

## 🐛 Xử lý lỗi

### Extension không hiển thị?
- Kiểm tra Console (F12) có lỗi không
- Refresh trang web
- Xem lại manifest.json có đúng không

### Không tự động submit?
- Mở Console xem logs
- Kiểm tra selector của submit button
- Click manual 1 lần để test

### Alert không bị auto OK?
- Tool đang override `window.alert()`
- Kiểm tra Console có log alert không
- Có thể trang web dùng cách khác (không phải alert)

## 📁 Cấu trúc

```
tool-noxh/
├── content.js           # Logic chính
├── manifest.json        # Extension config
├── popup.html/js        # Popup UI
├── README.md            # File này
├── INSTRUCTIONS.md      # Hướng dẫn chi tiết
├── README_EXTENSION.md  # Tài liệu kỹ thuật
└── icons/               # Extension icons
```

## 💡 Giải thích JavaScript Alert

**window.alert()** hiển thị popup dạng:
```
ricecitylongchau.com says
"Hiện đang có nhiều người nộp hồ sơ, bạn vui lòng thử lại trong ít phút"
                                  [OK]
```

Extension tự động:
1. Detect alert message
2. Tự động click OK
3. Retry submit ngay lập tức
4. **Giữ nguyên form data và file!**

## ⚠️ Lưu ý

- Tool này chỉ để **học tập và nghiên cứu**
- Sử dụng có **trách nhiệm**
- Không spam server
- Đọc kỹ **terms of service**

## 📖 Tài liệu

- [Hướng dẫn cài đặt chi tiết](INSTRUCTIONS.md)
- [Tài liệu kỹ thuật](README_EXTENSION.md)

---

**Chúc bạn submit thành công! 🎯**
