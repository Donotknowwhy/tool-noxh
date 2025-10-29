# Hướng dẫn kiểm tra Tool Auto Submit

## ⚠️ LƯU Ý QUAN TRỌNG VỀ CAPTCHA VÀ DEVTOOLS (F12)

### Website có cơ chế phát hiện DevTools!

- **KHÔNG BẬT F12** (DevTools): Captcha sẽ **TỰ ĐỘNG VERIFY** sau vài giây ✅
- **CÓ BẬT F12** (DevTools): Captcha yêu cầu **TÍCH THỦ CÔNG** ❌

**Khuyến nghị sử dụng tool:**
1. **KHÔNG MỞ DevTools** (F12) khi chạy tool để captcha auto-verify
2. Chỉ mở Console để debug khi cần thiết
3. Nếu đã mở F12, đóng lại và **REFRESH trang** để reset captcha

---

## Các cách kiểm tra tool có đang hoạt động hay không:

### 1. KIỂM TRA VISUAL (Quan sát trực tiếp)

#### a) Nút Submit sẽ NHẤP NHÁY ĐỎ VÀNG mỗi khi click
- Khi tool click submit, nút sẽ chuyển màu **ĐỎ** với viền **VÀNG** trong 0.5 giây
- Bạn sẽ **THẤY RÕ** nút submit đang được click

#### b) Notification góc phải màn hình
Mỗi lần submit sẽ hiển thị thông báo:
- `🔄 Lần submit thứ 1...` (màu xám)
- `🖱️ ĐANG CLICK SUBMIT BUTTON...` (màu xanh lá)
- `⏳ Chờ 2000ms trước lần tiếp...` (màu xám)

#### c) Panel góc phải trên
- Hiển thị: `🟢 Đang chạy - Lần 5` (số lần tăng liên tục)

---

### 2. KIỂM TRA QUA CONSOLE (Chi tiết nhất)

**Bước 1:** Mở DevTools Console (F12 → Tab Console)

