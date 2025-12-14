// Thuật toán đồ thị
class GraphAlgorithms {
    constructor(graphVisualizer) {
        this.graph = graphVisualizer;
    }

    // Thuật toán BFS
    async bfs(startNodeId) {
        if (this.graph.nodes.length === 0) {
            this.graph.showMessage("Đồ thị trống!");
            return null;
        }

        const startId = startNodeId !== undefined ? startNodeId : 0;
        const visited = new Array(this.graph.nodes.length).fill(false);
        const queue = [startId];
        const result = [];
        const parent = new Array(this.graph.nodes.length).fill(-1);
        
        visited[startId] = true;
        
        // Đánh dấu đỉnh bắt đầu
        this.graph.nodes[startId].color = '#e74c3c';
        this.graph.drawGraph();
        await this.delay();

        while (queue.length > 0) {
            const current = queue.shift();
            result.push(current);

            // Lấy các đỉnh kề
            const neighbors = this.getNeighbors(current);
            
            for (const neighbor of neighbors) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    parent[neighbor] = current;
                    queue.push(neighbor);

                    // Đánh dấu đỉnh đang xét
                    this.graph.nodes[neighbor].color = '#f39c12';
                    this.graph.drawGraph();
                    await this.delay();
                }
            }

            // Đánh dấu đỉnh đã xong
            this.graph.nodes[current].color = '#2ecc71';
            this.graph.drawGraph();
            await this.delay();
        }

        // Khôi phục màu sắc
        setTimeout(() => {
            this.graph.nodes.forEach(node => node.color = '#3498db');
            this.graph.drawGraph();
        }, 1000);

        return {
            traversal: result.map(id => this.graph.nodes[id].label),
            parent: parent
        };
    }

    // Thuật toán DFS
    async dfs(startNodeId) {
        if (this.graph.nodes.length === 0) {
            this.graph.showMessage("Đồ thị trống!");
            return null;
        }

        const startId = startNodeId !== undefined ? startNodeId : 0;
        const visited = new Array(this.graph.nodes.length).fill(false);
        const stack = [startId];
        const result = [];
        
        // Đánh dấu đỉnh bắt đầu
        this.graph.nodes[startId].color = '#e74c3c';
        this.graph.drawGraph();
        await this.delay();

        while (stack.length > 0) {
            const current = stack.pop();

            if (!visited[current]) {
                visited[current] = true;
                result.push(current);

                // Lấy các đỉnh kề
                const neighbors = this.getNeighbors(current).reverse();
                
                for (const neighbor of neighbors) {
                    if (!visited[neighbor]) {
                        stack.push(neighbor);
                        
                        // Đánh dấu đỉnh đang xét
                        this.graph.nodes[neighbor].color = '#f39c12';
                        this.graph.drawGraph();
                        await this.delay();
                    }
                }

                // Đánh dấu đỉnh đã xong
                this.graph.nodes[current].color = '#2ecc71';
                this.graph.drawGraph();
                await this.delay();
            }
        }

        // Khôi phục màu sắc
        setTimeout(() => {
            this.graph.nodes.forEach(node => node.color = '#3498db');
            this.graph.drawGraph();
        }, 1000);

        return {
            traversal: result.map(id => this.graph.nodes[id].label),
            visited: visited
        };
    }

    // Tìm đường đi ngắn nhất (Dijkstra)
    async dijkstra(startNodeId, endNodeId) {
        if (this.graph.nodes.length === 0) {
            this.graph.showMessage("Đồ thị trống!");
            return null;
        }

        const startId = startNodeId !== undefined ? startNodeId : 0;
        const endId = endNodeId !== undefined ? endNodeId : this.graph.nodes.length - 1;
        
        const n = this.graph.nodes.length;
        const dist = new Array(n).fill(Infinity);
        const visited = new Array(n).fill(false);
        const prev = new Array(n).fill(-1);
        
        dist[startId] = 0;

        for (let i = 0; i < n; i++) {
            // Tìm đỉnh có khoảng cách nhỏ nhất chưa xét
            let u = -1;
            let minDist = Infinity;
            
            for (let j = 0; j < n; j++) {
                if (!visited[j] && dist[j] < minDist) {
                    minDist = dist[j];
                    u = j;
                }
            }

            if (u === -1) break;
            visited[u] = true;

            // Đánh dấu đỉnh đang xét
            this.graph.nodes[u].color = '#f39c12';
            this.graph.drawGraph();
            await this.delay();

            // Cập nhật khoảng cách cho các đỉnh kề
            const neighbors = this.getNeighborsWithWeights(u);
            for (const {node: v, weight} of neighbors) {
                if (!visited[v]) {
                    const alt = dist[u] + weight;
                    if (alt < dist[v]) {
                        dist[v] = alt;
                        prev[v] = u;
                        
                        // Đánh dấu cạnh đang xét
                        const edge = this.graph.edges.find(e => 
                            (e.from === u && e.to === v) || 
                            (!this.graph.isDirected && e.from === v && e.to === u));
                        if (edge) {
                            edge.color = '#e74c3c';
                            edge.highlighted = true;
                            this.graph.drawGraph();
                            await this.delay();
                            edge.color = '#2c3e50';
                            edge.highlighted = false;
                        }
                    }
                }
            }

            // Đánh dấu đỉnh đã xong
            this.graph.nodes[u].color = '#2ecc71';
            this.graph.drawGraph();
            await this.delay();
        }

        // Xây dựng đường đi
        const path = [];
        let current = endId;
        while (current !== -1) {
            path.unshift(current);
            current = prev[current];
        }

        // Tô màu đường đi ngắn nhất
        for (let i = 0; i < path.length - 1; i++) {
            const u = path[i];
            const v = path[i + 1];
            const edge = this.graph.edges.find(e => 
                (e.from === u && e.to === v) || 
                (!this.graph.isDirected && e.from === v && e.to === u));
            if (edge) {
                edge.color = '#e74c3c';
                edge.highlighted = true;
            }
            this.graph.nodes[u].color = '#9b59b6';
        }
        if (path.length > 0) {
            this.graph.nodes[path[path.length - 1]].color = '#9b59b6';
        }
        this.graph.drawGraph();

        return {
            distance: dist[endId],
            path: path.map(id => this.graph.nodes[id].label),
            distances: dist
        };
    }

    // Kiểm tra đồ thị 2 phía
    async checkBipartite() {
        if (this.graph.nodes.length === 0) {
            this.graph.showMessage("Đồ thị trống!");
            return null;
        }

        const n = this.graph.nodes.length;
        const colors = new Array(n).fill(-1); // -1: chưa tô màu, 0: màu 1, 1: màu 2
        let isBipartite = true;

        for (let i = 0; i < n && isBipartite; i++) {
            if (colors[i] === -1) {
                colors[i] = 0;
                this.graph.nodes[i].color = '#3498db';
                this.graph.drawGraph();
                await this.delay();

                const queue = [i];
                while (queue.length > 0 && isBipartite) {
                    const u = queue.shift();
                    const neighbors = this.getNeighbors(u);

                    for (const v of neighbors) {
                        if (colors[v] === -1) {
                            colors[v] = 1 - colors[u];
                            this.graph.nodes[v].color = colors[v] === 0 ? '#3498db' : '#e74c3c';
                            this.graph.drawGraph();
                            await this.delay();
                            queue.push(v);
                        } else if (colors[v] === colors[u]) {
                            isBipartite = false;
                            // Đánh dấu cạnh vi phạm
                            const edge = this.graph.edges.find(e => 
                                (e.from === u && e.to === v) || 
                                (!this.graph.isDirected && e.from === v && e.to === u));
                            if (edge) {
                                edge.color = '#e74c3c';
                                edge.highlighted = true;
                                this.graph.drawGraph();
                            }
                            break;
                        }
                    }
                }
            }
        }

        // Khôi phục màu sắc
        setTimeout(() => {
            this.graph.nodes.forEach(node => node.color = '#3498db');
            this.graph.edges.forEach(edge => {
                edge.color = '#2c3e50';
                edge.highlighted = false;
            });
            this.graph.drawGraph();
        }, 3000);

        return {
            isBipartite: isBipartite,
            partitions: isBipartite ? [
                this.graph.nodes.filter((_, i) => colors[i] === 0).map(n => n.label),
                this.graph.nodes.filter((_, i) => colors[i] === 1).map(n => n.label)
            ] : null
        };
    }

    // Thuật toán Prim (Cây khung nhỏ nhất)
    async prim() {
        if (this.graph.nodes.length === 0) {
            this.graph.showMessage("Đồ thị trống!");
            return null;
        }

        const n = this.graph.nodes.length;
        const inMST = new Array(n).fill(false);
        const key = new Array(n).fill(Infinity);
        const parent = new Array(n).fill(-1);
        
        key[0] = 0;
        const mstEdges = [];

        for (let count = 0; count < n; count++) {
            // Tìm đỉnh có key nhỏ nhất chưa trong MST
            let u = -1;
            let minKey = Infinity;
            
            for (let i = 0; i < n; i++) {
                if (!inMST[i] && key[i] < minKey) {
                    minKey = key[i];
                    u = i;
                }
            }

            if (u === -1) break;
            inMST[u] = true;

            // Thêm cạnh vào MST (trừ đỉnh đầu tiên)
            if (parent[u] !== -1) {
                mstEdges.push({ from: parent[u], to: u, weight: key[u] });
                
                // Đánh dấu cạnh trong MST
                const edge = this.graph.edges.find(e => 
                    (e.from === parent[u] && e.to === u) || 
                    (!this.graph.isDirected && e.from === u && e.to === parent[u]));
                if (edge) {
                    edge.color = '#2ecc71';
                    edge.highlighted = true;
                    this.graph.drawGraph();
                    await this.delay();
                }
            }

            // Đánh dấu đỉnh
            this.graph.nodes[u].color = '#f39c12';
            this.graph.drawGraph();
            await this.delay();
            this.graph.nodes[u].color = '#9b59b6';
            this.graph.drawGraph();

            // Cập nhật key cho các đỉnh kề
            const neighbors = this.getNeighborsWithWeights(u);
            for (const {node: v, weight} of neighbors) {
                if (!inMST[v] && weight < key[v]) {
                    parent[v] = u;
                    key[v] = weight;
                }
            }
        }

        const totalWeight = mstEdges.reduce((sum, edge) => sum + edge.weight, 0);

        return {
            mstEdges: mstEdges.map(edge => ({
                from: this.graph.nodes[edge.from].label,
                to: this.graph.nodes[edge.to].label,
                weight: edge.weight
            })),
            totalWeight: totalWeight
        };
    }

    // Thuật toán Kruskal (Cây khung nhỏ nhất)
    async kruskal() {
        if (this.graph.nodes.length === 0) {
            this.graph.showMessage("Đồ thị trống!");
            return null;
        }

        // Sắp xếp các cạnh theo trọng số
        const edges = [...this.graph.edges];
        edges.sort((a, b) => a.weight - b.weight);

        const n = this.graph.nodes.length;
        const parent = new Array(n);
        const rank = new Array(n).fill(0);
        
        for (let i = 0; i < n; i++) {
            parent[i] = i;
        }

        const mstEdges = [];
        let edgeCount = 0;

        for (const edge of edges) {
            if (edgeCount === n - 1) break;

            const root1 = this.find(parent, edge.from);
            const root2 = this.find(parent, edge.to);

            if (root1 !== root2) {
                mstEdges.push(edge);
                edgeCount++;

                // Đánh dấu cạnh trong MST
                edge.color = '#2ecc71';
                edge.highlighted = true;
                this.graph.drawGraph();
                await this.delay();

                // Union
                if (rank[root1] < rank[root2]) {
                    parent[root1] = root2;
                } else if (rank[root1] > rank[root2]) {
                    parent[root2] = root1;
                } else {
                    parent[root2] = root1;
                    rank[root1]++;
                }
            } else {
                // Đánh dấu cạnh bị bỏ qua
                edge.color = '#e74c3c';
                this.graph.drawGraph();
                await this.delay(200);
                edge.color = '#2c3e50';
                this.graph.drawGraph();
            }
        }

        // Đánh dấu các đỉnh
        this.graph.nodes.forEach((node, i) => {
            node.color = '#9b59b6';
        });
        this.graph.drawGraph();

        const totalWeight = mstEdges.reduce((sum, edge) => sum + edge.weight, 0);

        // Khôi phục màu sắc các cạnh
        setTimeout(() => {
            this.graph.edges.forEach(edge => {
                edge.color = '#2c3e50';
                edge.highlighted = false;
            });
            this.graph.nodes.forEach(node => node.color = '#3498db');
            this.graph.drawGraph();
        }, 3000);

        return {
            mstEdges: mstEdges.map(edge => ({
                from: this.graph.nodes[edge.from].label,
                to: this.graph.nodes[edge.to].label,
                weight: edge.weight
            })),
            totalWeight: totalWeight
        };
    }

    // Thuật toán Ford-Fulkerson (Luồng cực đại)
    async fordFulkerson(sourceId, sinkId) {
        if (this.graph.nodes.length === 0) {
            this.graph.showMessage("Đồ thị trống!");
            return null;
        }

        const source = sourceId !== undefined ? sourceId : 0;
        const sink = sinkId !== undefined ? sinkId : this.graph.nodes.length - 1;

        // Tạo ma trận dung lượng
        const n = this.graph.nodes.length;
        const capacity = Array(n).fill().map(() => Array(n).fill(0));
        
        for (const edge of this.graph.edges) {
            capacity[edge.from][edge.to] = edge.weight;
            if (!this.graph.isDirected) {
                capacity[edge.to][edge.from] = edge.weight;
            }
        }

        // Ma trận luồng
        const flow = Array(n).fill().map(() => Array(n).fill(0));
        let maxFlow = 0;

        while (true) {
            // Tìm đường tăng luồng bằng BFS
            const parent = new Array(n).fill(-1);
            const queue = [source];
            parent[source] = source;

            while (queue.length > 0) {
                const u = queue.shift();
                
                for (let v = 0; v < n; v++) {
                    if (parent[v] === -1 && capacity[u][v] > flow[u][v]) {
                        parent[v] = u;
                        queue.push(v);
                    }
                }
            }

            if (parent[sink] === -1) break; // Không tìm thấy đường tăng luồng

            // Tìm giá trị luồng tăng thêm
            let pathFlow = Infinity;
            for (let v = sink; v !== source; v = parent[v]) {
                const u = parent[v];
                pathFlow = Math.min(pathFlow, capacity[u][v] - flow[u][v]);
            }

            // Cập nhật luồng
            for (let v = sink; v !== source; v = parent[v]) {
                const u = parent[v];
                flow[u][v] += pathFlow;
                flow[v][u] -= pathFlow;

                // Đánh dấu cạnh
                const edge = this.graph.edges.find(e => 
                    (e.from === u && e.to === v) || (e.from === v && e.to === u));
                if (edge) {
                    edge.color = '#3498db';
                    edge.highlighted = true;
                    this.graph.drawGraph();
                    await this.delay(300);
                    edge.highlighted = false;
                }
            }

            maxFlow += pathFlow;
        }

        // Đánh dấu source và sink
        this.graph.nodes[source].color = '#2ecc71';
        this.graph.nodes[sink].color = '#e74c3c';
        this.graph.drawGraph();

        return {
            maxFlow: maxFlow,
            flowMatrix: flow
        };
    }

   // Thuật toán Fleury – tìm chu trình Euler (đồ thị vô hướng)
