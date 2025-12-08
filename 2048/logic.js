
(function () {
    var game_grid = document.getElementById("game_grid");
    
    var game_state = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
    const game_state_test = [
        [0,   1,    2,    4,   8],
        [16,  32,   64,   128, 256],
        [512, 1024, 2048, 0,   0],
        [0,   0,    0,    0,   0],
        [0,   0,    0,    0,   0]
    ];

    
    function goUp() {
        let j;
        let has_merged;

        for (let col = 0; col < 5; col++) {
            for (let i = 1; i < 5; i++) {
                has_merged = false;
                j          = i-1;
                
                while (j >= 0) {
                    if (game_state[j][col] == 0) {
                        game_state[j][col]   = game_state[j+1][col];
                        game_state[j+1][col] = 0;
                    }
                    else if (!has_merged && game_state[j][col] == game_state[j+1][col]) {
                        game_state[j][col]   = game_state[j][col] * 2;
                        game_state[j+1][col] = 0;
                        has_merged           = true;
                    }
                    else {
                        j = -1;
                    }
                    j--;
                }
            }
        }        
    }
    function goDown() {
        let j;
        let has_merged;

        for (let col = 0; col < 5; col++) {
            for (let i = 3; i >= 0; i--) {
                has_merged = false;
                j          = i+1;
                
                while (j < 5) {
                    if (game_state[j][col] == 0) {
                        game_state[j][col]   = game_state[j-1][col];
                        game_state[j-1][col] = 0;
                    }
                    else if (!has_merged && game_state[j][col] == game_state[j-1][col]) {
                        game_state[j][col]   = game_state[j][col] * 2;
                        game_state[j-1][col] = 0;
                        has_merged           = true;
                    }
                    else {
                        j = 5;
                    }
                    j++;
                }
            }
        }
    }
    function goLeft() {
        let j;
        let has_merged;

        for (let row = 0; row < 5; row++) {
            for (let i = 1; i < 5; i++) {
                has_merged = false;
                j          = i-1;
                
                while (j >= 0) {
                    if (game_state[row][j] == 0) {
                        game_state[row][j]   = game_state[row][j+1];
                        game_state[row][j+1] = 0;
                    }
                    else if (!has_merged && (game_state[row][j] == game_state[row][j+1])) {
                        game_state[row][j]   = game_state[row][j] * 2;
                        game_state[row][j+1] = 0;
                        has_merged           = true;
                    }
                    else {
                        j = -1;
                    }
                    j--;
                }
            }
        }        
    }
    function goRight() {
        let j;
        let has_merged;

        for (let row = 0; row < 5; row++) {
            for (let i = 3; i >= 0; i--) {
                has_merged = false;
                j          = i+1;
                
                while (j < 5) {
                    if (game_state[row][j] == 0) {
                        game_state[row][j]   = game_state[row][j-1];
                        game_state[row][j-1] = 0;
                    }
                    else if (!has_merged && game_state[row][j] == game_state[row][j-1]) {
                        game_state[row][j]   = game_state[row][j] * 2;
                        game_state[row][j-1] = 0;
                        has_merged           = true;
                    }
                    else {
                        j = 5;
                    }
                    j++;
                }
            }
        }
    }

    
    function checkGameOver() {
        let has0     = false;
        let hasMerge = false;
        let i        = 0;
        let j        = 0;

        while (!has0 && !hasMerge && (i < 5)) {
            while (!has0 && !hasMerge && (j < 5)) {
                has0 = game_state[i][j] == 0;
                if ((i != 0)) { hasMerge = hasMerge || (game_state[i][j] == game_state[i-1][j]); }
                if ((i != 4)) { hasMerge = hasMerge || (game_state[i][j] == game_state[i+1][j]); }
                if ((j != 0)) { hasMerge = hasMerge || (game_state[i][j] == game_state[i][j-1]); }
                if ((j != 4)) { hasMerge = hasMerge || (game_state[i][j] == game_state[i][j+1]); }
                j++;
            }
            i++;
        }

        return has0 || hasMerge;
    }


    function addRandom() {
        let number = Math.floor(Math.random() * 2) + 1;
        let grid0  = [];

        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (game_state[i][j] == 0) {
                    grid0.push([i, j]);
                }
            }
        }

        let coord = grid0[Math.floor(Math.random() * grid0.length)];
        game_state[coord[0]][coord[1]] = number;
    }


    function update() {
        var node = game_grid.firstElementChild;

        for (let i = 0; i < 25; i++) {
            const state = game_state[Math.floor(i / 5)][i % 5];

            if (state != 0) {
                node.innerHTML        = state;
                node.style.background = "var(--color-for-" + state + ")";
            }
            else {
                node.innerHTML = "";
                node.style.backgroundColor = "black";
            }

            node = node.nextElementSibling;
        }
    }


    function keyHandler(event) {
        switch (event.key) {
            case 'z' : goUp();    break;
            case 's' : goDown();  break;
            case 'q' : goLeft();  break;
            case 'd' : goRight(); break;
        }

        if (!checkGameOver()) {
            alert("game over...");
        }
        
        addRandom();
        update();
    }

    addRandom();
    addRandom();
    update();
    document.addEventListener("keypress", keyHandler);
})()
