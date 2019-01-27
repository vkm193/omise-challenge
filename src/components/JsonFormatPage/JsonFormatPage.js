import React, { Component } from 'react';
import './JsonFormatPage.scss';

export default class JsonFormatPage extends Component {
  constructor(props, context){
    super(props, context);
    this.state = {
      formattedJson: ''
    }
    this.onTextChange = this.onTextChange.bind(this);
  }

  onTextChange(event){
  const formattedJson = this.formattedJson(event.target.value);
  this.setState({formattedJson});
}

formattedJson(nodeArray){
  if(typeof nodeArray === 'string'){
    try{
      nodeArray = JSON.parse(nodeArray);
    }catch{
      return 'Not a json string';
    }
  }
  let objects = [];
  Object.keys(nodeArray).map((key) => {
    objects = [...objects, ...nodeArray[key]];
  });
  let result = this.insertChildren(objects);
  let stringifyResult;
  try{
    stringifyResult = JSON.stringify(result, null, 2);
  }catch{
    stringifyResult = `Some error occured while stringifying JSON.`;
  }
  return stringifyResult;
}

insertChildren(objects, value, orphan){
  try{
    objects.forEach((object, parentIndex) => {
      if(value){
        object = value;
      }
      if(object.parent_id === null){
        return;
      }
      for(let index= 0; index < objects.length; index++){
        let item = objects[index];
        if(!item){
          continue;
        }
        if(object.parent_id === item.id){
          if(!(objects[index].children.includes(object))){
            objects[index].children.push(object);
          }
          if(!value){
            delete objects[parentIndex];
          }else{
            const childIndex = orphan.findIndex(item => item === value);
            if(childIndex !== -1){
              delete orphan[childIndex];
            }
          }
          break;
        }else{
          if(item.children.length){
            orphan = orphan ? orphan : objects;

            //Need recursive call for finding current element inside children
           this.insertChildren(item.children, object, orphan);
          }
        }
      }
    });
    //delete leaves null after removing element, cleaning up here
    objects = objects.filter((item) => item !== null);
  }catch{
    return `Some error occured while formatting JSON.`;
  }
    return objects;
}

  render() {
    return (
      <div className="json-page">
        <div id="input-box" className="input-box">
          <textarea onChange={this.onTextChange} placeholder="Add your JSON here..." />
        </div>
        <div id="output-box" className="output-box">
          <pre>
            {this.state.formattedJson && this.state.formattedJson.length ?  this.state.formattedJson : message}
          </pre>
        </div>
      </div>
    )
  }
}

const message = `Paste your json in left side box to see it's formatted output here.`;