async fleury() {
    const n = this.graph.nodes.length;
    if (n === 0) {
        this.graph.showMessage("Đồ thị trống!");
        return null;
    }

    // 1. Tạo adjacency list
    const adj = Array.from({ length: n }, () => []);
    for (const e of this.graph.edges) {
        adj[e.from].push(e.to);
        adj[e.to].push(e.from);
    }

    // 2. Kiểm tra điều kiện Euler
    const odd = [];
    for (let i = 0; i < n; i++) {
        if (adj[i].length % 2 !== 0) odd.push(i);
    }

    if (odd.length !== 0 && odd.length !== 2) {
        this.graph.showMessage("Đồ thị không có chu trình Euler!");
        return null;
    }

    // 3. Chọn đỉnh bắt đầu
    let u = odd.length === 2 ? odd[0] : 0;
    const circuit = [];

    // 4. Fleury
    while (adj[u].length > 0) {
        let v = adj[u][0];

        for (const candidate of adj[u]) {
            if (
                adj[u].length === 1 ||
                !this.isBridgeFleury(u, candidate, adj)
            ) {
                v = candidate;
                break;
            }
        }

        // Xóa cạnh u - v
        adj[u].splice(adj[u].indexOf(v), 1);
        adj[v].splice(adj[v].indexOf(u), 1);

        circuit.push({ from: u, to: v });

        // Trực quan hóa
        const edge = this.graph.edges.find(e =>
            (e.from === u && e.to === v) ||
            (e.from === v && e.to === u)
        );
        if (edge) {
            edge.color = "#9b59b6";
            edge.highlighted = true;
            this.graph.drawGraph();
            await this.delay(500);
        }

        u = v;
    }

    return {
        hasEulerCircuit: odd.length === 0,
        eulerCircuit: circuit.map(e => ({
            from: this.graph.nodes[e.from].label,
            to: this.graph.nodes[e.to].label
        }))
    };
}
isBridgeFleury(u, v, adj) {
    // Nếu chỉ còn 1 cạnh thì không coi là cầu
    if (adj[u].length === 1) return false;

    const visited = new Array(adj.length).fill(false);

    const dfs = (x) => {
        visited[x] = true;
        for (const y of adj[x]) {
            if (!visited[y]) dfs(y);
        }
    };

    // Số đỉnh reachable trước khi xóa
    dfs(u);
    const count1 = visited.filter(x => x).length;

    // Tạm xóa cạnh
    adj[u].splice(adj[u].indexOf(v), 1);
    adj[v].splice(adj[v].indexOf(u), 1);

    visited.fill(false);
    dfs(u);
    const count2 = visited.filter(x => x).length;

    // Khôi phục cạnh
    adj[u].push(v);
    adj[v].push(u);

    // Nếu giảm số đỉnh reachable → là cầu
    return count2 < count1;
}


    // Thuật toán Hierholzer (Tìm chu trình Euler)
    async hierholzer() {
        if (this.graph.nodes.length === 0) {
            this.graph.showMessage("Đồ thị trống!");
            return null;
        }

        // Tạo danh sách kề
        const adjList = Array(this.graph.nodes.length).fill().map(() => []);
        for (const edge of this.graph.edges) {
            adjList[edge.from].push(edge.to);
            if (!this.graph.isDirected) {
                adjList[edge.to].push(edge.from);
            }
        }

        // Kiểm tra điều kiện Euler
        let startNode = 0;
        let oddCount = 0;
        for (let i = 0; i < adjList.length; i++) {
            if (adjList[i].length % 2 !== 0) {
                oddCount++;
                startNode = i;
            }
        }

        if (oddCount > 2) {
            this.graph.showMessage("Đồ thị không có chu trình Euler!");
            return null;
        }

        // Tìm chu trình Euler
        const circuit = [];
        const stack = [startNode];
        const edgeVisited = new Set();

        while (stack.length > 0) {
            const u = stack[stack.length - 1];

            if (adjList[u].length > 0) {
                const v = adjList[u].shift();
                const reverseIndex = adjList[v].indexOf(u);
                if (reverseIndex !== -1) {
                    adjList[v].splice(reverseIndex, 1);
                }

                // Đánh dấu cạnh
                const edge = this.graph.edges.find(e => 
                    (e.from === u && e.to === v) || (e.from === v && e.to === u));
                if (edge && !edgeVisited.has(`${u}-${v}`) && !edgeVisited.has(`${v}-${u}`)) {
                    edge.color = '#9b59b6';
                    edge.highlighted = true;
                    this.graph.drawGraph();
                    await this.delay(300);
                    edgeVisited.add(`${u}-${v}`);
                }

                stack.push(v);
            } else {
                circuit.push(stack.pop());
            }
        }

        circuit.reverse();

        return {
            eulerCircuit: circuit.map(id => this.graph.nodes[id].label),
            hasEulerCircuit: oddCount === 0
        };
    }

    // Hàm trợ giúp
    getNeighbors(nodeId) {
        const neighbors = [];
        for (const edge of this.graph.edges) {
            if (edge.from === nodeId) {
                neighbors.push(edge.to);
            }
            if (!this.graph.isDirected && edge.to === nodeId) {
                neighbors.push(edge.from);
            }
        }
        return [...new Set(neighbors)]; // Loại bỏ trùng lặp
    }

    getNeighborsWithWeights(nodeId) {
        const neighbors = [];
        for (const edge of this.graph.edges) {
            if (edge.from === nodeId) {
                neighbors.push({ node: edge.to, weight: edge.weight });
            }
            if (!this.graph.isDirected && edge.to === nodeId) {
                neighbors.push({ node: edge.from, weight: edge.weight });
            }
        }
        return neighbors;
    }

    find(parent, i) {
        if (parent[i] !== i) {
            parent[i] = this.find(parent, parent[i]);
        }
        return parent[i];
    }

    isBridge(u, v, edgeCount) {
        // Đếm số đỉnh có thể đến từ u sau khi xóa cạnh u-v
        const visited = new Array(this.graph.nodes.length).fill(false);
        const stack = [u];
        visited[u] = true;
        let count1 = 0;

        while (stack.length > 0) {
            const node = stack.pop();
            count1++;

            for (let i = 0; i < this.graph.nodes.length; i++) {
                const key = `${Math.min(node, i)}-${Math.max(node, i)}`;
                if (!visited[i] && (edgeCount.get(key) || 0) > 0) {
                    visited[i] = true;
                    stack.push(i);
                }
            }
        }

        // Xóa cạnh u-v
        const key = `${Math.min(u, v)}-${Math.max(u, v)}`;
        edgeCount.set(key, edgeCount.get(key) - 1);

        // Đếm lại
        visited.fill(false);
        stack.length = 0;
        stack.push(u);
        visited[u] = true;
        let count2 = 0;

        while (stack.length > 0) {
            const node = stack.pop();
            count2++;

            for (let i = 0; i < this.graph.nodes.length; i++) {
                const key = `${Math.min(node, i)}-${Math.max(node, i)}`;
                if (!visited[i] && (edgeCount.get(key) || 0) > 0) {
                    visited[i] = true;
                    stack.push(i);
                }
            }
        }

        // Khôi phục cạnh
        edgeCount.set(key, edgeCount.get(key) + 1);

        return count1 > count2;
    }

    delay(ms) {
        if (!document.getElementById('animateAlgo').checked) {
            return Promise.resolve();
        }
        const speed = 600 - (this.graph.animationSpeed * 50);
        return new Promise(resolve => setTimeout(resolve, ms || speed));
    }
}

