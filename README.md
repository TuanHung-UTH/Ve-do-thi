# Visual Graph Algorithms

Ứng dụng web trực quan hóa đồ thị và các thuật toán, phù hợp với yêu cầu đề bài.

# Tính năng chính

# Phần cơ bản
1. **Vẽ đồ thị trực quan**
   - Thêm/xóa đỉnh
   - Thêm/xóa cạnh (có trọng số)
   - Hỗ trợ cả đồ thị vô hướng và có hướng
   - Kéo thả để di chuyển đỉnh

2. **Lưu/tải đồ thị**
   - Lưu đồ thị dưới dạng file JSON
   - Tải đồ thị từ file JSON

3. **Tìm đường đi ngắn nhất**
   - Thuật toán Dijkstra
   - Hiển thị đường đi và khoảng cách

4. **Duyệt đồ thị**
   - BFS (Breadth-First Search)
   - DFS (Depth-First Search)
   - Hiệu ứng hoạt hình trực quan

5. **Kiểm tra đồ thị 2 phía**
   - Thuật toán tô màu
   - Hiển thị kết quả và phân hoạch

6. **Chuyển đổi biểu diễn đồ thị**
   - Ma trận kề
   - Danh sách kề
   - Danh sách cạnh

# Phần nâng cao
7. **Trực quan hóa các thuật toán**
   - **Prim**: Tìm cây khung nhỏ nhất
   - **Kruskal**: Tìm cây khung nhỏ nhất
   - **Ford-Fulkerson**: Tìm luồng cực đại
   - **Fleury**: Tìm chu trình Euler
   - **Hierholzer**: Tìm chu trình Euler

# Hướng dẫn sử dụng

# Cài đặt và chạy
1. Tải toàn bộ mã nguồn
2. Mở file `index.html` trong trình duyệt web
3. Không cần cài đặt thêm bất kỳ công cụ nào

# Vẽ đồ thị
1. **Thêm đỉnh**: Nhấp vào nút "Thêm đỉnh" rồi nhấp vào vị trí trên canvas
2. **Thêm cạnh**: 
   - Nhấp vào nút "Thêm cạnh"
   - Chọn đỉnh thứ nhất (sẽ chuyển màu cam)
   - Chọn đỉnh thứ hai
   - Nhập trọng số trong hộp thoại
3. **Chuyển đổi loại đồ thị**: Nhấp vào nút "Vô hướng/Có hướng"
4. **Di chuyển đỉnh**: Kéo thả đỉnh đến vị trí mới

# Chạy thuật toán
1. **Thuật toán cơ bản**: Nhấp vào các nút BFS, DFS, v.v.
2. **Thuật toán nâng cao**:
   - Chọn thuật toán từ dropdown
   - Nhấp "Chạy thuật toán"
   - Theo dõi quá trình thực thi với hiệu ứng hoạt hình

# Cài đặt
- **Hiển thị trọng số**: Bật/tắt hiển thị trọng số trên cạnh
- **Hiệu ứng hoạt hình**: Bật/tắt hiệu ứng khi chạy thuật toán
- **Tốc độ hoạt hình**: Điều chỉnh thanh trượt để thay đổi tốc độ


# Cấu trúc dự án
index.html # Giao diện chính
style.css # Kiểu dáng
script.js # Xử lý đồ thị và giao diện
algorithms.js # Cài đặt các thuật toán
README.md # Tài liệu

# Yêu cầu hệ thống
- Trình duyệt web hiện đại (Chrome, Firefox, Edge, Safari)
- Hỗ trợ HTML5 Canvas và JavaScript ES6+

# Thuật toán đã cài đặt

# BFS (Breadth-First Search)
- Duyệt đồ thị theo chiều rộng
- Ứng dụng: Tìm đường đi ngắn nhất (số cạnh), kiểm tra tính liên thông

# DFS (Depth-First Search)
- Duyệt đồ thị theo chiều sâu
- Ứng dụng: Kiểm tra chu trình, tìm thành phần liên thông

# Dijkstra
- Tìm đường đi ngắn nhất với trọng số không âm
- Sử dụng hàng đợi ưu tiên

# Kiểm tra đồ thị 2 phía
- Thuật toán tô màu (2 màu)
- Phát hiện chu trình lẻ

# Prim & Kruskal
- Tìm cây khung nhỏ nhất (MST)
- Prim: Phù hợp cho đồ thị dày (nhiều cạnh)
- Kruskal: Phù hợp cho đồ thị thưa (ít cạnh)

# Ford-Fulkerson
- Tìm luồng cực đại trong mạng
- Sử dụng BFS để tìm đường tăng luồng (Edmonds-Karp)

# Fleury & Hierholzer
- Tìm chu trình Euler
- Fleury: Đơn giản nhưng chậm hơn
- Hierholzer: Hiệu quả hơn
