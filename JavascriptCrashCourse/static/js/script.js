


function ageInDays(){
var birthyear = prompt('Hey, What year were you Born?');
var ageInDayss = (2020 - birthyear) * 365;
var h1 = document.createElement('h1');
var textAnswer = document.createTextNode('You are ' + ageInDayss + ' days old');
h1.setAttribute( 'id', 'ageInDays');
h1.appendChild(textAnswer);
document.getElementById('flex-box-result').appendChild(h1); 
console.log(ageInDayss);
}

function reset(){
document.getElementById('ageInDays').remove();
}

function generateCat(){
var image = document.createElement('img');
var div = document.getElementById('flex-cat-gen');
image.src = "https://api.thecatapi.com/api/images/get?format=src&type=gif&size=small";
div.appendChild(image);
}

//rps challenge
function rpsGame(yourChoice){
var humanChoice, botChoice;
humanChoice = yourChoice.id;
botChoice = numberToChoice(randToRpsInt());
console.log('computerChoice', botChoice)
results = decideWinner(humanChoice,botChoice); //returns a array of possible endings ie [0,1] human lost | bot won
message = finalMessage(results) // returns 'You Won' 'You Lost' 'You Tied'
console.log(message);
rpsFrontEnd(yourChoice.id, botChoice.id, message);
}

function randToRpsInt(){
    return Math.floor(Math.random() * 3);
}

function numberToChoice(number){
    return['Rock','Paper','Scissors'][number]
}

function decideWinner(yourChoice, computerChoice){
    var rpsDatabase = {
    'Rock':{'Scissors':1, 'Rock':0.5, 'Paper':0},
    'Paper':{'Rock': 1, 'Paper':0.5, 'Scissors':0},
    'Scissors':{'Paper': 1, 'Scissors':0.5, 'Rock':0}
    };
    
    var yourScore = rpsDatabase[yourChoice][computerChoice];
    var computerScore = rpsDatabase[computerChoice][yourChoice];
   
    return [yourScore, computerScore];

}
// why computerScore isnt being checked?? i have to continue debugging !!
function finalMessage([yourScore, computerScore]) {
    if (yourScore === 0 ){
        return {'message':'You Lost lol', 'color': 'red'};
    }
    else if (yourScore === 0.5){
        return{'message': 'You Tied!', 'color': 'yellow'};
    }
    else{
        return{'message': 'You Won!', 'color': 'green'};
    }
    
}

function rpsFrontEnd(humanImageChoice,botImageChoice,finalMessage){
    var imagesDatabase ={
        'Rock': document.getElementById('Rock').src,
        'Paper': document.getElementById('Paper').src,
        'Scissors':document.getElementById('Scissors').src
    }

    document.getElementById('Rock').remove();
    document.getElementById('Paper').remove();
    document.getElementById('Scissors').remove();

    var humanDiv = document.createElement('div');
    var botDiv = document.createElement('div');
    var messageDiv = document.createElement('div');

    humanDiv.innerHTML = "<img src='" + imagesDatabase[humanImageChoice] + "' height=150 width=150 style='box-shadow: 0px 10px 50px rgba(37,50,233,1);'>"
    messageDiv.innerHTML ="<h1 style = 'color: " + finalMessage['color'] + "; font-size:60px; padding: 30px; '>" + finalMessage['message'] + "</h1>"
    botDiv.innerHTML = "<img src='" + imagesDatabase[botImageChoice] + "' height=150 width=150 style='box-shadow: 0px 10px 50px rgba(243,38,24,1);'>"

    document.getElementById('flex-box-rps-div').appendChild(humanDiv);
    document.getElementById('flex-box-rps-div').appendChild(messageDiv);
    document.getElementById('flex-box-rps-div').appendChild(botDiv);
}

///Challenge 4: Change the color of all the buttons 
var all_buttons = document.getElementsByTagName('button');

var copyAllButtons= [];
for(let i=0; i < all_buttons.length; i++) {
    copyAllButtons.push(all_buttons[i].classList[1]);
}
 
function buttonColorChange(buttonThingy){
    if(buttonThingy.value === 'red'){
        buttonsRed();
    } else if (buttonThingy.value === 'green'){
        buttonsGreen();
    } else if (buttonThingy.value === 'reset'){
        buttonColorReset();
    } else if (buttonThingy.value === 'random'){
        randomColors();
    }
}

function buttonsRed(){
    for (let i=0; i < all_buttons.length; i++){
        all_buttons[i].classList.remove(all_buttons[i].classList[1]);
        all_buttons[i].classList.add('btn-danger');
    }
}