// Thêm các phương thức vào GraphVisualizer
GraphVisualizer.prototype.runBFS = async function() {
    this.clearOutput();
    this.showMessage("Đang chạy BFS...");
    
    const algorithms = new GraphAlgorithms(this);
    const result = await algorithms.bfs();
    
    if (result) {
        const output = `<h3>Kết quả duyệt BFS</h3>
                      <p>Thứ tự duyệt: ${result.traversal.join(' → ')}</p>
                      <p>Số đỉnh đã duyệt: ${result.traversal.length}</p>`;
        document.getElementById('outputContent').innerHTML = output;
        this.showMessage("Hoàn thành BFS");
    }
};

GraphVisualizer.prototype.runDFS = async function() {
    this.clearOutput();
    this.showMessage("Đang chạy DFS...");
    
    const algorithms = new GraphAlgorithms(this);
    const result = await algorithms.dfs();
    
    if (result) {
        const output = `<h3>Kết quả duyệt DFS</h3>
                      <p>Thứ tự duyệt: ${result.traversal.join(' → ')}</p>
                      <p>Số đỉnh đã duyệt: ${result.traversal.length}</p>`;
        document.getElementById('outputContent').innerHTML = output;
        this.showMessage("Hoàn thành DFS");
    }
};

GraphVisualizer.prototype.runShortestPath = async function() {
    this.clearOutput();
    this.showMessage("Đang tìm đường đi ngắn nhất...");
    
    // Yêu cầu người dùng chọn đỉnh bắt đầu và kết thúc
    const startLabel = prompt("Nhập đỉnh bắt đầu (ví dụ: A):", "A");
    const endLabel = prompt("Nhập đỉnh kết thúc (ví dụ: E):", 
                           this.nodes.length > 0 ? this.nodes[this.nodes.length - 1].label : "E");
    
    const startNode = this.nodes.find(n => n.label === startLabel);
    const endNode = this.nodes.find(n => n.label === endLabel);
    
    if (!startNode || !endNode) {
        this.showMessage("Đỉnh không hợp lệ!");
        return;
    }
    
    const algorithms = new GraphAlgorithms(this);
    const result = await algorithms.dijkstra(startNode.id, endNode.id);
    
    if (result) {
        const output = `<h3>Đường đi ngắn nhất từ ${startLabel} đến ${endLabel}</h3>
                      <p>Khoảng cách: ${result.distance === Infinity ? 'Không đến được' : result.distance}</p>
                      <p>Đường đi: ${result.path.join(' → ')}</p>`;
        document.getElementById('outputContent').innerHTML = output;
        this.showMessage("Hoàn thành tìm đường đi ngắn nhất");
    }
};

