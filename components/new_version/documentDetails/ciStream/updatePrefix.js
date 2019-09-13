import React, { Component } from 'react';

class UpdatePrefix extends Component{
    constructor(props){
        super(props);
        this.state = {hosts_prefix: ""}
        this.changeInput = this.changeInput.bind(this);
        this.update = this.update.bind(this);
    }
    changeInput(event){
        this.state[event.target.id] = event.target.value
    }
    update(){
        this.props.updatePreffix(this.state.hosts_prefix)
    }
    render(){
        return(
            <div className="input-group disable-div">
                <span className="input-group-addon">Hosts prefix</span>
                <input type="text" id="hosts_prefix" defaultValue="" className="form-control" onChange={this.changeInput}/>
                <span className="input-group-btn">
                    <button className="btn btn-primary"onClick={this.update}>Update Prefix</button>
                </span>
            </div>
        )
    }
}
export default UpdatePrefix
