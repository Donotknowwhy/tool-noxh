# Tạo Icons cho Extension

Extension cần 3 icon: 16x16, 48x48, 128x128 px

## Cách 1: Online Generator
- Vào https://www.favicon-generator.org/
- Upload/design icon
- Download và đổi tên thành:
  - icon16.png
  - icon48.png
  - icon128.png

## Cách 2: Sử dụng Text Icon đơn giản

### Dùng console để tạo PNG đơn giản:

```javascript
// Mở trình duyệt, tạo HTML
const createIcon = (size) => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // Text
  ctx.fillStyle = 'white';
  ctx.font = `bold ${size/2}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('R', size/2, size/2);
  
  return canvas.toDataURL('image/png');
};

// Download
[16, 48, 128].forEach(size => {
  const dataURL = createIcon(size);
  const link = document.createElement('a');
  link.download = `icon${size}.png`;
  link.href = dataURL;
  link.click();
});
```

## Cách 3: Tạm thời bỏ qua icons
Nếu không có icons, extension vẫn chạy được, chỉ không hiển thị icon thôi.

## Cách 4: Dùng emoji làm placeholder
Tạo file text với text: 🚀