GraphVisualizer.prototype.checkBipartite = async function() {
    this.clearOutput();
    this.showMessage("Đang kiểm tra đồ thị 2 phía...");
    
    const algorithms = new GraphAlgorithms(this);
    const result = await algorithms.checkBipartite();
    
    if (result) {
        let output = `<h3>Kiểm tra đồ thị 2 phía</h3>`;
        
        if (result.isBipartite) {
            output += `<p class="success">✓ Đồ thị là đồ thị 2 phía</p>
                      <p>Tập 1: {${result.partitions[0].join(', ')}}</p>
                      <p>Tập 2: {${result.partitions[1].join(', ')}}</p>`;
        } else {
            output += `<p class="error">✗ Đồ thị không phải là đồ thị 2 phía</p>`;
        }
        
        document.getElementById('outputContent').innerHTML = output;
        this.showMessage("Hoàn thành kiểm tra đồ thị 2 phía");
    }
};

GraphVisualizer.prototype.runAdvancedAlgorithm = async function(algoName) {
    this.clearOutput();
    
    const algorithms = new GraphAlgorithms(this);
    let result = null;
    
    switch (algoName) {
        case 'prim':
            this.showMessage("Đang chạy thuật toán Prim...");
            result = await algorithms.prim();
            break;
            
        case 'kruskal':
            this.showMessage("Đang chạy thuật toán Kruskal...");
            result = await algorithms.kruskal();
            break;
            
        case 'fordFulkerson':
            this.showMessage("Đang chạy thuật toán Ford-Fulkerson...");
            const sourceLabel = prompt("Nhập đỉnh nguồn (source):", "A");
            const sinkLabel = prompt("Nhập đỉnh đích (sink):", 
                                   this.nodes.length > 0 ? this.nodes[this.nodes.length - 1].label : "E");
            const sourceNode = this.nodes.find(n => n.label === sourceLabel);
            const sinkNode = this.nodes.find(n => n.label === sinkLabel);
            
            if (sourceNode && sinkNode) {
                result = await algorithms.fordFulkerson(sourceNode.id, sinkNode.id);
            }
            break;
            
        case 'fleury':
            this.showMessage("Đang chạy thuật toán Fleury...");
            result = await algorithms.fleury();
            break;
            
        case 'hierholzer':
            this.showMessage("Đang chạy thuật toán Hierholzer...");
            result = await algorithms.hierholzer();
            break;
            
        default:
            this.showMessage("Vui lòng chọn thuật toán!");
            return;
    }
    
    if (result) {
        this.displayAlgorithmResult(algoName, result);
    }
};

