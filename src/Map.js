import React, { Component } from 'react';
import './Map.css';
import './Tiles.css';

import Token from './Token.js';

class Map extends Component {
  constructor(props) {
    super(props);
    var characterData = require('./gameData/character.json');
    var mapsData = {
      "map1":require('./gameData/maps/map1.json'),
      "map2":require('./gameData/maps/map2.json')
    }
    var currentMapData = mapsData[characterData.location.map];
    this.state = {
      data_loaded: false,
      max_rows: 3,
      max_cols: 3,
      character: characterData,
      map: currentMapData,
      map_font_size: 50,
      maps: mapsData
    };
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  /* INTERACTION FUNCTIONS */
  componentWillReceiveProps(nextProps) {
    if(nextProps.menuIs==='closed'){
      this.performAction(nextProps.action);
    }
  }
  performAction(fn){
    switch (fn) {
      case 'n':
      case 'e':
      case 's':
      case 'w':
        this.move(fn);
        break;
      default: break;
    }
  }
  move(dir){
    var character = this.state.character;
    var new_row = parseInt(character.location.row,10);
    var new_col = parseInt(character.location.col,10);
    switch (dir) {
      case 'n': new_row = new_row-1; break;
      case 'e': new_col = new_col+1; break;
      case 's': new_row = new_row+1; break;
      case 'w': new_col = new_col-1; break;
      default: break;
    }
    character.location.facing = dir;
    character.location.foot = character.location.foot==='l' ? 'r' : 'l' ;
    if(this.maybeActivateTile(dir,new_row,new_col)===false){
      character.location.row = new_row;
      character.location.col = new_col;
    }
    this.setState({character});
  }
  maybeActivateTile(dir,new_row,new_col){
    var new_tile = 'r'+new_row+'_c'+new_col;
    var current_tile = 'r'+this.state.character.location.row+'_c'+this.state.character.location.col;
    if( this.state.map.tiles.hasOwnProperty(current_tile) && this.state.map.tiles[current_tile].hasOwnProperty('object') ){
      var currentTileObject = this.state.map.tiles[current_tile].object;
      if( currentTileObject.type==='portal' && currentTileObject.direction===dir){
        var ctCharacter = this.state.character;
        var ctPortal = this.state.map.tiles[current_tile].object;
        ctCharacter.location.map = ctPortal.map;
        ctCharacter.location.row = parseInt(ctPortal.row,10);
        ctCharacter.location.col = parseInt(ctPortal.col,10);
        var ctPortalMap = this.state.maps[ctPortal.map];
        this.setState({
          'character':ctCharacter,
          'map':ctPortalMap
        });
        return true;
      }
    }else if( this.state.map.tiles.hasOwnProperty(new_tile) && this.state.map.tiles[new_tile].hasOwnProperty('object') ){
      var tileObject = this.state.map.tiles[new_tile].object;
      if( tileObject.type==='portal' && tileObject.direction==='_C'){
        var ntCharacter = this.state.character;
        var ntPortal = this.state.map.tiles[new_tile].object;
        ntCharacter.location.map = ntPortal.map;
        ntCharacter.location.row = parseInt(ntPortal.row,10);
        ntCharacter.location.col = parseInt(ntPortal.col,10);
        var ntPortalMap = this.state.maps[ntPortal.map];
        this.setState({
          'character':ntCharacter,
          'map':ntPortalMap
        });
        return true;
      }else if( tileObject.type==='chest' ){
        return true;
      }
    }else if( new_row<0 || new_row>=this.state.map.height || new_col<0 || new_col>=this.state.map.width ){
      return true;
    }else if( this.state.map.tiles.hasOwnProperty(new_tile) && this.state.map.tiles[new_tile].hasOwnProperty('scenery') ){
      return true;
    }
    return false;
  }

  /* SETUP FUNCTIONS */
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    this.updateDimensions();
  }
  updateDimensions() {

    var min_tile_diameter = 17; // 16+1
    var max_tile_diameter = 49; // (16*3)+1
    var map_font_size = 50;
    var px_height = document.getElementById("map").clientHeight-this.state.map_font_size;
    var px_width = document.getElementById("map").clientWidth-this.state.map_font_size;
    var max_tile_rows = Math.floor(px_height/map_font_size);
    max_tile_rows = (max_tile_rows%2===0) ? max_tile_rows-1 : max_tile_rows;
    var max_tile_cols = Math.floor(px_width/map_font_size);
    max_tile_cols = (max_tile_cols%2===0) ? max_tile_cols-1 : max_tile_cols;

    if( max_tile_rows < min_tile_diameter || max_tile_cols < min_tile_diameter ){
      if( max_tile_rows===max_tile_cols ){
        map_font_size = Math.floor(px_width/min_tile_diameter);
      }else if( max_tile_rows < min_tile_diameter ){
        map_font_size = Math.floor(px_height/min_tile_diameter);
      }else if( max_tile_cols < min_tile_diameter ){
        map_font_size = Math.floor(px_width/min_tile_diameter);
      }
      max_tile_rows = Math.floor(px_height/map_font_size);
      max_tile_rows = (max_tile_rows%2===0) ? max_tile_rows-1 : max_tile_rows;
      max_tile_cols = Math.floor(px_width/map_font_size);
      max_tile_cols = (max_tile_cols%2===0) ? max_tile_cols-1 : max_tile_cols;
    }

    max_tile_rows = (max_tile_rows > max_tile_diameter)?max_tile_diameter:max_tile_rows;
    max_tile_cols = (max_tile_cols > max_tile_diameter)?max_tile_diameter:max_tile_cols;

    this.setState({
      "map_font_size": map_font_size,
      "max_rows": max_tile_rows,
      "max_cols": max_tile_cols,
    });

  }

