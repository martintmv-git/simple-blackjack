let dealerSum = 0;
let yourSum = 0;

let dealerAceCount = 0;
let yourAceCount = 0; 

let hidden;
let deck;

const orientationMessage = document.getElementById("orientation-message");

window.addEventListener("orientationchange", () => {
    if (screen.orientation.angle === 90) {
        orientationMessage.style.display = "none";
    } else {
        orientationMessage.style.display = "block"; 
    }
});

let canHit = true; 

window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); 
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    document.getElementById("dealer-sum").classList.add("hidden");
    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
        document.getElementById("dealer-sum").innerHTML = dealerSum;
    }
    console.log(dealerSum);

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
        document.getElementById("your-sum").innerHTML = yourSum;
    }
    console.log(yourSum);
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
}


function hit() {
    if (!canHit) {
        if (yourSum > 21) {
            document.getElementById("message").innerHTML = "You lose";
            canHit = false;
            document.getElementById("hit").style.display = "none";
            document.getElementById("stay").style.display = "none";
            return;
        }

        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);
    document.getElementById("your-sum").innerHTML = yourSum;

    if (reduceAce(yourSum, yourAceCount) > 21) { 
        let message = ""; 
        if (yourSum > 21) {
            message = "You lose";
            document.getElementById("hit").style.display = "none";
            document.getElementById("stay").style.display = "none";
            canHit = false;
        } else if (dealerSum > 21) {
            message = "You win";
        }
    
        document.getElementById("message").innerHTML = message;
    }
}

    
    function stay() {
        dealerSum = reduceAce(dealerSum, dealerAceCount);
        yourSum = reduceAce(yourSum, yourAceCount);
        canHit = false;
        document.getElementById("hidden").src = "./cards/" + hidden + ".png";
        document.getElementById("dealer-sum").classList.remove("hidden");
        document.getElementById("dealer-sum").innerHTML = dealerSum;
        
        let message = ""; 
        if (yourSum > 21) {
            message = "You lose";
        } else if (dealerSum > 21) {
            message = "You win";
        } else if (yourSum > dealerSum) {
            message = "You win";
        } else if (yourSum === dealerSum) {
            message = "Draw";
        } else {
            message = "You lose";
        }
    
        document.getElementById("message").innerHTML = message;
        if(message === "You lose" || message === "You win" || message === "Draw"){
            document.getElementById("hit").style.display = "none";
            document.getElementById("stay").style.display = "none";
        }
    
    }
    
    function getValue(card) {
        let value = card.split("-")[0];
        if (value === "A") {
            return 11;
        } else if (value === "J" || value === "Q" || value === "K") {
            return 10;
        } else {
            return parseInt(value);
        }
    }
    
    function checkAce(card) {
        let value = card.split("-")[0];
        if (value === "A") {
            return 1;
        } else {
            return 0;
        }
    }
    
    function reduceAce(sum, aceCount) {
        while (sum > 21 && aceCount > 0) {
            sum -= 10;
            aceCount--;
        }
        return sum;
    }
    