GraphVisualizer.prototype.displayAlgorithmResult = function(algoName, result) {
    let output = '';
    
    switch (algoName) {
        case 'prim':
        case 'kruskal':
            output = `<h3>Kết quả thuật toán ${algoName === 'prim' ? 'Prim' : 'Kruskal'}</h3>
                     <p>Tổng trọng số: ${result.totalWeight}</p>
                     <p>Các cạnh trong cây khung nhỏ nhất:</p>
                     <ul>`;
            result.mstEdges.forEach(edge => {
                output += `<li>${edge.from} - ${edge.to} (${edge.weight})</li>`;
            });
            output += `</ul>`;
            break;
            
        case 'fordFulkerson':
            output = `<h3>Kết quả thuật toán Ford-Fulkerson</h3>
                     <p>Luồng cực đại: ${result.maxFlow}</p>`;
            break;
            
        case 'fleury':
        case 'hierholzer':
            const algoTitle = algoName === 'fleury' ? 'Fleury' : 'Hierholzer';
            output = `<h3>Kết quả thuật toán ${algoTitle}</h3>`;
            if (result.hasEulerCircuit) {
                output += `<p>Đồ thị có chu trình Euler</p>`;
                if (algoName === 'fleury') {
                    output += `<p>Chu trình Euler: `;
                    result.eulerCircuit.forEach((edge, i) => {
                        if (i > 0) output += ' → ';
                        output += `${edge.from}-${edge.to}`;
                    });
                    output += `</p>`;
                } else {
                    output += `<p>Chu trình Euler: ${result.eulerCircuit.join(' → ')}</p>`;
                }
            } else {
                output += `<p>Đồ thị có đường đi Euler (không có chu trình Euler)</p>`;
            }
            break;
    }
    
    document.getElementById('outputContent').innerHTML = output;
    this.showMessage(`Hoàn thành thuật toán ${algoName}`);
};

