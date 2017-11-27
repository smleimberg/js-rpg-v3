import React, { Component } from 'react';
import './Menu.css';

class Menu extends Component {
  constructor(props){
    super(props);
    this.state = {
      "action":"none",
      "currentMenu":"startScreen",
      "menus":require('./gameData/menus.json')
    }
  }

  /* INTERACTION FUNCTIONS */
  componentWillReceiveProps(nextProps) {
    if(nextProps.menuIs==='open'){
      this.performAction(nextProps.action);
    }
  }
  performAction(fn){
    switch (fn) {
      case 'start':
        //var menuOpen = this.state.menuOpen ? false : true;
        //this.setState({"menuOpen":menuOpen});
        break;
      default: break;
    }
  }
  componentDidMount(){

  }
  render() {
    return (
      <div id="menu" className="menu">

      </div>
    );
  }
}

export default Menu;
