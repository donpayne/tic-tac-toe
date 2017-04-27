/*eslint-disable import/default */
import 'babel-polyfill';
import React from 'react';
import _ from 'lodash';
import './styles/styles.scss'; //Webpack can import CSS files too!

class GameState {
  static initClass() {
    this.prototype.isX = true;
    this.prototype.playerX = 0;
    this.prototype.playerO = 0;
    this.prototype.moves = 0;
    this.prototype.winner = null;
    this.prototype.gameField = null;
    this.prototype.winningNumbers = [7, 56, 448, 73, 146, 292, 273, 84];
  }
  
  constructor() {
    this.gameField = _.map([0, 1, 2, 3, 4, 5, 6, 7, 8], _.partial(Math.pow, 2));
  }
  
  currentSymbol() {
    return this.isX? 'x' : 'o';
  }
      
  currentPlayer() {
    return this.isX? this.playerX : this.playerO;
  }
      
  checkWinConditions() {
    for (let number of this.winningNumbers) {
      if ((number & this.currentPlayer()) === number) {
        this.winner = `Player ${this.currentSymbol().toUpperCase()}`;
      }
    }

    if (this.moves > 8) {
      this.winner = 'Nobody';
    }
    return this.winner;
  }
  
  updateState(index) {
    if (this.isX) {
		this.playerX += this.gameField[index];
    }
    else {
		this.playerO += this.gameField[index];
    }

    this.moves++;
    this.checkWinConditions();
    return this.isX = !this.isX;
  }
    
  reset() {
    this.isX = true;
    this.playerX = 0;
    this.playerO = 0;
    this.moves = 0;
    return this.winner = null;
  }
}

// Initialize
// *****************************************************************************************
GameState.initClass();

let gameState = new GameState;

let {div, h1} = React.DOM;

document.addEventListener('DOMContentLoaded', () => React.renderComponent(GameField(), document.body));
  
var GameField = React.createClass({

  getInitialState() {
    return {gameIsBeingPlayed: false};
  },

  render() {
    return div({
      className: 'tic-tac-toe--field',
      children: [
        TicTacToeCellsMatrix({
          onClick: this.onCellClick,
          gameIsBeingPlayed: this.state.gameIsBeingPlayed
        }),
        EndGamePopOver({
          onNewGame: this.onNewGame,
          gameIsBeingPlayed: this.state.gameIsBeingPlayed
        })
      ]});
  },

  onNewGame() {
    gameState.reset();
    return this.setState({gameIsBeingPlayed: true});
  },
        
  onCellClick() {
    if (gameState.winner) {   
      return this.setState({gameIsBeingPlayed: false});
    }
  }
});
 
let TicTacToeCell = React.createClass({
  getInitialState() {
    return {symbol: null};
  },
  
  componentWillReceiveProps() {
      if (!this.props.gameIsBeingPlayed) { return this.setState({symbol: null}); }
    },
      
  render() {
    return div({
      className: this.classes(),
      onMouseUp: this.clickHandler
    });
  },
      
  classes() {
    return [
      'tic-tac-toe-cell',
      this.state.symbol ? `${this.state.symbol}Symbol` : undefined
    ].join(' ');
  },
      
  clickHandler() {
    if (!this.state.symbol) {
      this.setState({symbol: gameState.currentSymbol()});
      gameState.updateState(this.props.index);
      return this.props.onClick();
    }
  }
});
    
var TicTacToeCellsMatrix = React.createClass({
  render() {
    return div({
      className: 'tic-tac-toe--cells-matrix',
      children: _.map([0, 1, 2, 3, 4, 5, 6, 7, 8], (i) =>
        TicTacToeCell({
          index: i,
          gameIsBeingPlayed: this.props.gameIsBeingPlayed,
          onClick: this.props.onClick
        }))
    });
  }
});
    
var EndGamePopOver = React.createClass({ 
  render() {
    return div({
      className: this.classes(),
      children: [
        NewGameButton({
          onClick: this.props.onNewGame}),
        TitleLabel({
          winner: gameState.winner})
      ]});
  },

  classes() { return [
      'tic-tac-toe--end-game-popover',
      this.props.gameIsBeingPlayed ? "hidden" : undefined
    ].join(' '); }
});

var TitleLabel = React.createClass({
  render() {
    return h1({
      className: 'tic-tac-toe--title-label',
      children: this.props.winner ? `${this.props.winner} wins` : undefined
    });
  }
});

var NewGameButton = React.createClass({
  render() {
    return div({
      className: 'tic-tac-toe--new-game-button',
      children: 'New game',
      onMouseUp: this.props.onClick
    });
  }
});