GraphVisualizer.prototype.showAdjacencyMatrix = function() {
    const n = this.nodes.length;
    const matrix = Array(n).fill().map(() => Array(n).fill(0));
    
    for (const edge of this.edges) {
        matrix[edge.from][edge.to] = edge.weight;
        if (!this.isDirected) {
            matrix[edge.to][edge.from] = edge.weight;
        }
    }
    
    let matrixStr = "Ma trận kề:\n";
    matrixStr += "   " + this.nodes.map(n => n.label).join(" ") + "\n";
    
    for (let i = 0; i < n; i++) {
        matrixStr += this.nodes[i].label + "  " + matrix[i].join(" ") + "\n";
    }
    
    document.getElementById('representationContent').textContent = matrixStr;
    this.showMessage("Đã hiển thị ma trận kề");
};

GraphVisualizer.prototype.showAdjacencyList = function() {
    const adjList = {};
    
    for (const node of this.nodes) {
        adjList[node.label] = [];
    }
    
    for (const edge of this.edges) {
        const fromLabel = this.nodes[edge.from].label;
        const toLabel = this.nodes[edge.to].label;
        
        adjList[fromLabel].push(`${toLabel}(${edge.weight})`);
        if (!this.isDirected) {
            adjList[toLabel].push(`${fromLabel}(${edge.weight})`);
        }
    }
    
    let listStr = "Danh sách kề:\n";
    for (const nodeLabel in adjList) {
        listStr += `${nodeLabel}: ${adjList[nodeLabel].join(", ")}\n`;
    }
    
    document.getElementById('representationContent').textContent = listStr;
    this.showMessage("Đã hiển thị danh sách kề");
};

