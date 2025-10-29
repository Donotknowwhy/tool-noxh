# 🚀 Tool Auto Submit - ricecitylongchau.com

Công cụ tự động nộp hồ sơ trên trang **ricecitylongchau.com**

## 📥 Tải về

👉 **[Tải tool tại đây (GitHub Release)](https://github.com/Donotknowwhy/tool-noxh/releases/latest)**

## 🎥 Video hướng dẫn

👉 **[Xem video demo tool chạy tại đây](https://jam.dev/c/0cd20afa-dcc9-4c13-ab50-4ed07b608e43)**

---

## 📖 Hướng dẫn sử dụng

### Bước 1: Tải và cài đặt

1. **Tải file tool-noxh.zip** từ [GitHub Release](https://github.com/Donotknowwhy/tool-noxh/releases/latest)
2. **Giải nén** file zip
3. Mở trình duyệt **Chrome**
4. Gõ vào thanh địa chỉ: `chrome://extensions/`
5. Bật **"Developer mode"** (góc phải trên)
6. Click nút **"Load unpacked"**
7. Chọn thư mục `tool-noxh` vừa giải nén
8. ✅ Xong!

### Bước 2: Sử dụng

1. Vào trang: **ricecitylongchau.com/nop-ho-so-scan**
2. **Điền đầy đủ thông tin** vào form
3. **Upload file** hồ sơ
4. Nhìn **góc phải màn hình** → sẽ thấy panel màu tím
5. Click nút **"▶️ Bắt đầu"**
6. Tool sẽ tự động submit liên tục

### Bước 3: Dừng tool

- Click nút **"⏹️ Dừng"** khi muốn ngừng

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 🔐 Về Captcha (Xác minh bảo mật)

**Captcha là gì?**
- Ô có chữ "Xác minh bạn không phải là robot" phía dưới form

**Cách hoạt động:**
- ✅ **Bình thường:** Captcha tự động tick sau vài giây → Tool chạy ngon
- ⚠️ **Đôi khi:** Captcha yêu cầu bạn phải tick thủ công

**Nếu captcha cần tick thủ công:**

1. Tool sẽ hiển thị thông báo màu cam:
   ```
   ⚠️ Captcha cần CLICK THỦ CÔNG!
   ```

2. **BẠN CẦN LÀM:**
   - Nhìn xuống phần captcha
   - **Click vào ô captcha** để tick
   - Đợi captcha verify (hiện chữ "Thành công!")
   - Tool sẽ tự động tiếp tục submit

3. **Lưu ý:** Nếu không tick captcha, tool sẽ đợi 60 giây rồi bỏ qua lần đó

### 🔄 Khi gặp lỗi "Hiện đang có nhiều người nộp hồ sơ"

- Tool sẽ **TỰ ĐỘNG** thử lại
- **KHÔNG CẦN** làm gì cả
- Tool sẽ chờ vài giây rồi tự động submit lại

### ✅ Khi nào tool TỰ ĐỘNG DỪNG?

Tool sẽ dừng khi:
- Nộp hồ sơ thành công
- Nhận được thông báo từ server (không phải lỗi "quá tải")

---

## 💡 Mẹo để tool chạy tốt nhất

### ✅ NÊN:
- **Đóng F12** (DevTools) khi sử dụng → Captcha sẽ tự động verify nhanh hơn
- Để tool chạy đến khi thành công hoặc tự dừng
- Kiểm tra panel góc phải để biết tool đang chạy hay dừng
- **Cài tool trên nhiều máy tính khác nhau** (laptop cá nhân, máy bạn bè, máy công ty) và chạy cùng lúc → Tăng tỉ lệ thành công, tránh bị captcha manual thường xuyên

### ❌ KHÔNG NÊN:
- Đóng tab khi tool đang chạy
- Refresh trang khi tool đang chạy
- Mở quá nhiều tab cùng lúc trên **cùng 1 thiết bị** (sẽ bị phát hiện bot)

---

## 📊 Hiểu thông tin trên Panel

Panel góc phải sẽ hiển thị:

```
🟢 Đang chạy - Lần 25
✅5 | ❌20
```

**Giải thích:**
- `Lần 25`: Đã submit 25 lần
- `✅5`: Thành công 5 lần
- `❌20`: Thất bại 20 lần (do lỗi "quá tải")

---

## ❓ Câu hỏi thường gặp

**Hỏi: Captcha không tự động tick?**
- Đáp: Đóng F12 và refresh trang. Nếu vẫn không tick tự động, bạn cần tick thủ công.

**Hỏi: Làm sao biết tool đang chạy?**
- Đáp: Panel góc phải hiển thị `🟢 Đang chạy - Lần X`

**Hỏi: Tool có spam quá nhiều không?**
- Đáp: Không. Tool tự động chờ từ 1.5-5 giây giữa các lần submit.

**Hỏi: Tôi có cần làm gì khi tool đang chạy không?**
- Đáp: Không cần. Chỉ cần tick captcha thủ công nếu tool báo.

**Hỏi: Nếu muốn dừng giữa chừng thì sao?**
- Đáp: Click nút "⏹️ Dừng" trên panel.

**Hỏi: Captcha cứ báo manual hoài, làm sao?**
- Đáp: Đây là do hệ thống phát hiện submit nhiều lần từ cùng 1 IP. **Giải pháp tốt nhất:** Cài tool trên nhiều máy tính khác nhau (laptop cá nhân, máy bạn bè, máy công ty) có kết nối mạng khác nhau và chạy cùng lúc. Điều này giúp:
  - Phân tán request từ nhiều IP khác nhau
  - Giảm nguy cơ bị phát hiện bot
  - Tăng tỉ lệ thành công

---

## 🛠️ Xử lý sự cố

**Vấn đề: Panel không hiển thị**
- Giải pháp: Refresh trang web (F5)

**Vấn đề: Tool không submit**
- Kiểm tra: Đã điền đầy đủ thông tin chưa?
- Kiểm tra: Đã upload file chưa?
- Giải pháp: Refresh trang và thử lại

**Vấn đề: Quá nhiều thông báo giống nhau xuất hiện liên tục trên màn hình**
- Nguyên nhân: Tool đang không hoạt động ổn định hoặc bị lỗi
- Giải pháp (làm theo thứ tự):
  1. Click nút **"⏹️ Dừng"** để dừng tool
  2. Click nút **"▶️ Bắt đầu"** để khởi động lại tool
  3. Nếu vẫn bị: **Refresh trang (F5)** và bắt đầu lại từ đầu

**Vấn đề: Tool chạy lâu nhưng KHÔNG thấy thông báo "Hiện đang có nhiều người nộp hồ sơ..."**
- Nguyên nhân: Tool có thể đang bị lỗi, không chặn alert được
- Dấu hiệu nhận biết:
  - Tool đã chạy hơn 10-20 lần submit
  - Không thấy bất kỳ thông báo lỗi nào từ server
  - Panel vẫn đang chạy nhưng số `❌` không tăng
- **Giải pháp: Refresh trang (F5) ngay lập tức và chạy lại tool**

**Vấn đề: Captcha cứ báo cần tick thủ công**
- Nguyên nhân: Bạn đang mở F12 hoặc submit quá nhiều
- Giải pháp:
  - Đóng F12
  - Refresh trang
  - Đợi vài phút rồi chạy lại

---

## 📞 Lưu ý

- Tool này được tạo ra để **tiết kiệm thời gian** khi nộp hồ sơ
- Sử dụng có **trách nhiệm**
- Nếu gặp lỗi nghiêm trọng, hãy dừng tool và thử lại sau

---

**Chúc bạn nộp hồ sơ thành công! 🎉**