**Bước 2:** Quan sát log khi tool chạy:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 [SUBMIT #1] Bắt đầu lần submit thứ 1
📍 Submit button text: "Tải hồ sơ lên"
📍 Submit button ID: btn-upload-file
📍 Submit button class: btn btn-primary
✅ Captcha OK! Đang CLICK submit button...
⏰ Thời gian: 14:30:25
✅ ĐÃ CLICK submit button!
📊 Alert blocked: false
📊 Is running: true
⏳ Chờ 2000ms trước lần submit tiếp theo...
```

**Giải thích:**
- `🔄 [SUBMIT #1]` - Đang thực hiện lần submit thứ mấy
- `📍 Submit button text` - Chữ trên nút (để chắc chắn tìm đúng nút)
- `✅ ĐÃ CLICK submit button!` - **QUAN TRỌNG NHẤT** - Xác nhận đã click
- `⏰ Thời gian` - Thời điểm click để đối chiếu
- `📊 Alert blocked: true/false` - Alert có bị chặn không

---

### 3. KIỂM TRA ALERT BỊ CHẶN

Khi server trả về lỗi "Hiện đang có nhiều người nộp hồ sơ...":

**Cách 1: Quan sát Console**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📢 [ALERT INTERCEPTED]: "Hiện đang có nhiều người nộp hồ sơ..."
🏃 isRunning: true
⚠️ Server busy detected: true
✅ [AUTO RETRY] Chặn alert và tự động retry...
🔄 Retry ngay lập tức...
```

**Cách 2: Kiểm tra KHÔNG thấy popup alert**
- Nếu tool hoạt động đúng → **KHÔNG** xuất hiện cửa sổ alert (như ảnh bạn gửi)
- Alert bị chặn → Tool tự động retry sau 500ms

**Cách 3: Đếm số lần submit trong Console**
- Nếu thấy `[SUBMIT #1]`, `[SUBMIT #2]`, `[SUBMIT #3]`... tăng liên tục
- → Tool đang retry tự động

---

### 4. KIỂM TRA NETWORK (Xem request gửi đi)

**Bước 1:** Mở DevTools → Tab **Network**

**Bước 2:** Quan sát các request:
- Mỗi lần submit sẽ có request POST đến server
- Nếu thấy nhiều request liên tiếp → Tool đang submit liên tục

**Bước 3:** Click vào request → Tab **Headers** → Xem `Request URL` và `Status Code`

---

### 5. TEST NHANH - Kiểm tra tool có hoạt động không

1. **Reload extension**: `chrome://extensions/` → Click reload
2. **Refresh trang web**: ricecitylongchau.com
3. **Mở Console** (F12)
4. Kiểm tra log khởi động:
   ```
   🔧 [Content Script] Đang inject script vào page context...
   ✅ [Content Script] inject.js đã được inject thành công!
   ✅ Extension v2 đã được load! Override window.alert thành công!
   ```
5. **Click nút "Bắt đầu"** trên panel góc phải hoặc extension popup
6. **Quan sát**:
   - Nút submit NHẤP NHÁY đỏ vàng ✅
   - Console hiển thị log submit ✅
   - Panel hiển thị số lần tăng dần ✅

---

### 6. DEBUG - Nếu tool KHÔNG hoạt động

#### Kiểm tra 1: Extension có load không?
Console phải có log:
```
✅ Extension v2 đã được load!
```

#### Kiểm tra 2: Tìm được nút submit không?
Gõ vào Console:
```javascript
document.querySelector('#btn-upload-file')
```
Kết quả phải là: `<button id="btn-upload-file">...</button>` (không null)

#### Kiểm tra 3: Captcha có verify không?
Console sẽ hiển thị:
```
🔍 Kiểm tra captcha...
✅ Captcha đã verify thành công!
```

Nếu thấy:
```
❌ Captcha chưa verify!
```
→ Cần tick captcha thủ công trước

#### Kiểm tra 4: Override alert có hoạt động không?
Gõ vào Console:
```javascript
alert('test')
```
Xem Console log có xuất hiện:
```
📢 [ALERT INTERCEPTED]: "test"
```

---

### 7. CÁC DẤU HIỆU TOOL ĐANG HOẠT ĐỘNG ĐÚNG

✅ Nút submit nhấp nháy đỏ vàng mỗi 2-3 giây
✅ Console log liên tục `[SUBMIT #1]`, `[SUBMIT #2]`...
✅ Panel góc phải hiển thị `🟢 Đang chạy - Lần X`
✅ Notification góc phải xuất hiện liên tục
✅ Tab Network thấy request POST liên tục
✅ KHÔNG thấy popup alert "nhiều người nộp hồ sơ"

---

### 8. XỬ LÝ KHI CAPTCHA KHÔNG TỰ ĐỘNG VERIFY

**Hiện tượng:**
- Tool báo `⏳ Đang đợi captcha verify...` quá lâu (>10s)
- Notification: `⚠️ Captcha có thể yêu cầu bạn tích thủ công!`

**Nguyên nhân:**
DevTools (F12) đang mở → Website bật captcha manual

**Giải pháp:**

#### Cách 1: Đóng DevTools (Khuyến nghị)
1. Đóng DevTools (F12)
2. Refresh trang (Ctrl+R hoặc F5)
3. Đợi captcha tự động verify
4. Nhấn Start lại

#### Cách 2: Tích captcha thủ công (khi đang chạy)
1. Tool sẽ đợi tối đa 60 giây
2. Trong lúc đợi, bạn có thể tích captcha thủ công
3. Tool sẽ tự động detect và tiếp tục submit

**Timeout 60s:**
Nếu sau 60s captcha vẫn chưa verify:
- Tool sẽ skip lần submit này
- Tự động retry lần tiếp theo (nếu vẫn đang chạy)
- Console sẽ hiển thị tip: `💡 Thử đóng DevTools (F12) và refresh trang`

---

### 9. GHI CHÚ

- Tool sẽ **TỰ ĐỘNG DỪNG** nếu nhận được alert KHÔNG phải lỗi "quá tải" (có thể là thông báo thành công)
- Nếu muốn dừng thủ công: Click nút **"Dừng"** trên panel
- Tool chỉ chặn alert có chứa: `quá tải`, `nhiều người`, `thử lại`, `busy`, `please try again`
- **Timeout captcha:** Tăng từ 30s lên **60s** để xử lý cả captcha manual

---

### 10. CÁCH SỬ DỤNG TỐI ƯU

**Chế độ Production (Không debug):**
```
1. ĐÓNG DevTools (F12)
2. Mở trang ricecitylongchau.com
3. Điền form và upload file
4. Nhấn "Bắt đầu" trên panel extension
5. Để tool chạy tự động (captcha sẽ auto-verify)
```

**Chế độ Debug (Khi cần kiểm tra):**
```
1. MỞ DevTools (F12)
2. Mở trang ricecitylongchau.com
3. Điền form và upload file
4. Nhấn "Bắt đầu" trên panel extension
5. TÍCH CAPTCHA THỦ CÔNG mỗi lần tool chờ
6. Quan sát Console để debug
```
