import React, { Component } from 'react';
import './jsonFormatPage.scss';

export default class JsonFormatPage extends Component {
  constructor(props, context){
    super(props, context);
    this.state = {
      formattedJson: ''
    }
    this.onTextChange = this.onTextChange.bind(this);
  }

  onTextChange(event){
  if(event.target.value){
    const formattedJson = this.formattedJson(event.target.value);
    this.setState({formattedJson});
  }else{
    this.setState({formattedJson: ''});
  }
}

formattedJson(nodeArray){
  if(typeof nodeArray === 'string'){
    try{
      nodeArray = JSON.parse(nodeArray);
    }catch{
      return 'Not a json string.';
    }
  }
  let objects = [];
  let result;
  let stringifyResult;
  try{
  Object.keys(nodeArray).map((key) => {
    if(nodeArray[key] instanceof Array){
      objects = [...objects, ...nodeArray[key]];
    }
  });
  }catch(error){
    result = `Data is not in proper format.`;
  }
  if(objects.length){
    result = this.insertChildren(objects);
  }else{
    result = nodeArray;
  }
  try{
    stringifyResult = JSON.stringify(result, null, 2);
  }catch(error){
    stringifyResult = `Some error occured while stringifying JSON. Error - ${error}`;
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
          <textarea onChange={this.onTextChange} placeholder={message} />
        </div>
        {this.state.formattedJson && this.state.formattedJson.length ? 
        (
          <div id="output-box" className="output-box">
            <pre>
              {this.state.formattedJson}
            </pre>
          </div>
        ) : ''}
      </div>
    )
  }
}

const message = `Paste your json in this box to see it's formatted output.`;
