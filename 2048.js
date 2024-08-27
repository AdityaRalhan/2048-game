let board;
let score = 0;
let rows = 4;
let columns = 4;
let gameOver = false; 

window.onload = function(){
    setGame();
}

function setGame(){
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    // board = [
    //     [2, 4, 128, 256],
    //     [4, 2, 8, 512],
    //     [8, 4, 2, 1024],
    //     [4, 16, 1024, 8]
    // ];

    for(let r=0; r<rows; r++){
        for(let c=0; c<columns; c++){
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    setTwo();
    setTwo();
}

function hasEmptyTile(){
    for (let r = 0; r<rows; r++){
        for (let c = 0; c<columns; c++){
            if (board[r][c] == 0){
                return true;
            }
        }
    }
    return false;
}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }

    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if (board[r][c] === 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            if (tile) {
                updateTile(tile, 2); 
            } else {
                tile = document.createElement("div");
                tile.id = r.toString() + "-" + c.toString();
                updateTile(tile, 2);
                document.getElementById("board").appendChild(tile); 
            }
            found = true;
        }
    }
}

function updateTile(tile, num){
    tile.innerText = "";
    tile.className = ""; 
    tile.classList.add("tile");

    if (num >= 2){
        tile.innerText = num;
        if (num <= 2048){
            tile.classList.add("n" + num.toString()); // class to add that css style
        } else {
            tile.classList.add("default");
        }
    }
}

document.addEventListener("keyup", (e) => {
    if (gameOver) return; 
    
    if (gameOver == false){
        checkForWinner();
    }

    if(e.code === "ArrowLeft"){
        leftClick();
        setTwo();
    }
    else if(e.code === "ArrowRight"){
        rightClick();
        setTwo();
    }
    else if(e.code === "ArrowUp"){
        slideUp();
        setTwo();
    }
    else if(e.code === "ArrowDown"){
        slideDown();
        setTwo();
    }

    document.getElementById("score").innerText = score;

    if (isGameOver()) {
        displayOver();
    }
});

function filterZero(row){
    return row.filter(num => num !== 0);
}

function slideLeft(row){
    row = filterZero(row); // get rid of the zeros

    // slide and merge
    for (let i = 0; i < row.length - 1; i++){
        if(row[i] === row[i + 1]){
            row[i] = row[i] * 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }

    row = filterZero(row);

    // add zeros back
    while (row.length < columns){
        row.push(0);
    }

    return row;
}

function slideRight(row){
    row = filterZero(row); // Remove zeros

    // Merge tiles
    for (let i = row.length - 1; i > 0; i--){
        if(row[i] === row[i - 1]){
            row[i] = row[i] * 2;
            row[i - 1] = 0;
            score += row[i];
        }
    }

    row = filterZero(row);

    // Add zeros back
    while (row.length < columns){
        row.unshift(0);
    }

    return row;
}

function leftClick(){
    for (let r = 0; r < rows; r++){
        let row = board[r];
        row = slideLeft(row);
        board[r] = row;

        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function rightClick(){
    for (let r = 0; r < rows; r++){
        let row = board[r]; // full array of row
        row = slideRight(row);
        board[r] = row; // reassign new value

        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp(){
    for (let c = 0; c < columns; c++){
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slideLeft(row);

        board[0][c] = row[0];
        board[1][c] = row[1];
        board[2][c] = row[2];
        board[3][c] = row[3];

        for (let r = 0; r < rows; r++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown(){
    for (let c = 0; c < columns; c++){
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slideLeft(row);
        row.reverse();

        board[0][c] = row[0];
        board[1][c] = row[1];
        board[2][c] = row[2];
        board[3][c] = row[3];

        for (let r = 0; r < rows; r++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function isGameOver() {
    // Checking for any empty tiles
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) {
                return false; // Game is not over, empty tile exists
            }
        }
    }

    // even if no empty tiles

    // Check for rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 1; c++) {
            if (board[r][c] === board[r][c + 1]) {
                return false;
            }
        }
    }

    // Check for columns
    for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === board[r + 1][c]) {
                return false; 
            }
        }
    }

    return true; //game over
}


function displayOver(){
    if (gameOver) return; // Avoid multiple calls

    gameOver = true; // Set the game-over flag

    let over = document.createElement("div");
    over.id = "gameover";
    over.textContent = "Game Over!";

    document.body.appendChild(over);
}

function checkForWinner() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 2048) {
                displayWin();
                return true;
            }
        }
    }
    return false;
}

function displayWin() {
    if (gameOver) return;

    gameOver = true;

    let win = document.createElement("div");
    win.id = "win";
    win.textContent = "You Win!";

    document.body.appendChild(win);
}
