
(function() {
    var game_grid = document.getElementById("game_grid");

    // configuration
    const WIDTH     = 20;
    const HEIGHT    = 12;
    const NBR_MINES = 50;

    var has_started = false;
    var game_state  = [];


    function setupGrid() {
        game_grid.style.gridTemplate = "repeat(" + HEIGHT + ", auto) / repeat(" + WIDTH + ", auto)";

        for (let i = 0; i < HEIGHT; i++) {
            var row = []

            for (let j = 0; j < WIDTH; j++) {
                const cell = document.createElement("div");
                cell.style.gridColumn = j+1;

                game_grid.appendChild(cell);
                row.push({ value: 0, hidden: true });
            }

            game_state.push(row);
        }
    }


    function randomDistribute() {
        var nbr_mines = 0;
        var nbr_free  = HEIGHT*WIDTH;
        var get_mines = false;
        let i         = 0;
        let j         = 0;

    
        // To try to randomize the spread of the mines
        // I try to make my own simple algorithm as it is a learning exercice, but using a shuffling function would have
        //   had a better result 
        while ((nbr_mines < NBR_MINES) && (i < HEIGHT)) {
            j = 0;
            while ((nbr_mines < NBR_MINES) && (j < WIDTH)) {
                if (nbr_mines < nbr_free) {
                    get_mines = Math.floor(Math.random() * nbr_free) < (NBR_MINES - nbr_mines);
                } else {
                    get_mines = true;
                }

                if (get_mines) {
                    game_state[i][j].value = -1;
                    nbr_mines++;
                }

                get_mines = false;
                nbr_free--;
                j++;
            }
            i++;
        }
    }
    function randomShift() {
        // offset
        // I added this step to have it " more random ", ie move the big series of 0s at the end
        const offset = Math.floor(Math.random() * HEIGHT*WIDTH / 2) + 3;

        for (let i = 0; i <= offset; i++) {
            const first = game_state.shift();
            game_state.push(first);
        }
    }
    function computePosition() {
        // To have both the html cells element and the game_state matrix cells know the positions of each other
        // We can't compute it before because of the randomShift() function
        var node = game_grid.firstElementChild;

        for (let i = 0; i < HEIGHT; i++) {
            for (let j = 0; j < WIDTH; j++) {
                node.col = i;
                node.row = j;

                node = node.nextElementSibling;
            }
        }
    }
    function computeValue() {
        // To have the game state values, ie the numbers telling you how many mines are around a iven cell
        // We can't compute it before because of the randomShift() function
        for (let i = 0; i < HEIGHT; i++) {
            for (let j = 0; j < WIDTH; j++) {
                if (game_state[i][j].value === -1) {
                    // above
                    if ((i != 0) && (j != 0)       && (game_state[i-1][j-1].value !== -1)) game_state[i-1][j-1].value++;
                    if ((i != 0) &&                   (game_state[i-1][j].value   !== -1)) game_state[i-1][j].value++;
                    if ((i != 0) && (j != WIDTH-1) && (game_state[i-1][j+1].value !== -1)) game_state[i-1][j+1].value++;
                    // left
                    if ((j != 0) && (game_state[i][j-1].value !== -1)) game_state[i][j-1].value++;
                    // right
                    if ((j != WIDTH-1) && (game_state[i][j+1].value !== -1)) game_state[i][j+1].value++;
                    // bellow
                    if ((i != HEIGHT-1) && (j != 0)       && (game_state[i+1][j-1].value !== -1)) game_state[i+1][j-1].value++;
                    if ((i != HEIGHT-1) &&                   (game_state[i+1][j].value   !== -1)) game_state[i+1][j].value++;
                    if ((i != HEIGHT-1) && (j != WIDTH-1) && (game_state[i+1][j+1].value !== -1)) game_state[i+1][j+1].value++;
                }
            }
        }
    }


    function initializeGrid() {
        randomDistribute();
        // offset
        // I added this step to have it " more random ", ie move the big series of 0s at the end
        randomShift();
        // To have both the html cells element and the game_state matrix cells know the positions of each other
        // We can't compute it before because of the randomShift() function
        computePosition();
        // same here, but with the gamestate values
        computeValue();
    }


    function visitRecursive(col, row, ) {
        // using a recursive approach as it seems the most intuitiv way to fully visit a " cave "
        game_state[col][row].hidden = false;
        
        if ((game_state[col][row].value === 0)) {
            // above
            if ((row != 0) && (col != 0)       && (game_state[col - 1][row - 1].hidden)) visitRecursive(col - 1, row - 1);
            if ((row != 0) &&                     (game_state[col][row - 1].hidden))     visitRecursive(col,     row - 1);
            if ((row != 0) && (col != HEIGHT-1) && (game_state[col + 1][row - 1].hidden)) visitRecursive(col + 1, row - 1);
            // left
            if ((col != 0) && (game_state[col - 1][row].hidden)) visitRecursive(col - 1, row);
            // right
            if ((col != HEIGHT-1) && (game_state[col + 1][row].hidden)) visitRecursive(col + 1, row);
            // bellow
            if ((row != WIDTH-1) && (col != 0)       && (game_state[col - 1][row + 1].hidden)) visitRecursive(col - 1, row + 1);
            if ((row != WIDTH-1) &&                     (game_state[col][row + 1].hidden))     visitRecursive(col,     row + 1);
            if ((row != WIDTH-1) && (col != HEIGHT-1) && (game_state[col + 1][row + 1].hidden)) visitRecursive(col + 1, row + 1);
        }
    }
    function gameOver() {
        for (let i = 0; i < HEIGHT; i++) {
            for (let j = 0; j < WIDTH; j++) {
                game_state[i][j].hidden = false;
            }
        }

        alert("Game over...");
    }


    function beenClicked(target) {
        if (game_state[target.col][target.row].hidden) {
            if (game_state[target.col][target.row].value !== -1) {
                visitRecursive(target.col, target.row);
            } else {
                gameOver();
            }
        }
    }

    
    function update() {
        var node = game_grid.firstElementChild;

        for (let i = 0; i < HEIGHT; i++) {
            for (let j = 0; j < WIDTH; j++) {
                const state = game_state[i][j];

                if (!state.hidden) {
                    if (state.value === -1) {
                        node.innerHTML = '#';
                    } else {
                        node.innerHTML = state.value
                    }

                    node.style.color = "var(--color-for-" + state.value + ")";
                }

                node = node.nextElementSibling;
            }
        }
    }


    function clickHandler(event) {
        if (event.target.parentElement.id === "game_grid") {
            if (!has_started) {
                initializeGrid();
                has_started = true;
            } else {
                beenClicked(event.target);
            }

            update();
        }
    }

    setupGrid();
    document.addEventListener("click", clickHandler);
})();
