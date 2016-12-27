import React from 'react';
// import ReactDOM from 'react-dom';
import './App.css';


// A standard deck of 52 cards. Face cards have numeric names (e.g., '14clubs' is Ace of Clubs).

var Cards = [
    '2hearts', '2clubs', '2spades', '2diamonds', 
    '3hearts', '3clubs', '3spades', '3diamonds', 
    '4hearts', '4clubs', '4spades', '4diamonds', 
    '5hearts', '5clubs', '5spades', '5diamonds', 
    '6hearts', '6clubs', '6spades', '6diamonds', 
    '7hearts', '7clubs', '7spades', '7diamonds', 
    '8hearts', '8clubs', '8spades', '8diamonds', 
    '9hearts', '9clubs', '9spades', '9diamonds', 
    '10hearts', '10clubs', '10spades', '10diamonds', 
    '11hearts', '11clubs', '11spades', '11diamonds', 
    '12hearts', '12clubs', '12spades', '12diamonds', 
    '13hearts', '13clubs', '13spades', '13diamonds', 
    '14hearts', '14clubs', '14spades', '14diamonds'
    ]


var GameStatus = { notStarted: 0, finished: 1, inProgress: 2 }

var StatusComponent = React.createClass({
    render: function() {
        var winner = this.props.currentWinner;
        var status = this.props.status;
        var won = this.props.cardsWon;
        var war = this.props.wasWar;
        var message = '';
        if (status === GameStatus.notStarted || winner === null) {
            message = '';
        } else if (status === GameStatus.finished) {
            message = 'Player ' + winner + ' won the game!';
        } else {
            if (war) {
                message += 'WAR! ';
            }
            message += 'Player ' + winner + ' won ' + won + ' cards.';
        }
        return (
            <div>{message}</div>
        );
    }
});

// Button for dealing initial hand and playing rounds.
var ButtonComponent = React.createClass({
    render: function() {
        var text_options = ['Deal Cards', 'Play Again', 'Next Round'];
        var button_text = text_options[this.props.status];
        return (
            <button className="btn-primary" onClick={this.props.clickHandler}>{button_text}</button>
        );
    }
});


// Display card images, and # of cards left in player's deck

var CardComponent = React.createClass({
    cardImage: function(card) {
        var cardImageFile = 'back.svg'
        if (card) {
            cardImageFile = card + '.svg'
        }
        return ('/images/cards/' + cardImageFile);
    },
    render: function() {
        var cardCount = this.props.cardCount;
        var currentCard = this.props.currentCard;
        var count = "";
        if (cardCount) {
            count = <p>{cardCount} cards remaining</p>;
        }
        return (
            <div>
                <p><img alt="" src={this.cardImage(currentCard)} /></p>
                {count}
            </div>
        )
    }
});

// Play the game.

