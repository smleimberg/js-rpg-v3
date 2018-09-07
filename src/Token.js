import React, { Component } from 'react';
import './Token.css';

class Token extends Component {
  constructor(props){
    super(props);
    this.state = {
      "facing":props.facing,
      "foot":props.foot
    }
  }

  /* INTERACTION FUNCTIONS */
  componentWillReceiveProps(nextProps) {
    this.setState({
      "facing":nextProps.facing,
      "foot":nextProps.foot
    })
  }
  performAction(fn){

  }
  componentDidMount(){

  }
  render() {
    var tokenClasses = "token facing-"+this.state.facing+" foot-"+this.state.foot;
    return (
      <span className={tokenClasses}>
        <span className="head">
          <span className="gear"></span>
          <span className="hair"></span>
          <span className="eyes"></span>
        </span>
        <span className="neck">
          <span className="gear"></span>
        </span>
        <span className="torso">
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
