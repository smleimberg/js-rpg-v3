import React, { Component } from 'react';
import './App.css';
import './Controls.css';

import Map from './Map.js';
import Menu from './Menu.js';

class App extends Component {
  constructor(props){
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleControlClick = this.handleControlClick.bind(this);
    this.state = {
      "action":"none",
      "menuOpen":false,
      "settings":require('./gameData/settings.json')
    }
  }
  performAction(fn){
    switch (fn) {
      case 'start':
        var menuOpen = this.state.menuOpen ? false : true;
        this.setState({"menuOpen":menuOpen});
        break;
      default: break;
    }
  }
  handleKeyDown(e){
    var _=this;
    Object.keys(_.state.settings.keys.keyCodes).forEach(function(fn) {
      if(e.keyCode===_.state.settings.keys.keyCodes[fn]){
        _.performAction(fn);
        _.setState({"action":fn});
      }
    });
  }
  handleControlClick(e){
    var fn = e.target.getAttribute('data-btn');
    this.performAction(fn);
    this.setState({"action":fn});
  }
  componentDidMount(){
    document.getElementById("body").addEventListener("keydown", this.handleKeyDown);
    var controlButtons = document.querySelectorAll("#controls .btn");
    for(var i=0;i<controlButtons.length;i++){
      controlButtons[i].addEventListener('click',this.handleControlClick);
    }
  }
  render() {
    var menuIs = this.state.menuOpen ? 'open' : 'closed';
    var mapAction = this.state.menuOpen ? 'none' : this.state.action;
    var menuAction = this.state.menuOpen ? this.state.action : 'none';
    var controlClass = this.state.settings.input.value;
    var appClasses = "controls-"+controlClass+" menu-"+menuIs;

    return (
      <div id="app" className={appClasses}>
        <Map ref="map" menuIs={menuIs} action={mapAction} />
        <Menu ref="menu" menuIs={menuIs} action={menuAction} />
        <div id="controls" className="controls">
          <div id="dpad">
            <a className="left btn" data-btn="w" href="#left-btn"><span>a</span></a>
            <a className="up btn" data-btn="n" href="#up-btn"><span>w</span></a>
            <a className="right btn" data-btn="e" href="#right-btn"><span>d</span></a>
            <a className="down btn" data-btn="s" href="#down-btn"><span>s</span></a>
          </div>
          <div id="buttons">
            <a className="_a btn" data-btn="a" href="#a-btn"><span>j</span></a>
            <a className="_b btn" data-btn="b" href="#b-btn"><span>k</span></a>
          </div>
          <a className="start btn" data-btn="start" href="#start-btn"><span>space</span></a>
        </div>
      </div>
    );
  }
}

export default App;