var GameComponent = React.createClass({
    startGame: function() {
        var cardArray = Cards.slice();

        // 'Shuffle' the cards 
        // JS doesn't do array 'shuffling' easily--
        // this code's cribbed from the Knuth shuffle: https://github.com/Daplie/knuth-shuffle
        var currentIndex = cardArray.length;
        var tempValue;
        var randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            tempValue = cardArray[currentIndex];
            cardArray[currentIndex] = cardArray[randomIndex];
            cardArray[randomIndex] = tempValue;
        }

        // Deal the entire deck, set initial state, 
        // and update game status from notStarted to inProgress
        this.setState({
            playerADeck: cardArray.slice(0, 26),
            playerBDeck: cardArray.slice(26),
            status: GameStatus.inProgress,
            currentWinner: null,
            currentWasWar: null,
            currentCardsWon: null
        });

    },
    playGame: function() {
        var won = []; 
        var aDeck = this.state.playerADeck;
        var bDeck = this.state.playerBDeck;
        var complete = false;
        var nextStatus = GameStatus.inProgress;
        var isWar = false;

        while (!complete) {
            var aCard = aDeck.shift(); // get a card for Player A
            var bCard = bDeck.shift(); // get a card for Player B
            var winner;
            won.push(aCard, bCard);
            var caVal = parseInt(aCard.split('_')[0], 10);
            var cbVal = parseInt(bCard.split('_')[0], 10);

            if (caVal === cbVal) {  // Equal value cards? WAR
                isWar = true;
                // Out of cards? Game over.
                if (aDeck.length < 2) { 
                    winner = 'B';
                    nextStatus = GameStatus.finished; // Player B wins the game
                    complete = true;
                } else if (bDeck.length < 2) {
                    winner = 'A';
                    nextStatus = GameStatus.finished; // Player A wins the game
                    complete = true;
                } else { 
                    won.push(aDeck.shift(), bDeck.shift());
                    aCard = aDeck.shift();
                    bCard = bDeck.shift();
                    won.push(aCard, bCard);
                    caVal = parseInt(aCard.split('_')[0], 10);
                    cbVal = parseInt(bCard.split('_')[0], 10);
                    if (caVal !== cbVal) {
                        complete = true;
                        if (caVal > cbVal) {
                            winner = 'A';
                            aDeck.push.apply(aDeck, won);
                        } else {
                            winner = 'B';
                            bDeck.push.apply(bDeck, won);
                        }
                    }
                }
            } else {
                complete = true;
                if (caVal > cbVal) {
                    winner = 'A';
                    aDeck.push.apply(aDeck, won);
                } else {
                    winner = 'B';
                    bDeck.push.apply(bDeck, won);
                }
            }

        }
        if (!aDeck.length || !bDeck.length) { // Out of cards? Game over.
            nextStatus = GameStatus.finished;
        }
        this.setState({
            status: nextStatus,
            currentWinner: winner,
            currentWasWar: isWar,
            currentCardsWon: won.length,
            playerACurrentCard: aCard,
            playerBCurrentCard: bCard,
            playerADeck: aDeck,
            playerBDeck: bDeck
        });
    },
    clickHandler: function() {
        switch(this.state.status) {
            case GameStatus.notStarted:
                this.startGame();
                break;
            case GameStatus.inProgress:
                this.playGame();
                break;
            case GameStatus.finished:
                this.startGame();
                break;
            default:
                this.startGame();
        }
    },
    getInitialState: function() {
        return ({
            playerADeck: null,
            playerBDeck: null,
            playerACurrentCard: null,
            playerBCurrentCard: null,
            status: GameStatus.notStarted,
            currentWinner: null,
            currentWasWar: null,
            currentCardsWon: null
        })
    },
    render: function() {
        return (
          <div  className="container">
            <div className="row">
               <div className="col-sm-12 title text-center">WAR: The Card Game</div>
           </div>
           <div className="row">
               <div className="col-sm-4 player text-center">Player A</div>
               <div className="col-sm-4 col-sm-offset-4 player text-center">Player B</div>
           </div>
            <div className="row">
                <div className="col-sm-4">
                     <CardComponent
                          cardCount={this.state.playerADeck ? this.state.playerADeck.length : null }
                          currentCard={this.state.playerACurrentCard}
                      />
                </div>
                <div className="col-sm-4 text-center">
                      <ButtonComponent
                          clickHandler={this.clickHandler}
                          status={this.state.status}
                      />
                    <div className="row">
                     <div className="col-sm-12 text-center">
                        <StatusComponent
                           currentWinner={this.state.currentWinner}
                           wasWar={this.state.currentWasWar}
                           cardsWon={this.state.currentCardsWon}
                           status={this.state.status}
                        />
                        </div>
                    </div>
                </div>
                 <div className="col-sm-4">
                      <CardComponent
                           cardCount={this.state.playerBDeck ? this.state.playerBDeck.length : null }
                           currentCard={this.state.playerBCurrentCard}
                       />
                </div>
            </div>

          </div>
        );
    }
});

export default GameComponent;

