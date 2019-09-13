import React, { Component } from 'react';

class AddHosts extends Component{
    constructor(props){
        super(props);
        this.state = {hosts_quantity: '', hosts_type: ''}
        this.changeInput = this.changeInput.bind(this);
        this.add = this.add.bind(this);
    }
    changeInput(event){
        this.setState({[event.target.id] : [event.target.value]});
    }
    add(){
        document.getElementById("hosts_quantity").classList.remove("input-error")
        document.getElementById("hosts_type").classList.remove("input-error")
        var flagError = false
        if (this.state.hosts_quantity == ""){
            document.getElementById("hosts_quantity").classList.add("input-error")
            flagError = true
        }
        if (this.state.hosts_type == ""){
            document.getElementById("hosts_type").classList.add("input-error")
            flagError = true
        }
        if(!flagError){ 
            this.props.addHosts(this.state.hosts_quantity, this.state.hosts_type)
        }
    }
    render(){
        return(
            <div className="input-group disable-div" key={this.props.templates.length}>
                <span className="input-group-addon">Quantity</span>
                <input type="text" id="hosts_quantity" defaultValue="" className="form-control" onChange={this.changeInput}/>
                <span className="input-group-addon">Type</span>
                <select defaultValue="" className="form-control" id="hosts_type" onChange={this.changeInput}>
                    <option value='' disabled></option>
                    {this.props.templates
                    .map(key => <option value={key.serverType} key={Object.values(key)}>{key.serverType}</option>
                    )}
                </select>
                <span className="input-group-btn">
                    <button className="btn btn-primary" onClick={this.add}>Add Hosts</button>
                </span>
            </div>
        )
    }
}
export default AddHosts
