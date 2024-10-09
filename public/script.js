let array = [];

// Button event listeners for visualizations
document.getElementById('nQueensButton').addEventListener('click', showNQueens);
document.getElementById('mergeSortButton').addEventListener('click', showSorting);
document.getElementById('quickSortButton').addEventListener('click', showSorting);

// N-Queens Event listeners
document.getElementById('generateButton').addEventListener('click', function () {
    const size = parseInt(document.getElementById('sizeInput').value);
    if (size > 0) {
        generateBoard(size);
        document.getElementById('solveButton').style.display = 'block';
        document.getElementById('solveButton').onclick = () => solveAndAnimate(size);
    } else {
        alert("Please enter a valid size.");
    }
});

// Sorting Event Listeners
document.getElementById('generateArray').addEventListener('click', generateRandomArray);
document.getElementById('startMergeSort').addEventListener('click', mergeSort);
document.getElementById('startQuickSort').addEventListener('click', quickSort);

// Show N-Queens controls and hide sorting
function showNQueens() {
    document.getElementById('nQueensControls').style.display = 'block';
    document.getElementById('arrayControls').style.display = 'none';
}

// Show sorting controls and hide N-Queens
function showSorting() {
    document.getElementById('nQueensControls').style.display = 'none';
    document.getElementById('arrayControls').style.display = 'block';
}

// N-Queens Functions
function generateBoard(size) {
    const board = document.getElementById('board');
    board.innerHTML = ''; // Clear previous board
    board.style.height = size * 50 + 'px';
    board.style.width = size * 50 + 'px';
    board.style.gridTemplateColumns = `repeat(${size}, 50px)`;
    board.style.gridTemplateRows = `repeat(${size}, 50px)`;

    for (let i = 0; i < size * size; i++) {
        const square = document.createElement('div');
        square.classList.add('square');
        const row = Math.floor(i / size);
        const col = i % size;
        if ((row + col) % 2 === 0) {
            square.classList.add('white');
        } else {
            square.classList.add('black');
        }
        board.appendChild(square);
    }
}

async function solveAndAnimate(size) {
    const board = Array.from({ length: size }, () => Array(size).fill(0));
    await placeQueens(board, 0);
}

async function placeQueens(board, row) {
    if (row === board.length) {
        await visualizeBoard(board); // Show final configuration
        return;
    }

    for (let col = 0; col < board.length; col++) {
        await highlightCurrentColumn(row, col); // Blue for current square

        if (isSafe(board, row, col)) {
            board[row][col] = 1; // Place a queen
            await visualizeBoard(board); // Show queen placement
            await placeQueens(board, row + 1); // Recursion to next row
            
            board[row][col] = 0; // Backtrack
            await visualizeBoard(board); // Show after backtrack
        } else {
            await highlightConflict(row, col); // Yellow for conflict
        }
    }
}

function isSafe(board, row, col) {
    for (let i = 0; i < row; i++) {
        if (board[i][col] === 1) return false; // Check column
        if (col - (row - i) >= 0 && board[i][col - (row - i)] === 1) return false; // Check upper left diagonal
        if (col + (row - i) < board.length && board[i][col + (row - i)] === 1) return false; // Check upper right diagonal
    }
    return true;
}

async function highlightCurrentColumn(row, col) {
    const squares = document.querySelectorAll('.square');
    const index = row * Math.sqrt(squares.length) + col;
    squares[index].classList.add('current'); // Blue highlight

    await new Promise(resolve => setTimeout(resolve, 500)); // Delay for effect

    squares[index].classList.remove('current'); // Remove highlight
}

async function highlightConflict(row, col) {
    const squares = document.querySelectorAll('.square');
    const index = row * Math.sqrt(squares.length) + col;
    squares[index].classList.add('visited'); // Yellow highlight for conflict

    await new Promise(resolve => setTimeout(resolve, 500)); // Delay for effect

    squares[index].classList.remove('visited'); // Remove highlight
}

async function visualizeBoard(board) {
    const squares = document.querySelectorAll('.square');

    // Clear all squares
    squares.forEach(square => {
        square.classList.remove('queen', 'current', 'visited');
    });

    // Highlight the queens
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board.length; col++) {
            if (board[row][col] === 1) {
                const index = row * board.length + col;
                squares[index].classList.add('queen'); // Red for queen
            }
        }
    }

    await new Promise(resolve => setTimeout(resolve, 1000)); // Delay for visualization
}

