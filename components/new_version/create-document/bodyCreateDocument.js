import React, { Component } from 'react';
import ContractList from './contractList';
import formatDate from 'intl-dateformat';
import {Redirect} from 'react-router-dom';

class BodyCreateDocument extends Component{
    constructor(props){
        super(props);
        this.state = {
            contractName: "Config 10 Dev",
            projectedCI: 1,
            editorName: localStorage.getItem('username'),
            contractedCi: 1,
            contractedDev: 10,
            contractedQa: 10,
            contractedTotalUsers: 0,
            contractedVm: 12
        }
        this.updateInput = this.updateInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        }
        updateInput(event){
            if (event.target.id == "contractStartDatePDT"){
                event.target.value = formatDate(event.target.value, 'YYYY/MM/DD')
            }
            this.setState({[event.target.id] : event.target.value})
            if ((event.target.id == 'contractName') && (event.target.value != 'Custom')){
                const contractAttributes = ['Ci', 'Dev', 'Qa', 'TotalUsers', 'VM']
                for (var i in contractAttributes){
                    var value = JSON.parse(localStorage.getItem('pricePlan'))[event.target.value]["max"+contractAttributes[i]]
                    if (contractAttributes[i] == 'VM'){
                        this.setState({['contractedVm']: value})
                    }else{
                        this.setState({['contracted'+contractAttributes[i]]: value})
                    }
                }
            }
        }
        createNewDocument(){
            let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/document/'
            const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
            fetch(URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AuthStr
                },
                redirect: 'follow',
                body: JSON.stringify(this.state)
            }).then(response => {
                return response.json()
            }).then(json => {
                return this.setState({id: '/' +json.id})
            })
        }
        handleSubmit(){
            document.getElementById('customerName').classList.remove('input-error')
            if ((this.state.customerName == undefined) || (this.state.customerName == '')){
                document.getElementById('customerName').classList.add('input-error')
            }else{
                return this.createNewDocument()
            }
        }
    render(){
        if (this.state.id !== undefined){
            return <Redirect to={this.state.id}/>
        }
        return(
            <div className="row">
                <div className="col-md-4">
                    <div className="panel">
                        <div className="panel-body">
                            <div className="row ">
                                <div className="col-md-6 text-row">
                                    Customer name <b className="mandaroryIcon">*</b>
                                </div>
                                <div className="col-md-6">
                                    <input className="form-control" type="text" placeholder="Customer Name" id="customerName" onChange={this.updateInput} maxLength="15"></input>
                                </div>
                            </div>
                            <div className="row ">
                                <div className="col-md-6 text-row">
                                    Project name
                                </div>
                                <div className="col-md-6">
                                    <input type="text" placeholder="Project Name" className="form-control" id="projectName" onChange={this.updateInput}></input>
                                </div>
                            </div>
                            <div className="row ">
                                <div className="col-md-6 text-row">
                                    Number of automated test cases
                                </div>
                                <div className="col-md-6">
                                    <input type="text" className="form-control" id="amountTests"></input>
                                </div>
                            </div>
                            <div className="row ">
                                <div className="col-md-6 text-row">
                                    Technical Lead (JIRA login)
                                </div>
                                <div className="col-md-6">
                                    <input type="text" placeholder="JIRA login" className="form-control" id="techLead" onChange={this.updateInput}></input>
                                </div>
                            </div>
                            <div className="row ">
                                <div className="col-md-6 text-row">
                                    Project Manager (JIRA login)
                                </div>
                                <div className="col-md-6">
                                    <input type="text" placeholder="JIRA login" className="form-control" id="projectManager" onChange={this.updateInput}></input>
                                </div>
                            </div>
                            <div className="row ">
                                <div className="col-md-6 text-row">
                                    Delivery Manager (JIRA login)
                                </div>
                                <div className="col-md-6">
                                    <input type="text" placeholder="JIRA login" className="form-control" id="deliveryManager" onChange={this.updateInput}></input>
                                </div>
                            </div>
                            <div className="row ">
                                <div className="col-md-12">
                                    <a className="btn btn-primary pull-right" onClick={this.handleSubmit} id="createDocument">Create Document</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="panel">
                        <ContractList changeInput={this.updateInput}/>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="panel">
                        <div className="panel-body">
                            2
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default BodyCreateDocument