# Quick Blog (Mini Blog)

Ứng dụng Blog hiện đại được xây dựng bằng **React 19**, **Vite** và **Tailwind CSS v4**. Dự án hỗ trợ quản lý bài viết, hệ thống phân quyền (RBAC) chặt chẽ, tối ưu trải nghiệm người dùng với Dark/Light mode, trình soạn thảo Rich Text TinyMCE, upload ảnh qua Cloudinary và thông báo Toast nổi.

---

## 🚀 Tính năng nổi bật

- **Xác thực & Phiên làm việc**: Đăng ký, đăng nhập với JWT, xác thực form ở client và đồng bộ trạng thái đăng nhập đa tab (Multi-tab Sync).
- **Phân quyền người dùng (RBAC)**: Bảo vệ route theo vai trò (`user`, `admin`), tự động chuyển hướng an toàn và xử lý trang 404/403.
- **Quản lý bài viết**:
  - Xem danh sách bài viết kèm tìm kiếm theo tiêu đề (Debounced Search).
  - Xem chi tiết bài viết (lọc nội dung an toàn với DOMPurify).
  - Tạo bài viết mới với ảnh tải lên Cloudinary và trình soạn thảo Rich Text (TinyMCE).
  - Quản lý danh sách bài viết cá nhân (My Posts).
  - Xóa bài viết với phân quyền theo quyền sở hữu/admin và hộp thoại xác nhận.
- **Quản trị người dùng (Admin)**: Xem danh sách thành viên, cập nhật vai trò (Role) và xóa tài khoản người dùng.
- **Giao diện & Trải nghiệm (UI/UX)**:
  - Hỗ trợ giao diện Sáng / Tối (Dark / Light Mode) lưu cấu hình theo người dùng.
  - Hệ thống thông báo lỗi dạng Toast nổi ở góc trên bên phải.
  - Thiết kế Responsive mượt mà trên mọi kích thước màn hình.
  - Tối ưu hiệu năng tải trang với Lazy loading & Code splitting.

---

## 🛠️ Công nghệ sử dụng

| Công nghệ | Mục đích |
| :--- | :--- |
| **React 19** | Thư viện UI cốt lõi (Functional Components & Hooks) |
| **Vite 8** | Build tool và Dev server siêu tốc |
| **React Router v6** | Định tuyến SPA, lazy loading và guards |
| **Tailwind CSS v4** | Hệ thống utility-first CSS hiện đại qua `@tailwindcss/vite` |
| **Axios** | Client HTTP gọi API backend tập trung qua Service Layer |
| **TinyMCE React** | Trình soạn thảo văn bản Rich Text Editor |
| **Cloudinary** | Lưu trữ và tải lên hình ảnh bìa trực tiếp từ frontend |
| **DOMPurify** | Làm sạch mã HTML từ trình soạn thảo, chống lỗ hổng XSS |
| **Lucide React** | Bộ icon giao diện tinh gọn, sắc nét |

---

## 📁 Cấu trúc thư mục

```text
src/
├── assets/          # Logo, hình ảnh và tài nguyên tĩnh
├── components/      # UI components tái sử dụng
│   ├── common/      # Button, Modal, Toast, Skeleton, ErrorState, ConfirmDialog...
│   ├── layout/      # Header, ThemeToggle, UserMenu, AppLayout
│   ├── posts/       # PostCard, PostForm, ImageUpload, RichTextEditor, DeletePostButton...
│   └── users/       # UserTable, RoleBadge, ChangeRoleButton, DeleteUserButton
├── contexts/        # AuthContext, ThemeContext
├── reducers/        # authReducer
├── hooks/           # useAuth, useTheme, useDebounce
├── layouts/         # AppLayout
├── pages/           # Route-level screens (Lazy-loaded)
│   ├── admin/       # UsersPage
│   ├── auth/        # LoginPage, RegisterPage
│   └── posts/       # HomePage, PostDetailPage, CreatePostPage, MyPostsPage
├── routes/          # AppRoutes, ProtectedRoute, RoleRoute, GuestOnlyRoute
├── services/        # apiClient, authService, postService, userService, uploadService
└── utils/           # apiError, permissions, postContent, authStorage
```

---

## ⚙️ Cài đặt & Khởi chạy

### 1. Yêu cầu môi trường
- Node.js >= 18.x
- npm / yarn / pnpm

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình biến môi trường
Tạo file `.env` ở thư mục gốc (tham khảo từ file `.env.example`):

```env
VITE_API_BASE_URL=https://api-blog-af3u.onrender.com
VITE_TINYMCE_API_KEY=your_tinymce_api_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
```

### 4. Khởi chạy môi trường phát triển
```bash
npm run dev
```

### 5. Kiểm tra mã nguồn (Lint) & Build Production
```bash
# Kiểm tra code style & linter
npm run lint

# Build bản production tối ưu
npm run build

# Xem thử bản production tại local
npm run preview
```

---

## 🚀 Triển khai (Deployment)
Dự án được cấu hình sẵn cho nền tảng **Vercel** thông qua tệp `vercel.json` với cơ chế SPA rewrites:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
Khi deploy lên Vercel, hãy đảm bảo đã thiết lập đầy đủ các biến môi trường tương ứng trong mục **Environment Variables** trên Vercel Dashboard.