// Sorting Functions
function generateRandomArray() {
    array = Array.from({ length: 8}, () => Math.floor(Math.random() * 100) + 1);
    displayArray();
}

// Display the array as bars with numbers
function displayArray() {
    const container = document.getElementById('arrayContainer');
    container.innerHTML = ''; // Clear previous bars
    array.forEach(value => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${value * 3}px`; // Scale height for visibility

        // Create a label for the number
        const label = document.createElement('span');
        label.textContent = value;
        bar.appendChild(label); // Add the label to the bar
        container.appendChild(bar); // Add the bar to the container
    });
}

// Merge Sort
async function mergeSort() {
    await mergeSortHelper(array, 0, array.length - 1);
    displayArray();
}

// Merge Sort Helper Function
async function mergeSortHelper(arr, left, right) {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);
    await mergeSortHelper(arr, left, mid);
    await mergeSortHelper(arr, mid + 1, right);
    await merge(arr, left, mid, right);
}

// Merge Function
async function merge(arr, left, mid, right) {
    const leftArray = arr.slice(left, mid + 1);
    const rightArray = arr.slice(mid + 1, right + 1);
    let leftIndex = 0;
    let rightIndex = 0;
    let mainIndex = left;

    while (leftIndex < leftArray.length && rightIndex < rightArray.length) {
        if (leftArray[leftIndex] <= rightArray[rightIndex]) {
            arr[mainIndex] = leftArray[leftIndex];
            leftIndex++;
        } else {
            arr[mainIndex] = rightArray[rightIndex];
            rightIndex++;
        }
        mainIndex++;
        displayArray();
        await new Promise(resolve => setTimeout(resolve, 300)); // Increased delay for visualization
    }

    while (leftIndex < leftArray.length) {
        arr[mainIndex] = leftArray[leftIndex];
        leftIndex++;
        mainIndex++;
        displayArray();
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    while (rightIndex < rightArray.length) {
        arr[mainIndex] = rightArray[rightIndex];
        rightIndex++;
        mainIndex++;
        displayArray();
        await new Promise(resolve => setTimeout(resolve, 300));
    }
}

// Quick Sort
// async function quickSort() {
//     await quickSortHelper(array, 0, array.length - 1);
//     displayArray();
// }

// // Quick Sort Helper Function
// async function quickSortHelper(arr, left, right) {
//     if (left < right) {
//         const pivotIndex = await partition(arr, left, right);
//         await quickSortHelper(arr, left, pivotIndex - 1);
//         await quickSortHelper(arr, pivotIndex + 1, right);
//     }
// }

// // Partition Function
// async function partition(arr, left, right) {
//     const pivotValue = arr[right];
//     let pivotIndex = left;

//     for (let i = left; i < right; i++) {
//         if (arr[i] < pivotValue) {
//             [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
//             pivotIndex++;
//             displayArray();
//             await new Promise(resolve => setTimeout(resolve, 1000)); // Increased delay for visualization
//         }
//     }
//     [arr[pivotIndex], arr[right]] = [arr[right], arr[pivotIndex]];
//     displayArray();
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     return pivotIndex;
// }
async function quickSort() {
    await quickSortHelper(array, 0, array.length - 1);
    displayArray();
}

// Quick Sort Helper Function
async function quickSortHelper(arr, left, right) {
    if (left < right) {
        const pivotIndex = await partition(arr, left, right);
        await quickSortHelper(arr, left, pivotIndex - 1);
        await quickSortHelper(arr, pivotIndex + 1, right);
    }
}

// Partition Function
async function partition(arr, left, right) {
    const pivotValue = arr[right]; // Choose the rightmost element as pivot
    let pivotIndex = left; // Start with the leftmost index

    for (let i = left; i < right; i++) {
        if (arr[i] < pivotValue) { // If current element is less than the pivot
            [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]]; // Swap elements
            displayArray(); // Update the display after the swap
            await new Promise(resolve => setTimeout(resolve, 1000)); // Delay after each swap
            pivotIndex++; // Move the pivot index to the right
        }
    }
    
    // Swap the pivot with the element at pivotIndex
    [arr[pivotIndex], arr[right]] = [arr[right], arr[pivotIndex]];
    displayArray(); // Update the display after swapping the pivot
    await new Promise(resolve => setTimeout(resolve, 1000)); // Delay after swapping the pivot
    return pivotIndex; // Return the new pivot index
}
