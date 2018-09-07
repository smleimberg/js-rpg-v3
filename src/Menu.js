import React, { Component } from 'react';
import './Menu.css';

class Menu extends Component {
  constructor(props){
    super(props);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.doAction = this.doAction.bind(this);
    this.state = {
      "gameStart":false,
      "currentMenu":"startGame",
      "reticleParent":0,
      "reticleSub":false,
      "menus":require('./gameData/menus.json'),
      "settings":require('./gameData/settings.json')
    }
  }

  /* INTERACTION FUNCTIONS */
  componentWillReceiveProps(nextProps) {
    if(nextProps.menuIs==='open'){
      this.performAction(nextProps.action);
    }
  }
  moveReticle(dir){
    var parentIndex = this.state.reticleParent;
    var subIndex = this.state.reticleSub;
    var parentButtonCount = 0;
    var subButtonCount = 0;
    switch (dir) {
      case 'n':
      case 'w':
        if(this.state.reticleParent !== false && this.state.reticleSub === false){
          parentButtonCount = document.querySelectorAll('#main-menu .btn_parent, #main-menu .btn').length;
          if(this.state.reticleParent > 0){
            parentIndex--;
          }else{
            parentIndex=parentButtonCount-1;
          }
        }else if(this.state.reticleSub !== false){
          subButtonCount = document.getElementsByClassName('btn_'+this.state.reticleParent+'_sub').length;
          if(this.state.reticleSub > 0){
            subIndex--;
          }else{
            subIndex=subButtonCount-1;
          }
        }
        break;
      case 's':
      case 'e':
        if(this.state.reticleParent !== false && this.state.reticleSub === false){
          parentButtonCount = document.querySelectorAll('#main-menu .btn_parent, #main-menu .btn').length;
          if(this.state.reticleParent < parentButtonCount-1){
            parentIndex++;
          }else{
            parentIndex=0;
          }
        }else if(this.state.reticleSub !== false){
          subButtonCount = document.getElementsByClassName('btn_'+this.state.reticleParent+'_sub').length;
          if(this.state.reticleSub < subButtonCount-1){
            subIndex++;
          }else{
            subIndex=0;
          }
        }
        break;
      default: break;
    }
    this.setState({
      'reticleParent':parentIndex,
      'reticleSub':subIndex
    });
  }
  doAction(button,action){
    console.log('action',action,button);
    switch (action) {
      case 'changeSetting':
        var settings = Object.assign({},this.state.settings);
        settings[button.getAttribute('data-setting')].value = button.getAttribute('data-setting-value');
        this.setState({'settings':settings});
        break;
      case 'reticleOnSub':
        this.setState({
          'reticleSub':0
        })
        break;
      case 'reticleOnParent':
        this.setState({
          'reticleSub':false
        })
        break;
      case 'menuClose':
        this.props.sendAction('menuClose');
        this.setState({
          'currentMenu':'mainMenu',
          'reticleParent':1,
          'reticleSub':false
        });
        break;
      case 'openSubmenuA':
        var submenu = button.getAttribute('data-submenu-a');
        var reticleParent = 2;
        if(submenu==='mainMenu'){
            reticleParent = 1;
        }
        this.setState({
          'currentMenu':submenu,
          'reticleParent':reticleParent,
          'reticleSub':false
        });
        break;
      case 'playNewGame':
        this.props.sendAction('playNewGame');
        this.setState({
          'gameStart':true,
          'currentMenu':'mainMenu',
          'reticleParent':1,
          'reticleSub':false
        });
        break;
      default: break;
    }
  }
  doReticleAction(fn){
    var button = false;
    if(this.state.reticleSub === false){
      button = document.getElementById('btn_'+this.state.reticleParent);
    }else{
      button = document.getElementById('btn_'+this.state.reticleParent+'_sub_'+this.state.reticleSub);
    }
    if(fn!=='start' && button){
      var action = button.getAttribute('data-'+fn+'-action');
      console.log(action);
      this.doAction(button,action);
    }
  }
  performAction(fn){
    switch (fn) {
      case 'n':
      case 's':
      case 'e':
      case 'w':
        this.moveReticle(fn); break;
      case 'a':
      case 'b':
      case 'start':
        this.doReticleAction(fn);
        break;
      default: break;
    }
  }
  buttonHasReticle(parent,sub){
    if(this.state.reticleParent === parent && sub === false && this.state.reticleSub===false){
      return true;
    }else if(this.state.reticleParent === parent && sub !== false){
      if(this.state.reticleSub === sub){
        return true;
      }
    } else return false;
  }
  onChange(event){
    console.log('onChange',event);
  }
  handleMenuClick(e){
    console.log('click');
    e.preventDefault();
    this.doAction(e.target,e.target.getAttribute('data-a-action'));
  }
  componentDidMount(){
    var menuButtons = document.querySelectorAll("#main-menu .btn_sub,#main-menu .btn");
    for(var i=0;i<menuButtons.length;i++){
      menuButtons[i].addEventListener('click',this.handleMenuClick);
    }
  }
  render() {
    console.log('render');
    var currentMenu = this.state.menus[this.state.currentMenu];
    var currentMenuOptions = [];
    var buttonSubCount = false;
    var currentMenuButtonCount = 0;
    if(this.state.gameStart !== false){
      if(this.state.currentMenu==='mainMenu'){
        currentMenuButtonCount = 1;
      }else{
        currentMenuButtonCount = 2;
      }
    }
    var reticleClass = '';
    switch(currentMenu.type){
      case 'custom':
        switch(this.state.currentMenu){
          case 'settings':
          case 'startGame':
            for(var setting in this.state.settings){
              var thisSetting = this.state.settings[setting];
              switch(thisSetting.type){
                case 'radio':
                  var radioGroup = [
                    React.createElement('h2',{
                        'id':'setting_title_'+thisSetting.name,
                        'key':'setting_title_'+thisSetting.name
                      },thisSetting.text
                    )
                  ];
                  var i;
                  var subButtonWidth = {
                    2:"medium-2",
                    3:"medium-3",
                    4:"medium-4",
                    5:"medium-5",
                  }
                  for(i=0;i<thisSetting.options.length;i++){
                    var option = thisSetting.options[i];
                    var labelChildren = [];
                    console.log(this.state.settings[setting].value,option.value);
                    var radioChecked = (this.state.settings[setting].value === option.value)?true:false;
                    labelChildren.push(
                      React.createElement('input',{
                        'type':thisSetting.type,
                        'className':thisSetting.type,
                        'name':thisSetting.name,
                        'id':thisSetting.type+'_'+thisSetting.name+'_'+option.value,
                        'key':thisSetting.type+'_'+thisSetting.name+'_'+option.value,
                        'value':option.value,
                        'checked':radioChecked,
                        'onChange':this.onChange.bind(this)
                      },null)
                    );
                    labelChildren.push(option.text);
                    var buttonHasReticle = this.buttonHasReticle(currentMenuButtonCount,i);
                    if(buttonSubCount===false){
                      buttonSubCount = buttonHasReticle?thisSetting.options.length:false;
                    }
                    reticleClass = buttonHasReticle?'reticle':'';
                    radioGroup.push(
                      React.createElement('div',{
                          'className':'btn_sub btn_'+currentMenuButtonCount+'_sub small-1 '+subButtonWidth[thisSetting.options.length]+' '+reticleClass,
                          'id':'btn_'+currentMenuButtonCount+'_sub_'+i,
                          'key':'btn_'+currentMenuButtonCount+'_sub_'+i,
                          'data-setting':setting,
                          'data-setting-value':option.value,
                          'data-a-action':'changeSetting',
                          'data-b-action':'reticleOnParent',
                          'onClick':this.handleMenuClick.bind(this)
                        },
                        React.createElement('label',{
                            'htmlFor':'radio_'+thisSetting.name+'_'+option.value,
                            'id':'label_'+thisSetting.name+'_'+option.value,
                            'key':'label_'+thisSetting.name+'_'+option.value
                          },labelChildren
                        )
                      )

                    );
                  }
                  reticleClass = this.buttonHasReticle(currentMenuButtonCount,false)?'reticle':'';
                  currentMenuOptions.push(React.createElement('div',{
                      'id':'btn_'+currentMenuButtonCount,
                      'key':'btn'+currentMenuButtonCount,
                      'data-a-action':'reticleOnSub',
                      'className':'btn_parent setting '+reticleClass,
                    },radioGroup
                  ));
                  currentMenuButtonCount++;
                  break;
                default: break;
              }
            }
            break;
          case 'continueGame':
            break;
          default: break;
        }
        break;
      case 'submenu':
        var submenuList = this.state.menus[this.state.currentMenu].list;
        for(i=0;i<submenuList.length;i++){
          reticleClass = this.buttonHasReticle(currentMenuButtonCount,false)?'reticle':'';
          currentMenuOptions.push(
            React.createElement('div',{
              'id':"btn_"+currentMenuButtonCount,
              'key':"btn_"+currentMenuButtonCount,
              'className':'btn '+reticleClass,
              'data-a-action':'openSubmenuA',
              'data-submenu-a':submenuList[i],
              'onClick':this.handleMenuClick.bind(this)
            },submenuList[i])
          );
          currentMenuButtonCount++;
        }
        break;
      default: /* nothing */ break;
    }
    var submitButtons = [];
    if(currentMenu.hasOwnProperty('submit')){
      var j;
      for(j=0;j<currentMenu.submit.length;j++){
        var button = currentMenu.submit[j];
        reticleClass = this.buttonHasReticle(currentMenuButtonCount,false)?'reticle':'';
        submitButtons.push(
          React.createElement('div',{
              'id':"btn_"+currentMenuButtonCount,
              'key':"btn_"+currentMenuButtonCount,
              'className':'btn submit '+reticleClass,
              'data-a-action':button.action,
              'onClick':this.handleMenuClick.bind(this)
            },button.text
          )
        )
        currentMenuButtonCount++;
      }
    }

    if( (this.state.currentMenu==='startGame' && this.state.gameStart) || this.state.currentMenu!=='startGame'){
      var reticle_btn_0 = this.buttonHasReticle(0,false)?'reticle':'';
      var reticle_btn_1 = this.buttonHasReticle(1,false)?'reticle':'';
      var backButtonMenu = '';
      if(this.state.menus[this.state.currentMenu].hasOwnProperty('back')){
        backButtonMenu = this.state.menus[this.state.currentMenu].back;
      }
      var backButton = '';
      var closeButton = React.createElement('div',{
        'id':'btn_0',
        'key':'btn_0',
        'className':'btn menu-close '+reticle_btn_0,
        'data-a-action':'menuClose',
        'onClick':this.handleMenuClick.bind(this)
      },"X");
      if(this.state.currentMenu!=='mainMenu'){
        backButton = React.createElement('div',{
          'id':'btn_1',
          'key':'btn_1',
          'className':'btn menu-up '+reticle_btn_1,
          'data-a-action':'openSubmenuA',
          'data-submenu-a':backButtonMenu,
          'onClick':this.handleMenuClick.bind(this)
        },"< back");
      }
    }

    return (
      <div id="menu" className={this.state.currentMenu}>
        <div id="screen-wrap">
          <div id="screen">
            <div id="main-menu">
              {closeButton}
              <div className="title"><h1>{currentMenu.title}</h1></div>
              <div className="text"><p>{currentMenu.text}</p></div>
              <div className="options">
                {backButton}
                {currentMenuOptions}
              </div>
              <div className="submit">{submitButtons}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Menu;