GraphVisualizer.prototype.showEdgeList = function() {
    let edgeStr = "Danh sách cạnh:\n";
    
    for (const edge of this.edges) {
        const fromLabel = this.nodes[edge.from].label;
        const toLabel = this.nodes[edge.to].label;
        const direction = this.isDirected ? "→" : "-";
        edgeStr += `${fromLabel} ${direction} ${toLabel} (${edge.weight})\n`;
    }
    
    document.getElementById('representationContent').textContent = edgeStr;
    this.showMessage("Đã hiển thị danh sách cạnh");
};

GraphVisualizer.prototype.showAlgorithmInfo = function(algoName) {
    const infoDiv = document.getElementById('algorithmInfo');
    
    const infoMap = {
        'prim': {
            title: 'Thuật toán Prim',
            description: 'Tìm cây khung nhỏ nhất (Minimum Spanning Tree - MST). Thuật toán tham lam, bắt đầu từ một đỉnh và mở rộng dần bằng cách thêm cạnh có trọng số nhỏ nhất nối với cây hiện tại.',
            complexity: 'Độ phức tạp: O(E log V) với hàng đợi ưu tiên'
        },
        'kruskal': {
            title: 'Thuật toán Kruskal',
            description: 'Tìm cây khung nhỏ nhất. Sắp xếp các cạnh theo trọng số, thêm từng cạnh vào MST nếu không tạo chu trình (sử dụng Union-Find).',
            complexity: 'Độ phức tạp: O(E log E)'
        },
        'fordFulkerson': {
            title: 'Thuật toán Ford-Fulkerson',
            description: 'Tìm luồng cực đại trong mạng. Sử dụng đường tăng luồng (augmenting path) cho đến khi không còn đường tăng.',
            complexity: 'Độ phức tạp: O(E * max_flow)'
        },
        'fleury': {
            title: 'Thuật toán Fleury',
            description: 'Tìm chu trình Euler trong đồ thị Euler. Tránh xóa cầu (bridge) cho đến khi không còn lựa chọn nào khác.',
            complexity: 'Độ phức tạp: O(E²)'
        },
        'hierholzer': {
            title: 'Thuật toán Hierholzer',
            description: 'Tìm chu trình Euler hiệu quả hơn Fleury. Sử dụng DFS và nối các chu trình con.',
            complexity: 'Độ phức tạp: O(E)'
        }
    };
    
    if (algoName && infoMap[algoName]) {
        const info = infoMap[algoName];
        infoDiv.innerHTML = `<h4>${info.title}</h4>
                           <p>${info.description}</p>
                           <p><strong>${info.complexity}</strong></p>`;
    } else {
        infoDiv.innerHTML = `<p>Chọn một thuật toán để xem thông tin chi tiết.</p>`;
    }
};

