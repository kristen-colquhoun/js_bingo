/**
 * Sprint 6: Auto Bingo Caller / Card play integrating the Bingo Card & Bingo Caller into a single Application.  
 */

var bingo = (function () {

    // Generate an array of numbers
    var numbers_to_call = [...Array(76).keys()];

    // Remove the 0 from the list
    numbers_to_call.shift();

    // The numbers on the card
    var numberCard = [];

    // Numbers the user has successfully dabed
    var dabbed = [];

    // Winning combinations
    var winningCombo = [
        // Horizontal
        [0, 5, 10, 14, 19],
        [1, 6, 11, 15, 20],
        [2, 7, 16, 21],
        [3, 8, 12, 17, 22],
        [4, 9, 13, 18, 23],
        // Vertical
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13],
        [14, 15, 16, 17, 18],
        [19, 20, 21, 22, 23],
        // Diagonal
        [0, 6, 17, 23],
        [4, 8, 15, 19],
        // 4 corners
        [0, 19, 4, 23]
    ];

    return {

        /**
         * Prepare the game to start
         * @param {array} cardNumbers 
         */
        init: function (cardNumbers) {
            // Save the numbers to this class
            numberCard = cardNumbers;
        },

        /**
         * Start calling numbers when the user clicks start
         */
        start: function () {
            // Hide the start game button 
            document.getElementById("start-game-btn").style.display = 'none';

            // Start the loop
            this._loopTimer();
        },

        /**
         * Loop caller until we have called all numbers
         */
        _loopTimer: function () {

            /**
             * Start an interval loop which fires every 2 seconds
             */
            myVar = setInterval(function () {

                // Pick a random number from the numbers_to_call array
                // Since we remove the number there cannot be any duplicates
                var selectNumber = numbers_to_call[Math.floor(Math.random() * numbers_to_call.length)];

                // Remove the selected number from the array so we don't pick it again
                for (var i = 0; i < numbers_to_call.length; i++) {
                    if (numbers_to_call[i] === selectNumber) {
                        numbers_to_call.splice(i, 1);
                        break;
                    }
                }
                // update the cell to selected numbers
                var dabNumber = document.getElementById("callable-" + selectNumber);
                dabNumber.classList.add("called");

                // Update the last call number box
                document.getElementById('last-called-number').innerHTML = selectNumber;

                // We have now called all numbers, so game over
                if (numbers_to_call.length < 1) {
                    // Stop the interval
                    clearInterval(myVar);
                    // Show the game over box
                    document.getElementById('game-over').style.display = 'inherit';
                }

            }, 2000);
        },

        /**
         * Dab the cell, green if its been called, orange if not
         * @param {int} cell 
         */
        dab: function (cell) {
            // Get the cell we are currently dabbing
            getCell = document.getElementById('cell-' + cell);

            // if the number is still in numbers to call we dont have it
            if (numbers_to_call.includes(numberCard[cell])) {
                getCell.classList.add("not-there");
            } else {
                dabbed.push(cell);
                getCell.classList.add("there");
            }

            // After every dab check if we have a winner
            this._checkWin();
        },

        /**
         * Check if we have a winning combination
         */
        _checkWin: function () {
            for (let i = 0; i < winningCombo.length; i++) {

                // Keep a count so we know we match all
                var currentCount = 0;

                // For each number check if we have it, if not break
                for (let v = 0; v < winningCombo[i].length; v++) {

                    // If the dab is in the combo add to counter else break the loop
                    if (dabbed.includes(winningCombo[i][v])) {
                        currentCount++;
                    } else {
                        break;
                    }

                    // If the counter equels the combo length we have a winner
                    if (currentCount >= winningCombo[i].length) {
                        // Stop the interval
                        clearInterval(myVar);

                        // Show the game won box
                        document.getElementById('game-won').style.display = 'inherit';

                        // Set the winning combo flashing
                        this._winningFlash(winningCombo[i]);
                    }
                }
            }
        },
        /**
         * Flash the winning cells
         * @param {array} numbers 
         */
        _winningFlash: function (numbers) {
            // Function to change the cell class
            function changeClass(cell, clas) {
                document.getElementById('cell-' + cell).className = clas;
            }

            // Count how many times we flash
            let counter = 0;

            // Set interval to change color every half second
            var timer = setInterval(function () {

                // increase the counter
                counter++;

                // If the counter is even flash green
                if (counter % 2 == 0) {
                    // change each cell
                    for (let i = 0; i < numbers.length; i++) {
                        changeClass(numbers[i], 'flashA');
                    }
                } else {
                    for (let i = 0; i < numbers.length; i++) {
                        changeClass(numbers[i], 'flashB');
                    }
                }

                // Don't over do the flashing, so stop after 50
                if (counter >= 50) {
                    clearInterval(timer);
                }
            }, 500);
        }
    }
})();

/**
 * Build a bingo card
 */
(function () {

    /**
     * Update the cells to display a number (view)
     * @param {int} cell 
     */
    function addNumberToCell(cell, num) {
        // Get the cell we are currently updating
        getCell = document.getElementById('cell-' + cell);

        // Insert a number from getAvailableNumber function
        getCell.innerHTML = num;
    }

    /**
     * New function to create bingo columns the real way
     * The columns are labeled "B" (numbers 1–15), "I" (numbers 16–30), "N" (numbers 31–45), "G" (numbers 46–60), and "O" (numbers 61–75).
     */
    function generateNewCard() {
        // Generate set of numbers 
        function setBingoSequence(min, max, len = 5) {
            // Custom function to shuffle the array
            // 
            function shuffle(a) {
                for (let i = a.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [a[i], a[j]] = [a[j], a[i]];
                }
                return a;
            }

            // Create an array we can build upon
            let set = [];

            // For the amount of numbers we need add them
            for (let i = min; i <= max; i++) {
                // Add to the array
                set.push(i);
            }

            // Shuffle the array to make it random
            shuffle(set);

            // Now set the length to 5 removing excess
            set.length = len;

            // Return the requested set
            return set;
        }

        // Set 5 arrays with numbers which can be called using my custom function
        let numB = setBingoSequence(1, 15);
        let numI = setBingoSequence(16, 30);
        let numN = setBingoSequence(31, 45, 4);
        let numG = setBingoSequence(46, 60);
        let numO = setBingoSequence(61, 75);

        // Concatenate our set of numbers
        let bingo = numB.concat(numI, numN, numG, numO);

        // Loop 25 times filling up the card
        for (let i = 0; i < 24; i++) {

            // Add the number to the cell
            addNumberToCell(i, bingo[i]);
        }

        // Return the numbers, we will need them
        return bingo;
    }

    // Generate a card
    let myNums = generateNewCard();

    // Now done call build the rest
    bingo.init(myNums);

})();