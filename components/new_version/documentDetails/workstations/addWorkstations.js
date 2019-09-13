import React, { Component } from 'react';

class AddWorkstations extends Component{
    constructor(props){
        super(props);
        this.state = {workstations_quantity: '', workstations_role: ''}
        this.changeInput = this.changeInput.bind(this);
        this.add = this.add.bind(this);
    }
    changeInput(event){
        this.setState({[event.target.id] : [event.target.value]});
    }
    add(){
        document.getElementById("workstations_quantity").classList.remove("input-error")
        document.getElementById("workstations_role").classList.remove("input-error")
        var flagError = false
        if (this.state.workstations_quantity == ""){
            document.getElementById("workstations_quantity").classList.add("input-error")
            flagError = true
        }
        if (this.state.workstations_role == ""){
            document.getElementById("workstations_role").classList.add("input-error")
            flagError = true
        }
        if(!flagError){ 
            this.props.addWorkstations(this.state.workstations_quantity, this.state.workstations_role)
        }
    }
    render(){
        return(
            <div className="input-group disable-div" key={this.props.data.length}>
                <span className="input-group-addon">Quantity</span>
                <input type="text" id="workstations_quantity" defaultValue="" className="form-control" onChange={this.changeInput}/>
                <span className="input-group-addon">Role</span>
                <select defaultValue="" className="form-control" id="workstations_role" onChange={this.changeInput}>
                    <option value='' disabled></option>
                    <option value='Developer'>Developer</option>
                    <option value='QA'>QA</option>
                </select>
                <span className="input-group-btn">
                    <button className="btn btn-primary" onClick={this.add}>Add Workstations</button>
                </span>
            </div>
        )
    }
}
export default AddWorkstations
