// Source code for this Jatsi game is available in github.com/tomkinen/jatsi.

// Run all this when page has loaded
window.onload = function() {
  Object.defineProperty(window, "console", {
    value: console,
    writable: false,
    configurable: false
  });

  var i = 0;

  function showWarningAndThrow() {
    if (!i) {
      setTimeout(function() {
        console.log("%cWarning message", "font: 2em sans-serif; color: yellow; background-color: red;");
      }, 1);
      i = 1;
    }
    throw "Console is disabled";
  }

  var l, n = {
    set: function(o) {
      l = o;
    },
    get: function() {
      showWarningAndThrow();
      return l;
    }
  };
  Object.defineProperty(console, "_commandLineAPI", n);
  Object.defineProperty(console, "__commandLineAPI", n);

  var NumtoDiceICO;
  var aiPlayerName1;

  var bluppblupp;
  var min = 0;
  var max = 2;
  var randomnum1;
  var test1;

  // Get texts for UI from backend. Use Axios for all backend GETs and POSTs. https://github.com/mzabriskie/axios
  // Use Furtive for all css styles. http://furtive.co, https://github.com/johnotander/furtive
  axios.get("api/uitext").then(response => {
    // Use Vue.js. The Progressive JavaScript Framework. https://vuejs.org, https://github.com/vuejs/vue
    new Vue({
      el: "#vue",
      data: {
        ui: response.data.ui,
        checkList: ["ones","twos","threes","fours","fives","sixes","onePair","twoPairs","threeOfAKind","fourOfAKind","smallStraight","largeStraight","fullHouse","chance","yatzy"],
        dice1: "1",
        dice2: "2",
        dice3: "3",
        dice4: "4",
        dice5: "5",
        dice1Selected: false,
        dice2Selected: false,
        dice3Selected: false,
        dice4Selected: false,
        dice5Selected: false,
        highScoresTable: "empty",
        highScoresVisible: false,
        numberOfPlayers: 0,
        activePlayer: 0,
        activeGameId: 0,
        activePlayerName: "",
        activeRoundNumber: 0,
        activeThrowNumber: 0,
        activeAiPlayer: "N",
        gameId: [0, 0, 0, 0],
        aiPlayer: ["N", "N", "N", "N"],
        aiPlayerNameAll: ["Harry", "Ross", "Bruce", "Cook", "Carolyn", "Morgan", "Albert", "Walker", "Randy", "Reed", "Larry", "Barnes", "Lois", "Wilson", "Jesse", "Campbell", "Ernest", "Rogers", "Theresa", "Patterson", "Henry", "Simmons", "Michelle", "Perry", "Frank", "Butler", "Shirley"],
        aiPlayerName1: "",
        aiPlayerName2: "",
        aiPlayerName2: "",
        aiPlayerName4: "",
        aiMessage: "",
        roundNumber: [0, 0, 0, 0],
        throwNumber: [0, 0, 0, 0],
        endGameSituation: false,
        player1NameInput: "",
        player2NameInput: "",
        player3NameInput: "",
        player4NameInput: "",
        player1TypeInput: "N",
        player2TypeInput: "N",
        player3TypeInput: "N",
        player4TypeInput: "N",
        playerAndPoints: ["", "", "", ""],
        playerAndPoints2: [{}, {}, {}, {}],
        gameStarted: false,
        playerNames: ["", "", "", ""],
        gameTable: [{}, {}, {}, {}],
        onesValue: ["", "", "", ""],
        twosValue: ["", "", "", ""],
        threesValue: ["", "", "", ""],
        foursValue: ["", "", "", ""],
        fivesValue: ["", "", "", ""],
        sixesValue: ["", "", "", ""],
        bonusValue: ["", "", "", ""],
        onePairValue: ["", "", "", ""],
        twoPairsValue: ["", "", "", ""],
        threeOfAKindValue: ["", "", "", ""],
        fourOfAKindValue: ["", "", "", ""],
        smallStraightValue: ["", "", "", ""],
        largeStraightValue: ["", "", "", ""],
        fullHouseValue: ["", "", "", ""],
        chanceValue: ["", "", "", ""],
        yatzyValue: ["", "", "", ""],
        totalValue: ["", "", "", ""],
        bestPlayer: "",
        bestPlayerName: "",
        disableClick: {
          "pointer-events": ""
        },
        disableClickDices: {
          "pointer-events": "none"
        },
        disableDice: "text-light",
        activeThrowNumberReverse: 3
      },
      methods: {
        // When player clicks 'New Game' -button. Send post with player name to api/newgame and initialize values.
        clickNewGame: function(playerCount, numberOfPlayers) {

          if (playerCount <= numberOfPlayers) {
            this.playerNames = [this.player1NameInput, "", "", ""];
            if (numberOfPlayers > 2) {
              this.playerNames[3] = this.player4NameInput;
            }
            if (numberOfPlayers > 1) {
              this.playerNames[2] = this.player3NameInput;
            }
            if (numberOfPlayers > 0) {
              this.playerNames[1] = this.player2NameInput;
            }
            this.aiPlayer = [this.player1TypeInput, "", "", ""];
            if (numberOfPlayers > 2) {
              this.aiPlayer[3] = this.player4TypeInput;
            }
            if (numberOfPlayers > 1) {
              this.aiPlayer[2] = this.player3TypeInput;
            }
            if (numberOfPlayers > 0) {
              this.aiPlayer[1] = this.player2TypeInput;
            }
            this.onesValue = ["", "", "", ""];
            this.twosValue = ["", "", "", ""];
            this.threesValue = ["", "", "", ""];
            this.foursValue = ["", "", "", ""];
            this.fivesValue = ["", "", "", ""];
            this.sixesValue = ["", "", "", ""];
            this.bonusValue = ["", "", "", ""];
            this.onePairValue = ["", "", "", ""];
            this.twoPairsValue = ["", "", "", ""];
            this.threeOfAKindValue = ["", "", "", ""];
            this.fourOfAKindValue = ["", "", "", ""];
            this.smallStraightValue = ["", "", "", ""];
            this.largeStraightValue = ["", "", "", ""];
            this.fullHouseValue = ["", "", "", ""];
            this.chanceValue = ["", "", "", ""];
            this.yatzyValue = ["", "", "", ""];
            this.totalValue = ["", "", "", ""];
            axios
              .post("api/newgame", {
                PLAYERNAME: this.playerNames[playerCount]
              })
              .then(response => {
                this.gameId[playerCount] = response.data.gameId;
                this.endGameSituation = false;
                this.totalValue[playerCount] = "";
                if (playerCount == numberOfPlayers) {
                  this.newRound(this.gameId[0], this.activePlayer);
                  this.gameStarted = true;
                }
                playerCount++;
                this.clickNewGame(playerCount, numberOfPlayers);
              });
            
          }
        },

        // When new round is started (either by 'New Game'-button or by ending round by selecting combination
        // from game table), empty dice values and set throw number to 1. Post to api/newround with gameid.
        newRound: function(gameId, activePlayer) {
          
          if (this.aiPlayer[activePlayer] == "Y") {
            this.aiMessage = this.ui.ai_message_1;
            this.disableClick = {
              "pointer-events": "none"
            };
          } else {
            this.disableClick = {
              "pointer-events": ""
            };
          }

          axios.post("api/newround", {
            GAMEID: gameId
          }).then(response => {
            this.activeGameId = gameId;
            this.dice1 = "1";
            this.dice2 = "2";
            this.dice3 = "3";
            this.dice4 = "4";
            this.dice5 = "5";
            this.dice1Selected = false;
            this.dice2Selected = false;
            this.dice3Selected = false;
            this.dice4Selected = false;
            this.dice5Selected = false;
            this.roundNumber[activePlayer] = response.data.round;
            this.throwNumber[activePlayer] = 0;
            this.activeThrowNumberReverse = 3;
            this.disableDice = "text-light";
            if (this.throwNumber[activePlayer] == 0) {
            	
            	disableDice: { "text-light" }
            	} else {
            		
            }
            this.activeRoundNumber = this.roundNumber[activePlayer];
            this.activeThrowNumber = this.throwNumber[activePlayer];
            this.activePlayerName = this.playerNames[activePlayer];
            this.activeAiPlayer = this.aiPlayer[activePlayer];
            if (this.activeAiPlayer == "Y") {
              setTimeout(() => {
                this.clickThrowDice(this.gameId, activePlayer);
              }, 50);
            }

            this.NumtoDiceICO();
            //console.log(this.activePlayer);
            //console.log(this.totalValue );
            
            this.playerAndPoints = [
              [0, this.playerNames[0], this.totalValue[0]],
              [1, this.playerNames[1], this.totalValue[1]],
              [2, this.playerNames[2], this.totalValue[2]],
              [3, this.playerNames[3], this.totalValue[3]]
              ]   
              
             
            this.playerAndPoints2 = [
                { pname: this.playerNames[0], ppoints: this.totalValue[0]},
                { pname: this.playerNames[1], ppoints: this.totalValue[1]},
                { pname: this.playerNames[2], ppoints: this.totalValue[2]},
                { pname: this.playerNames[3], ppoints: this.totalValue[3]}
              ]  

            var arrayMaxIndex = function(array) {
              return array.indexOf(Math.max.apply(null, array));
            };
            this.bestPlayer = arrayMaxIndex(this.totalValue);
            this.bestPlayerName = this.playerNames[this.bestPlayer];
            console.log(this.bestPlayerName); //outputs 2
            

          });
        },

        // When player clicks 'Throw Dice' -button. Send post with gameid to api/throwdice.
        // Set dice values according to what backend responded.
        clickThrowDice: function(gameId, activePlayer) {
          axios
            .post("api/throwdice", {
              GAMEID: gameId[activePlayer],
              ONE: this.dice1Selected,
              TWO: this.dice2Selected,
              THREE: this.dice3Selected,
              FOUR: this.dice4Selected,
              FIVE: this.dice5Selected,
              AI: this.activeAiPlayer
            })
            .then(response => {

              this.disableDice = "text-primary";
              this.disableClickDices = {
                "pointer-events": ""
              };
              
              this.dice1 = response.data.dice[0];
              this.dice2 = response.data.dice[1];
              this.dice3 = response.data.dice[2];
              this.dice4 = response.data.dice[3];
              this.dice5 = response.data.dice[4];
              
              
              this.gameTable[activePlayer] = response.data.gameTable;
              console.log("response: " + JSON.stringify(response.data.gameTable));
              this.throwNumber[activePlayer] = response.data.throw;
              this.activeThrowNumber = this.throwNumber[activePlayer];
              this.activeThrowNumberReverse = 3 - this.activeThrowNumber;
              if (this.activeAiPlayer == "Y") {
                this.aiMessage = this.ui.ai_message_2;
                setTimeout(() => {
                  this.dice1Selected = response.data.ai.dice[0];
                  this.dice2Selected = response.data.ai.dice[1];
                  this.dice3Selected = response.data.ai.dice[2];
                  this.dice4Selected = response.data.ai.dice[3];
                  this.dice5Selected = response.data.ai.dice[4];
                  if (this.activeThrowNumber < 3) {
                    this.aiMessage = this.ui.ai_message_3;
                    setTimeout(() => {
                      this.clickThrowDice(gameId, activePlayer);
                    }, 50);
                  } else {
                    this.aiMessage =
                      this.ui.ai_message_4 +
                      ' "' +
                      this.ui[response.data.ai.combination] +
                      '"';
                    
                    setTimeout(() => {
                      this.clickEndRound(
                        gameId[activePlayer],
                        response.data.ai.combination
                      );
                    }, 50);
                  }
                }, 500);
              }
              this.NumtoDiceICO();
            });


        },

        // When player clicks a combination to end round, send post to api/endround with gameid and selected result.
        // This will define how many points player will get. Points calculated in backend.
        clickEndRound: function(gameId, selectedResult) {
          if (selectedResult == "smallStraight" || selectedResult == "largeStraight"){
            console.log( selectedResult );
          }else{
          
          console.log( selectedResult );
        }

        console.log("checklist: " + selectedResult);
        
          if (
            this.dice1 != "-" &&
            this.gameTable[this.activePlayer][selectedResult + "Done"] == false
          ) {
            this.dice1 = "1";
            this.dice2 = "2";
            this.dice3 = "3";
            this.dice4 = "4";
            this.dice5 = "5";
            axios
              .post("api/endround", {
                GAMEID: gameId,
                SELECTEDRESULT: selectedResult
              })
              .then(response => {
                this[selectedResult + "Value"][this.activePlayer] =
                  response.data.gameTable[selectedResult];
                  console.log( response.data.gameTable[selectedResult] );
                this.bonusValue[this.activePlayer] =
                  response.data.gameTable.bonus;
                this.totalValue[this.activePlayer] = response.data.total;
                console.log( this.totalValue[this.activePlayer] );
                if (this.activePlayer < this.numberOfPlayers) {
                  if (this.roundNumber[this.activePlayer] == 15) {
                    this.endGame(
                      this.gameId[this.activePlayer],
                      this.activePlayer
                    );
                  }
                  this.activePlayer++;
                  this.newRound(
                    this.gameId[this.activePlayer],
                    this.activePlayer
                  );
                } else {
                  if (this.roundNumber[this.activePlayer] == 15) {
                    this.endGame(
                      this.gameId[this.activePlayer],
                      this.activePlayer
                    );
                  } else {
                    this.activePlayer = 0;
                    this.newRound(
                      this.gameId[this.activePlayer],
                      this.activePlayer
                    );
                  }
                }

              });
          }
        },

        NumtoDiceICO: function() {
          document.getElementById("dice1").innerHTML = "<i class='fas fa-dice-" + this.dice1 + " fa-6x'></i>";
          document.getElementById("dice2").innerHTML = "<i class='fas fa-dice-" + this.dice2 + " fa-6x'></i>";
          document.getElementById("dice3").innerHTML = "<i class='fas fa-dice-" + this.dice3 + " fa-6x'></i>";
          document.getElementById("dice4").innerHTML = "<i class='fas fa-dice-" + this.dice4 + " fa-6x'></i>";
          document.getElementById("dice5").innerHTML = "<i class='fas fa-dice-" + this.dice5 + " fa-6x'></i>";
        },


        // When clickEndRound is run and if the round number is 15, then this method is run.
        // End game. Send post with gameid. High score will be saved in backend.
        endGame: function(gameId, activePlayer) {
          axios.post("api/endGame", {
            GAMEID: gameId
          }).then(response => {
            if (activePlayer == this.numberOfPlayers) {
              this.endGameSituation = true;
              this.activePlayer = 0;
              this.activeAiPlayer = "N";
            }
          });
        },

        // When player clicks 'High Scores' -button. Send get to api/highscores to get fresh data from backend.
        // Player will see high score list and have capability to click back by clicking 'Back to Game' -button.
        clickHighScores: function() {
          axios.get("api/highscores").then(response => {
            this.highScoresTable = response.data;
            if (this.highScoresVisible == true) {
              this.highScoresVisible = false;
            } else {
              this.highScoresVisible = true;
            }
          });
        },

        // When player selects that player is either human or AI. Set name of the player if type is AI.

        aiTrigger: function(player) {
          randomnum1 = this.bluppblupp();
          if (this["player" + player + "TypeInput"] == "Y") {
            this["player" + player + "NameInput"] = test1 + ' (BOT)';
            this.aiPlayerNameAll.splice(randomnum1, 1);
          } else {
            this["player" + player + "NameInput"] = "";
          }
        },

        bluppblupp: function() {

          randomnum1 = Math.floor(Math.random() * (max - min)) + min;
          test1 = this.aiPlayerNameAll[randomnum1];
          
          //

        }

      }
    });
  });
};