function buttonsGreen(){
    for (let i=0; i < all_buttons.length; i++){
        all_buttons[i].classList.remove(all_buttons[i].classList[1]);
        all_buttons[i].classList.add('btn-success');
    }
}

function buttonColorReset(){
    for (let i=0; i < all_buttons.length; i++){
       all_buttons[i].classList.remove(all_buttons[i].classList[1]);
       all_buttons[i].classList.add(copyAllButtons[i]);
    }
}

function randomColors(){
    var choices = ['btn-primary', 'btn-danger', 'btn-success', 'btn-warning']

    for (let i =0; i <all_buttons.length; i++){
        let randomNumber = Math.floor(Math.random() * 4);
        all_buttons[i].classList.remove(all_buttons[i].classList[1]);
        all_buttons[i].classList.add(choices[randomNumber]);
    }
}

//Challenge 5: Blackjack
let blackjackGame = {
'you':{'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0},
'dealer':{'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0},
'cards':['2','3','4','5','6','7','8','9','10','K','Q','J','A'],
'cardsMap':{'2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, '10':10, 'K':10, 'Q':10, 'J':10, 'A':[1,11]},
'wins':0,
'losses':0,
'draws':0,
'isStand': false,
'turnsOver': false,
};

const YOU = blackjackGame['you']
const DEALER = blackjackGame['dealer']

const hitSound = new Audio('static/sounds/swish.m4a');
const winSound = new Audio('static/sounds/cash.mp3');
const lostSound = new Audio('static/sounds/aww.mp3');


//adding event listeners  better than using onclick in html
document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);

function blackjackHit(){
    if (blackjackGame['isStand'] === false) {
        let card = randomCard();
        showCard(card, YOU);
        updateScore(card, YOU);
        showScore(YOU);
    }
}

function randomCard(){
    let randomIndex = Math.floor(Math.random()* 13);
    return blackjackGame['cards'][randomIndex];
}

function showCard(card, activePlayer){
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        //${***} creates ability to add varibles/parametes to file names
        cardImage.src = `static/images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

function blackjackDeal(){
    //let winner = computeWinner();
    //showResult(winner);

    if(blackjackGame['turnsOver'] === true) {

        blackjackGame['isStand'] = false;
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
    
        for (i=0; i < yourImages.length; i++) {
            yourImages[i].remove();
        }


        for (i=0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
        }

        YOU['score'] = 0;
        DEALER['score']= 0;

        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').textContent = 0;

        document.querySelector('#your-blackjack-result').style.color = 'FFFFFF';
        document.querySelector('#dealer-blackjack-result').style.color = 'FFFFFF';

        document.querySelector('#blackjack-result').textContent = "Let's play";
        document.querySelector('#blackjack-result').style.color = "black";

        blackjackGame['turnsOver'] = true;
    }




}

function updateScore(card, activePlayer){
    // if adding 11 keeps me below 21, add 11. Otherwise, add 1
    if (card === 'A')  {
      if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21) {
        activePlayer['score'] += blackjackGame['cardsMap'][card][1];
    } else {
        activePlayer['score'] += blackjackGame['cardsMap'][card][0];
    }

    } else {
    activePlayer['score'] += blackjackGame['cardsMap'][card];
    }
}

function showScore(activePlayer){
    if(activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
 
    } else {
    document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
} 

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic() {
    blackjackGame['isStand'] = true;

    while (DEALER['score'] < 16 && blackjackGame['isStand'] === true) {
        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER); 
        await sleep(750);
    }

    blackjackGame['turnsOver'] = true;
    let winner = computeWinner();
    showResult(winner);
}

function computeWinner(){
    let winner;

    if (YOU['score'] <= 21) {

        if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)){
        console.log('You Won!');
        blackjackGame['wins']++;
        winner = YOU;
        }
        else if (YOU['score'] < DEALER['score']) {
        console.log('You Lost!');
        blackjackGame['losses']++;
        winner = DEALER;
        }
        else if (YOU['score']=== DEALER['score']){
        console.log('You Drew!');
        blackjackGame['draws']++;
        }


     }else if (YOU['score'] > 21 && DEALER['score'] <= 21){
        console.log('You Lost!')
        blackjackGame['losses']++;
        winner = DEALER;
        }

        else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        console.log('You Drew!');
        blackjackGame['draws']++;
        }

        console.log('Winner is', winner);
        return winner;
}

function showResult(winner){

    if(blackjackGame['turnsOver'] === true) {

        if (winner === YOU ){
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            message = 'You Won!'
            messageColor = 'green';
            winSound.play();

        }else if (winner === DEALER) {
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            message = 'You lost!';
            messageColor = 'red';
            lostSound.play();

        }else {
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            message = 'You Drew!';
            messageColor ='black';
        }

        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }
}