const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Cell size and state
const CELL_SIZE = 10;
let grid = [];
let cols, rows;
let lastUpdate = 0;
const UPDATE_INTERVAL = 500

// Theme colors
const COLORS = {
    level0: '#9be9a8',
    level1: '#40c463',
    level2: '#30a14e',
    level3: '#216e39'
};

// Initialize canvas size and grid
function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    cols = Math.floor(canvas.width / CELL_SIZE);
    rows = Math.floor(canvas.height / CELL_SIZE);

    // Create random initial state
    grid = Array(cols).fill().map(() => 
        Array(rows).fill().map(() => Math.random() > 0.7)
    );
}

// Calculate next generation
function nextGen() {
    const next = grid.map(arr => [...arr]);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let neighbors = countNeighbors(i, j);
            
            if (grid[i][j] && (neighbors < 2 || neighbors > 3)) {
                next[i][j] = false;
            } else if (!grid[i][j] && neighbors === 3) {
                next[i][j] = true;
            }
        }
    }

    grid = next;
}

// Count neighbors for a cell
function countNeighbors(x, y) {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let col = (x + i + cols) % cols;
            let row = (y + j + rows) % rows;
            sum += grid[col][row] ? 1 : 0;
        }
    }
    return sum - (grid[x][y] ? 1 : 0);
}

// Draw the grid
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (grid[i][j]) {
                const neighbors = countNeighbors(i, j);
                ctx.beginPath();
                
                // Set color based on neighbor count
                if (neighbors <= 2) ctx.fillStyle = COLORS.level0;
                else if (neighbors == 3) ctx.fillStyle = COLORS.level1;
                else if (neighbors == 4) ctx.fillStyle = COLORS.level2;
                else ctx.fillStyle = COLORS.level3;

                ctx.roundRect(
                    i * CELL_SIZE, 
                    j * CELL_SIZE, 
                    CELL_SIZE - 1, 
                    CELL_SIZE - 1,
                    2
                );
                ctx.fill();
            }
        }
    }
}

// Animation loop with time control
function animate(timestamp) {
    if (timestamp - lastUpdate >= UPDATE_INTERVAL) {
        nextGen();
        draw();
        lastUpdate = timestamp;
    }
    requestAnimationFrame(animate);
}

// Handle window resize
window.addEventListener('resize', init);

// Start the game
init();
draw();
requestAnimationFrame(animate);