  buildTiles() {
    var character = this.state.character;
    var tilesHTML = [];

    var char_row_col = 'r'+character.location.row+'_c'+character.location.col;
    var rmin = (parseInt(character.location.row,10)-Math.floor(this.state.max_rows/2));
    var rmax = (parseInt(character.location.row,10)+Math.floor(this.state.max_rows/2));
    var cmin = (parseInt(character.location.col,10)-Math.floor(this.state.max_cols/2));
    var cmax = (parseInt(character.location.col,10)+Math.floor(this.state.max_cols/2));

    for(var r=rmin;r<=rmax;r++){
      var columns = [];
      for(var c=cmin;c<=cmax;c++){
        var key = 'r'+r+'_c'+c;
        var tileObjects = [];
        if(key===char_row_col){
          tileObjects.push( <Token key="player" facing={character.location.facing} foot={character.location.foot} /> );
        }
        if(this.state.map.tiles.hasOwnProperty(key)) {
          if(this.state.map.tiles[key].hasOwnProperty('scenery')){
            tileObjects.push( React.createElement('span',{
              className:'scenery '+this.state.map.tiles[key].scenery.class,
              key:'scn_r'+r+'_c'+c},null) );
          }
          if(this.state.map.tiles[key].hasOwnProperty('object')){
            tileObjects.push( React.createElement('span',{
              className:'object '+this.state.map.tiles[key].object.class,
              key:'obj_r'+r+'_c'+c},null) );
          }else if(this.state.map.tiles[key].hasOwnProperty('items')){
            for(var i=0;i<this.state.map.tiles[key].items.length;i++){
              var itemName = this.state.map.tiles[key].items[i];
              if(itemName.indexOf('money_')===0){
                tileObjects.push( React.createElement('span',{'className':'money',key:'money_r'+r+'_c'+c},null) );
              }else{
                tileObjects.push( React.createElement('span',{'className':'item','id':itemName,'key':'item_'+itemName},null) );
              }
            }
          }

        }

        if(r<0||r>=this.state.map.width||c<0||c>=this.state.map.height){
          columns.push( React.createElement('li',{'className':'column blank','id':key,'key':'col_'+c},null) );
        }else if(this.state.map.tiles.hasOwnProperty(key) && this.state.map.tiles[key].hasOwnProperty('class')){
          columns.push( React.createElement('li',{'className':'column tile '+this.state.map.tiles[key].class,'id':key,'key':'col_'+c},tileObjects) );
        }else{
          //tileObjects.push('r'+r+'_c'+c);
          columns.push( React.createElement('li',{'className':'column tile '+this.state.map.defaultTile,'id':key,'key':'col_'+c},tileObjects) );
        }

      }
      tilesHTML.push( React.createElement('ul',{'className':'row','id':'row_'+r,'key':'row_'+r},columns) );
    }
    return tilesHTML;
  }

  /* RENDER */
  render() {
    var tilesHTML = this.buildTiles();
    return (
      <div id="map" className="map table" ref={(divElement)=>this.divElement=divElement}
        style={{
          fontSize: this.state.map_font_size+"px"
        }} >
        <div className="table-cell">
          <div className="tile-wrap">
            {tilesHTML}
          </div>
        </div>
      </div>
    );
  }
}

export default Map;
