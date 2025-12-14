class GraphVisualizer {
    constructor() {
        this.canvas = document.getElementById('graphCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.edges = [];
        this.selectedNode = null;
        this.draggingNode = null;
        this.isDirected = false;
        this.addEdgeMode = false;
        this.addNodeMode = true;
        this.firstNodeForEdge = null;
        this.animationSpeed = 5;
        this.isAnimating = false;
        this.currentAlgorithm = null;
        this.graphName = "Đồ thị của tôi";
        
        // Điều chỉnh kích thước canvas
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Khởi tạo sự kiện
        this.initEvents();
        
        // Khởi tạo đồ thị mẫu
        this.initSampleGraph();
        
        // Vẽ đồ thị ban đầu
        this.drawGraph();
        
        // Cập nhật thông tin
        this.updateStats();
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.drawGraph();
    }
    
    initEvents() {
        // Sự kiện canvas
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        
        // Nút điều khiển
        document.getElementById('addNodeBtn').addEventListener('click', () => {
            this.addNodeMode = true;
            this.addEdgeMode = false;
            this.showMessage("Chế độ thêm đỉnh: Nhấp vào canvas để thêm đỉnh");
        });
        
        document.getElementById('addEdgeBtn').addEventListener('click', () => {
            this.addEdgeMode = true;
            this.addNodeMode = false;
            this.firstNodeForEdge = null;
            this.showMessage("Chế độ thêm cạnh: Chọn đỉnh thứ nhất");
        });
        
        document.getElementById('directedToggle').addEventListener('click', () => {
            this.isDirected = !this.isDirected;
            const btn = document.getElementById('directedToggle');
            btn.innerHTML = this.isDirected ? 
                '<i class="fas fa-arrow-right"></i> Có hướng' : 
                '<i class="fas fa-arrow-right"></i> Vô hướng';
            this.drawGraph();
            this.showMessage(`Đã chuyển sang đồ thị ${this.isDirected ? 'có hướng' : 'vô hướng'}`);
        });
        
        document.getElementById('clearBtn').addEventListener('click', () => {
            if (confirm("Bạn có chắc chắn muốn xóa toàn bộ đồ thị?")) {
                this.nodes = [];
                this.edges = [];
                this.drawGraph();
                this.updateStats();
                this.showMessage("Đã xóa toàn bộ đồ thị");
                this.clearOutput();
            }
        });
        
        // Lưu/tải đồ thị
        document.getElementById('saveGraphBtn').addEventListener('click', () => this.saveGraph());
        document.getElementById('loadGraphBtn').addEventListener('click', () => document.getElementById('graphFileInput').click());
        document.getElementById('graphFileInput').addEventListener('change', (e) => this.loadGraph(e));
        
        // Thuật toán cơ bản
        document.getElementById('bfsBtn').addEventListener('click', () => this.runBFS());
        document.getElementById('dfsBtn').addEventListener('click', () => this.runDFS());
        document.getElementById('shortestPathBtn').addEventListener('click', () => this.runShortestPath());
        document.getElementById('bipartiteBtn').addEventListener('click', () => this.checkBipartite());
        
        // Chuyển đổi biểu diễn
        document.getElementById('adjMatrixBtn').addEventListener('click', () => this.showAdjacencyMatrix());
        document.getElementById('adjListBtn').addEventListener('click', () => this.showAdjacencyList());
        document.getElementById('edgeListBtn').addEventListener('click', () => this.showEdgeList());
        
        // Thuật toán nâng cao
        document.getElementById('runAdvancedAlgoBtn').addEventListener('click', () => {
            const algo = document.getElementById('advancedAlgoSelect').value;
            this.runAdvancedAlgorithm(algo);
        });
        
        // Cài đặt
        document.getElementById('animationSpeed').addEventListener('input', (e) => {
            this.animationSpeed = parseInt(e.target.value);
        });
        
        // Modal
        document.getElementById('confirmEdgeBtn').addEventListener('click', () => this.confirmAddEdge());
        document.getElementById('cancelEdgeBtn').addEventListener('click', () => this.cancelAddEdge());
        
        // Hiển thị thông tin thuật toán
        document.getElementById('advancedAlgoSelect').addEventListener('change', (e) => {
            this.showAlgorithmInfo(e.target.value);
        });
    }
    
    initSampleGraph() {
        // Tạo đồ thị mẫu với 5 đỉnh
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.6;
        
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * 2 * Math.PI;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            this.nodes.push({
                id: i,
                x: x,
                y: y,
                label: String.fromCharCode(65 + i), // A, B, C, D, E
                color: '#3498db'
            });
        }
        
        // Thêm một số cạnh mẫu
        this.edges.push({ from: 0, to: 1, weight: 3, color: '#2c3e50' });
        this.edges.push({ from: 1, to: 2, weight: 5, color: '#2c3e50' });
        this.edges.push({ from: 2, to: 3, weight: 2, color: '#2c3e50' });
        this.edges.push({ from: 3, to: 4, weight: 4, color: '#2c3e50' });
        this.edges.push({ from: 4, to: 0, weight: 1, color: '#2c3e50' });
        this.edges.push({ from: 1, to: 3, weight: 7, color: '#2c3e50' });
    }
    
    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Kiểm tra xem có nhấp vào đỉnh không
        const clickedNode = this.getNodeAtPosition(x, y);
        
        if (this.addNodeMode) {
            if (!clickedNode) {
                // Thêm đỉnh mới
                const id = this.nodes.length;
                const label = String.fromCharCode(65 + (id % 26));
                this.nodes.push({ id: id, x: x, y: y, label: label, color: '#3498db' });
                this.drawGraph();
                this.updateStats();
                this.showMessage(`Đã thêm đỉnh ${label}`);
            }
        } else if (this.addEdgeMode) {
            if (clickedNode) {
                if (this.firstNodeForEdge === null) {
                    // Chọn đỉnh đầu tiên
                    this.firstNodeForEdge = clickedNode;
                    clickedNode.color = '#f39c12';
                    this.drawGraph();
                    this.showMessage(`Đã chọn đỉnh ${clickedNode.label}. Chọn đỉnh thứ hai`);
                } else if (this.firstNodeForEdge.id !== clickedNode.id) {
                    // Chọn đỉnh thứ hai, hiển thị modal để nhập trọng số
                    this.secondNodeForEdge = clickedNode;
                    this.showEdgeWeightModal();
                } else {
                    // Nhấp lại vào cùng một đỉnh
                    this.firstNodeForEdge.color = '#3498db';
                    this.firstNodeForEdge = null;
                    this.drawGraph();
                    this.showMessage("Đã hủy chọn đỉnh");
                }
            }
        }
    }
    
    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const clickedNode = this.getNodeAtPosition(x, y);
        if (clickedNode) {
            this.draggingNode = clickedNode;
        }
    }
    
    handleMouseMove(e) {
        if (this.draggingNode) {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.draggingNode.x = x;
            this.draggingNode.y = y;
            this.drawGraph();
        }
    }
    
    handleMouseUp() {
        this.draggingNode = null;
    }
    
    getNodeAtPosition(x, y, radius = 20) {
        for (let i = this.nodes.length - 1; i >= 0; i--) {
            const node = this.nodes[i];
            const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
            if (distance <= radius) {
                return node;
            }
        }
        return null;
    }
    
    showEdgeWeightModal() {
        document.getElementById('edgeWeight').value = "1";
        document.getElementById('nodeModal').style.display = 'flex';
    }
    
    confirmAddEdge() {
        const weight = parseInt(document.getElementById('edgeWeight').value) || 1;
        
        // Kiểm tra xem cạnh đã tồn tại chưa
        const existingEdge = this.edges.find(edge => 
            (edge.from === this.firstNodeForEdge.id && edge.to === this.secondNodeForEdge.id) ||
            (!this.isDirected && edge.from === this.secondNodeForEdge.id && edge.to === this.firstNodeForEdge.id)
        );
        
        if (!existingEdge) {
            // Thêm cạnh mới
            this.edges.push({
                from: this.firstNodeForEdge.id,
                to: this.secondNodeForEdge.id,
                weight: weight,
                color: '#2c3e50'
            });
            
            this.showMessage(`Đã thêm cạnh ${this.firstNodeForEdge.label}-${this.secondNodeForEdge.label} với trọng số ${weight}`);
        } else {
            this.showMessage(`Cạnh ${this.firstNodeForEdge.label}-${this.secondNodeForEdge.label} đã tồn tại`);
        }
        
        // Đặt lại màu sắc
        this.firstNodeForEdge.color = '#3498db';
        this.secondNodeForEdge.color = '#3498db';
        
        // Đặt lại trạng thái
        this.firstNodeForEdge = null;
        this.secondNodeForEdge = null;
        
        // Đóng modal và vẽ lại
        document.getElementById('nodeModal').style.display = 'none';
        this.drawGraph();
        this.updateStats();
    }
    
    cancelAddEdge() {
        if (this.firstNodeForEdge) {
            this.firstNodeForEdge.color = '#3498db';
            this.firstNodeForEdge = null;
        }
        document.getElementById('nodeModal').style.display = 'none';
        this.drawGraph();
        this.showMessage("Đã hủy thêm cạnh");
    }
    
    drawGraph() {
        // Xóa canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Vẽ các cạnh
        for (const edge of this.edges) {
            this.drawEdge(edge);
        }
        
        // Vẽ các đỉnh
        for (const node of this.nodes) {
            this.drawNode(node);
        }
    }
    
    drawEdge(edge) {
        const fromNode = this.nodes.find(n => n.id === edge.from);
        const toNode = this.nodes.find(n => n.id === edge.to);
        
        if (!fromNode || !toNode) return;
        
        this.ctx.strokeStyle = edge.color || '#2c3e50';
        this.ctx.lineWidth = edge.highlighted ? 3 : 2;
        this.ctx.beginPath();
        this.ctx.moveTo(fromNode.x, fromNode.y);
        this.ctx.lineTo(toNode.x, toNode.y);
        this.ctx.stroke();
        
        // Vẽ mũi tên cho đồ thị có hướng
        if (this.isDirected) {
            this.drawArrow(fromNode.x, fromNode.y, toNode.x, toNode.y, edge.highlighted ? 3 : 2);
        }
        
        // Vẽ trọng số
        if (document.getElementById('showWeight').checked) {
            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;
            
            // Lệch một chút để không đè lên cạnh
            const offsetX = (toNode.y - fromNode.y) * 0.1;
            const offsetY = (fromNode.x - toNode.x) * 0.1;
            
            this.ctx.fillStyle = edge.highlighted ? '#e74c3c' : '#7f8c8d';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(edge.weight.toString(), midX + offsetX, midY + offsetY);
        }
    }
    
    drawArrow(fromX, fromY, toX, toY, lineWidth) {
        const headlen = 15;
        const dx = toX - fromX;
        const dy = toY - fromY;
        const angle = Math.atan2(dy, dx);
        
        // Tính điểm bắt đầu mũi tên (lùi lại một chút từ đỉnh đích)
        const toXAdjusted = toX - 20 * Math.cos(angle);
        const toYAdjusted = toY - 20 * Math.sin(angle);
        
        this.ctx.strokeStyle = this.edges.find(e => 
            e.from === this.nodes.find(n => n.x === fromX && n.y === fromY)?.id &&
            e.to === this.nodes.find(n => n.x === toX && n.y === toY)?.id
        )?.color || '#2c3e50';
        this.ctx.lineWidth = lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(toXAdjusted, toYAdjusted);
        this.ctx.lineTo(toXAdjusted - headlen * Math.cos(angle - Math.PI/6), toYAdjusted - headlen * Math.sin(angle - Math.PI/6));
        this.ctx.moveTo(toXAdjusted, toYAdjusted);
        this.ctx.lineTo(toXAdjusted - headlen * Math.cos(angle + Math.PI/6), toYAdjusted - headlen * Math.sin(angle + Math.PI/6));
        this.ctx.stroke();
    }
    
    drawNode(node) {
        // Vẽ vòng tròn đỉnh
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
        this.ctx.fillStyle = node.color || '#3498db';
        this.ctx.fill();
        
        // Viền đỉnh
        this.ctx.strokeStyle = node.highlighted ? '#e74c3c' : '#2c3e50';
        this.ctx.lineWidth = node.highlighted ? 3 : 2;
        this.ctx.stroke();
        
        // Vẽ nhãn đỉnh
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(node.label, node.x, node.y);
    }
    
    updateStats() {
        document.getElementById('nodeCount').textContent = this.nodes.length;
        document.getElementById('edgeCount').textContent = this.edges.length;
    }
    
    showMessage(message) {
        document.getElementById('graphStatus').textContent = message;
        setTimeout(() => {
            if (document.getElementById('graphStatus').textContent === message) {
                document.getElementById('graphStatus').textContent = "Sẵn sàng";
            }
        }, 3000);
    }
    
        clearOutput() {
            document.getElementById('outputContent').innerHTML = "<p>Kết quả thuật toán sẽ hiển thị ở đây...</p>";
        }
        
        // Placeholder methods for algorithms and other features
        runBFS() { this.showMessage("BFS not yet implemented"); }
        runDFS() { this.showMessage("DFS not yet implemented"); }
        runShortestPath() { this.showMessage("Shortest path not yet implemented"); }
        checkBipartite() { this.showMessage("Bipartite check not yet implemented"); }
        showAdjacencyMatrix() { this.showMessage("Adjacency matrix not yet implemented"); }
        showAdjacencyList() { this.showMessage("Adjacency list not yet implemented"); }
        showEdgeList() { this.showMessage("Edge list not yet implemented"); }
        runAdvancedAlgorithm(algo) { this.showMessage("Advanced algorithm not yet implemented"); }
        showAlgorithmInfo(algo) { this.showMessage("Algorithm info not yet implemented"); }
        saveGraph() { this.showMessage("Save graph not yet implemented"); }
        loadGraph(e) { this.showMessage("Load graph not yet implemented"); }
    }