GraphVisualizer.prototype.saveGraph = function() {
    const graphData = {
        name: this.graphName,
        nodes: this.nodes,
        edges: this.edges,
        isDirected: this.isDirected,
        createdAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(graphData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `graph_${new Date().getTime()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    this.showMessage("Đã lưu đồ thị thành file JSON");
};

GraphVisualizer.prototype.loadGraph = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const graphData = JSON.parse(e.target.result);
            
            this.nodes = graphData.nodes;
            this.edges = graphData.edges;
            this.isDirected = graphData.isDirected || false;
            this.graphName = graphData.name || "Đồ thị đã tải";
            
            // Cập nhật nút chuyển đổi
            const btn = document.getElementById('directedToggle');
            btn.innerHTML = this.isDirected ? 
                '<i class="fas fa-arrow-right"></i> Có hướng' : 
                '<i class="fas fa-arrow-right"></i> Vô hướng';
            
            this.drawGraph();
            this.updateStats();
            this.showMessage(`Đã tải đồ thị: ${this.graphName}`);
            
            // Xóa file input để có thể tải lại cùng file
            event.target.value = '';
        } catch (error) {
            this.showMessage("Lỗi khi tải file: " + error.message);
        }
    };
    reader.readAsText(file);
};

GraphVisualizer.prototype.clearOutput = function() {
    document.getElementById('outputContent').innerHTML = "<p>Kết quả thuật toán sẽ hiển thị ở đây...</p>";
};

// Khởi tạo ứng dụng khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    window.graphApp = new GraphVisualizer();
    
    // Hiển thị thông tin thuật toán mặc định
    graphApp.showAlgorithmInfo('');
});
