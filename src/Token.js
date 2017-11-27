import React, { Component } from 'react';
import './Token.css';

class Token extends Component {
  constructor(props){
    super(props);
    this.state = {
      "action":"none"
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
      <span className="token">
        <span className="head">
          <span className="gear"></span>
          <span className="hair"></span>
          <span className="eyes"></span>
        </span>
        <span className="neck">
          <span className="gear"></span>
        </span>
        <span className="arm left">
          <span className="gear"></span>
          <span className="hand">
            <span className="gear"></span>
            <span className="weapon"></span>
          </span>
        </span>
        <span className="arm right">
          <span className="gear"></span>
          <span className="hand">
            <span className="gear"></span>
            <span className="weapon"></span>
          </span>
        </span>
        <span className="torso">
          <span className="gear"></span>
        </span>
        <span className="waist">
          <span className="gear"></span>
        </span>
        <span className="leg left">
          <span className="gear"></span>
          <span className="foot">
            <span className="gear"></span>
          </span>
        </span>
        <span className="leg right">
          <span className="gear"></span>
          <span className="foot">
            <span className="gear"></span>
          </span>
        </span>
      </span>
    );
  }
}

export default Token;
