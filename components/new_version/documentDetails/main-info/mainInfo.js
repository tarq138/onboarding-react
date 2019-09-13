import React, { Component } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { DateUtils } from 'react-day-picker';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faInfoCircle, faSyncAlt} from "@fortawesome/free-solid-svg-icons";
library.add(faInfoCircle, faSyncAlt);
import Modal from 'react-modal';

class MainInfo extends Component{
    constructor(props){
        super(props);
        this.state = {data: this.props.data, dataTickets: {}, modalIsOpen:false};
        this.webSocket = this.webSocket.bind(this);
        this.updateTickets = this.updateTickets.bind(this);
        this.updateDocument = this.updateDocument.bind(this);
        this.changeInput = this.changeInput.bind(this);
        this.changeContract = this.changeContract.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.webSocket();
    }
    openModal() {
        this.setState({modalIsOpen: true});
    }
    closeModal() {
        this.setState({modalIsOpen: false});
    }
    webSocket(){
        var sock = new SockJS(localStorage.getItem('urlPrefix')+'/websocket/tracker?access_token='+localStorage.getItem('tokenId'));
        var documentId = this.props.documentId;
        const stompClient  = Stomp.over(sock);
        stompClient.connect({}, () =>{
            stompClient.subscribe('/topic/jira', (response)=>{
                var data = this.state.data
                response = JSON.parse(response.body)
                if (response.projectMainTicket != null){
                    data.jiraTicket = response.projectMainTicket.key
                    data.jiraTicketStatus = response.projectMainTicket.status
                }
                if (response.hostMainTicket != null){
                    data.jiraTicket = response.hostMainTicket.key
                    data.jiraTicketStatus = response.hostMainTicket.status
                }
                if (response.userMainTicket != null){
                    data.jiraTicket = response.userMainTicket.key
                    data.jiraTicketStatus = response.userMainTicket.status
                }
                data.documentTickets = response.documentTickets
                data.tickets = response.customerTickets
                this.setState({dataTickets: response})
                this.setState({data: data})
            })
            stompClient.send('/app/jira', {}, JSON.stringify({'docId': this.props.documentId}));
        })
    }
    updateTickets(){
        this.setState({dataTickets: {}})
        this.webSocket();
    }
    changeInput(event) {
        this.state.data[event.target.id] = event.target.value
    }
    changeContract(event){
        var data = this.state.data
        data[event.target.id] = event.target.value
        if (event.target.value == "Custom"){
            data["contractedCi"] = "Unlimited"
            data["contractedDev"] = "Unlimited"
            data["contractedQa"] = "Unlimited"
            data["contractedTotalUsers"] = "Unlimited"
            data["contractedVm"] = "Unlimited"
        }else{
            data["contractedCi"] = data.pricePlans[event.target.value].maxCi
            data["contractedDev"] = data.pricePlans[event.target.value].maxDev
            data["contractedQa"] = data.pricePlans[event.target.value].maxQa
            data["contractedTotalUsers"] = data.pricePlans[event.target.value].maxTotalUsers
            data["contractedVm"] = data.pricePlans[event.target.value].maxVM
        }
        this.setState({data: data})
    }
    updateDocument(){
        let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/main-info/'+this.props.documentId
            const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
            fetch(URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AuthStr
                },
                redirect: 'follow',
                body: JSON.stringify(this.state.data)
            }).then(response => {
                return response.json()
            }).then(json => {
                this.modalText = "Successfully updated";
                this.openModal();
                this.setState({data:json})
            })
    }
    render(){
        function parseDate(str, format, locale) {
            const parsed = dateFnsParse(str, format, { locale });
            if (DateUtils.isDate(parsed)) {
                return parsed;
            }
            return undefined;
        }
        function formatDate(date, format, locale) {
            return dateFnsFormat(date, format, { locale });
        }
        return(
            <div className="row">
                <div className="col-md-4" key={Object.values(this.state.data)}>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th colSpan={3}>Main Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="columnMainHeader">Customer name <b className="mandaroryIcon">*</b></td>
                                <td colSpan={2}><input className="form-control" type="text" defaultValue={this.state.data.customerName} readOnly/></td>
                            </tr>
                            <tr>
                                <td className="columnMainHeader">Project name</td>
                                <td colSpan={2}><input className="form-control" type="text" defaultValue={this.state.data.projectName} readOnly/></td>
                            </tr>
                            <tr>
                                <td className="columnMainHeader">Currect Contract Plan</td>
                                <td colSpan={2}>
                                    <select value={this.state.data.contractName || ""} className="form-control" id="contractName" onChange={this.changeContract}>
                                        {Object.keys(this.state.data.pricePlans)
                                        .map(key =>
                                            <option value={key} key={key}>{key}</option>
                                        )}
                                        <option value="Custom" key="Custom">Custom</option>
                                        <option value="" disabled></option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td className="columnMainHeader"></td>
                                <td><small>Projected</small></td>
                                <td><small>Contract Limit</small></td>
                            </tr>
                            <tr>
                                <td className="columnMainHeader">CI Stream</td>
                                <td><input className="form-control" type="text" defaultValue={this.state.data.projectedCI} id="projectedCI" onChange={this.changeInput}/></td>
                                <td>
                                    {this.state.data.contractName == "Custom" ?
                                        <input className="form-control" type="text" defaultValue={this.state.data.contractedCi} id="contractedCi" onChange={this.changeInput}/>
                                        :
                                        <input className="form-control" type="text" defaultValue={this.state.data.contractedCi} readOnly/>
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td className="columnMainHeader">VMs</td>
                                <td><input className="form-control" type="text" defaultValue={this.state.data.projectedVM} id="projectedVM" onChange={this.changeInput}/></td>
                                <td>
                                    {this.state.data.contractName == "Custom" ?
                                        <input className="form-control" type="text" defaultValue={this.state.data.contractedVm} id="contractedVM" onChange={this.changeInput}/>
                                        :
                                        <input className="form-control" type="text" defaultValue={this.state.data.contractedVm} readOnly/>
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td className="columnMainHeader">Total Users</td>
                                <td><input className="form-control" type="text" defaultValue={this.state.data.projectedTotalUsers} id="projectedTotalUsers" onChange={this.changeInput}/></td>
                                <td>
                                    {this.state.data.contractName == "Custom" ?
                                        <input className="form-control" type="text" defaultValue={this.state.data.contractedTotalUsers} id="contractedTotalUsers" onChange={this.changeInput}/>
                                        :
                                        <input className="form-control" type="text" defaultValue={this.state.data.contractedTotalUsers} readOnly/>
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td className="columnMainHeader">Developers</td>
                                <td><input className="form-control" type="text" defaultValue={this.state.data.projectedDev} id="projectedDev" onChange={this.changeInput}/></td>
                                <td>
                                    {this.state.data.contractName == "Custom" ?
                                        <input className="form-control" type="text" defaultValue={this.state.data.contractedDev} id="contractedDev" onChange={this.changeInput}/>
                                        :
                                        <input className="form-control" type="text" defaultValue={this.state.data.contractedDev} readOnly/>
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td className="columnMainHeader">QAs</td>
                                <td><input className="form-control" type="text" defaultValue={this.state.data.projectedQA} id="projectedQA" onChange={this.changeInput}/></td>
                                <td>
                                    {this.state.data.contractName == "Custom" ?
                                        <input className="form-control" type="text" defaultValue={this.state.data.contractedQa} id="contractedQa" onChange={this.changeInput}/>
                                        :
                                        <input className="form-control" type="text" defaultValue={this.state.data.contractedQa} readOnly/>
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td className="columnMainHeader">Contract start date</td>
                                <td colSpan={2}>
                                    <DayPickerInput
                                        dayPickerProps={{
                                            fixedWeeks : true
                                        }}
                                        formatDate={formatDate}
                                        format={'MM/dd/yyyy'}
                                        onDayChange={day => this.changeInput({target:{id:"contractStartDatePDT", "value": formatDate(day, 'MM/dd/yyyy')}})}
                                        parseDate={parseDate}
                                        value={this.state.data.contractStartDatePDT || ""}
                                        placeholder={`MM/DD/YYYY`}
                                        inputProps={{
                                            readOnly: true,
                                            className: 'form-control',
                                            type: 'text'
                                        }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="columnMainHeader">Projected Work Streams</td>
                                <td colSpan={2}><input className="form-control" type="text" defaultValue={this.state.data.projectedWorkStreams} id="projectedWorkStreams" onChange={this.changeInput}/></td>
                            </tr>
                            <tr>
                                <td className="columnMainHeader">Projected Workstations</td>
                                <td colSpan={2}><input className="form-control" type="text" defaultValue={this.state.data.projectedWorkstations} id="projectedWorkstations" onChange={this.changeInput}/></td>
                            </tr>
                            <tr>
                                <td className="columnMainHeader">Number of automated test cases</td>
                                <td colSpan={2}><input className="form-control" type="text" defaultValue={this.state.data.amountTests} id="amountTests" onChange={this.changeInput}/></td>
                            </tr>
                            <tr>
                                <td className="columnMainHeader">Technical Lead (JIRA login)</td>
                                <td colSpan={2}><input className="form-control" type="text" defaultValue={this.state.data.techLead} placeholder="JIRA login" id="techLead" onChange={this.changeInput}/></td>
                            </tr>
                            <tr>
                                <td className="columnMainHeader">Project Manager (JIRA login)</td>
                                <td colSpan={2}><input className="form-control" type="text" defaultValue={this.state.data.projectManager} placeholder="JIRA login" id="projectmanager" onChange={this.changeInput}/></td>
                            </tr>
                            <tr>
                                <td className="columnMainHeader">Delivery Manager (JIRA login)</td>
                                <td colSpan={2}><input className="form-control" type="text" defaultValue={this.state.data.deliveryManager} placeholder="JIRA login" id="deliveryManager" onChange={this.changeInput}/></td>
                            </tr>
                        </tbody>
                    </table>
                    <a className="btn btn-primary pull-right" onClick={this.updateDocument}>Update Document</a>
                </div>
                <div className="col-md-4">
                    <table className="table table-striped" id="projectStatisticsTable">
                        <thead>
                            <tr><th colSpan={4}>Project Statistics</th></tr>
                            <tr>
                                <th></th>
                                <th className="onMiddleCell">Projected</th>
                                <th className="onMiddleCell">Provisioned</th>
                                <th className="onMiddleCell">Contract limit</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Number of Work Streams</td>
                                <td className="onMiddleCell">{this.state.data.projectedWorkStreams}</td>
                                <td className="onMiddleCell">{this.state.data.amountWorkStreams}</td>
                                <th></th>
                            </tr>
                            <tr>
                                <td>Number of CI Streams</td>
                                <td className="onMiddleCell">{this.state.data.projectedCI}</td>
                                <td className="onMiddleCell">{this.state.data.amountCIStreams}</td>
                                <th className="onMiddleCell">{this.state.data.contractedCi}</th>
                            </tr>
                            <tr>
                                <td>Total VMs</td>
                                <td className="onMiddleCell">{this.state.data.projectedVM}</td>
                                <td className="onMiddleCell">{this.state.data.amountHosts}</td>
                                <th className="onMiddleCell">{this.state.data.contractedVm}</th>
                            </tr>
                            <tr>
                                <td>Total Users</td>
                                <td className="onMiddleCell">{this.state.data.projectedTotalUsers}</td>
                                <td className="onMiddleCell">{this.state.data.amountAllMembers}</td>
                                <th className="onMiddleCell">{this.state.data.contractedTotalUsers}</th>
                            </tr>
                            <tr>
                                <td>Developers</td>
                                <td className="onMiddleCell">{this.state.data.projectedDev}</td>
                                <td className="onMiddleCell">{this.state.data.amountDev}</td>
                                <th className="onMiddleCell">{this.state.data.contractedDev}</th>
                            </tr>
                            <tr>
                                <td>QAs</td>
                                <td className="onMiddleCell">{this.state.data.projectedQA}</td>
                                <td className="onMiddleCell">{this.state.data.amountQA}</td>
                                <th className="onMiddleCell">{this.state.data.contractedQa}</th>
                            </tr>
                            <tr>
                                <td>User locations</td>
                                <td></td>
                                <td className="onMiddleCell">{this.state.data.amountLocations}</td>
                                <th></th>
                            </tr>
                            <tr>
                                <td>Workstations</td>
                                <td className="onMiddleCell">{this.state.data.projectedWorkstations}</td>
                                <td className="onMiddleCell">{this.state.data.workstations}</td>
                                <th></th>
                            </tr>
                        </tbody>
                    </table>
                    <hr />
                    <div className="row">
                        <div className="col-md-10">
                            <div className="row">
                                <div className="col-md-5">
                                    <b>JIRA  Tickets Status</b>
                                </div>
                                <div className="col-md-7">
                                    <h6><FontAwesomeIcon icon="info-circle"/> JIRA statuses syncs each 15 minutes</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <a className="btn btn-default" onClick={this.updateTickets}><FontAwesomeIcon icon="sync-alt"/></a>
                        </div>
                    </div>
                    <table className="table table-striped" style={{display: "inline-table", width: "100%"}}>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Ticket Number</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Master</td>
                                <td><a target="_black" href={"https://jira-stg.eisgroup.com/browse/"+this.state.data.jiraTicket}>{this.state.data.jiraTicket}</a></td>
                                <td>
                                    {this.state.data.jiraTicketStatus}
                                    {Object.keys(this.state.dataTickets).length == 0?
                                    <img src={"./loading.gif"} id="loadingTickets" />
                                    :
                                    null}
                                </td>
                            </tr>
                            <tr>
                                <td>Hosts</td>
                                <td><a target="_black" href={"https://jira-stg.eisgroup.com/browse/"+this.state.data.jiraHostTicket}>{this.state.data.jiraHostTicket}</a></td>
                                <td>
                                    {this.state.data.jiraHostTicketStatus}
                                    {Object.keys(this.state.dataTickets).length == 0?
                                    <img src={"./loading.gif"} id="loadingTickets" />
                                    :
                                    null}
                                </td>
                            </tr>
                            <tr>
                                <td>Users</td>
                                <td><a target="_black" href={"https://jira-stg.eisgroup.com/browse/"+this.state.data.jiraUserTicket}>{this.state.data.jiraUserTicket}</a></td>
                                <td>
                                    {this.state.data.jiraUserTicketStatus}
                                    {Object.keys(this.state.dataTickets).length == 0?
                                    <img src={"./loading.gif"} id="loadingTickets" />
                                    :
                                    null}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="col-md-4">
                    <div className="row">
                        <div className="col-md-10">
                            <div className="row">
                                <div className="col-md-5">
                                    <b>JIRA  Tickets Status</b>
                                </div>
                                <div className="col-md-7">
                                    <h6><FontAwesomeIcon icon="info-circle"/> JIRA statuses syncs each 15 minutes</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <a className="btn btn-default" onClick={this.updateTickets}><FontAwesomeIcon icon="sync-alt"/></a>
                        </div>
                    </div>
                    <table className="table table-striped" style={{display: "inline-table", width: "100%"}}>
                        <thead>
                            <tr>
                                <th>Key</th>
                                <th>Summary</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.documentTickets
                                .map(key =>
                                    <tr key={key}>
                                        <td><a target="_black" href={"https://jira-stg.eisgroup.com/browse/"+key.key}>{key.key}</a></td>
                                        <td>{key.summary}</td>
                                        <td>
                                            {key.status}
                                            {Object.keys(this.state.dataTickets).length == 0?
                                            <img src={"./loading.gif"} id="loadingTickets" />
                                            :
                                            null}
                                        </td>
                                    </tr>
                            )}
                        </tbody>
                    </table>
                    <hr/>
                    <div className="row">
                        <div className="col-md-10">
                            <div className="row">
                                <div className="col-md-5">
                                    <b>JIRA  Tickets Status</b>
                                </div>
                                <div className="col-md-7">
                                    <h6><FontAwesomeIcon icon="info-circle"/> JIRA statuses syncs each 15 minutes</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <a className="btn btn-default" onClick={this.updateTickets}><FontAwesomeIcon icon="sync-alt"/></a>
                        </div>
                    </div>
                    <table className="table table-striped" style={{display: "inline-table", width: "100%"}}>
                        <thead>
                            <tr>
                                <th>Key</th>
                                <th>Summary</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.tickets
                                .map(key =>
                                    <tr key={this.state.data.tickets.indexOf(key)+key}>
                                        <td><a target="_black" href={"https://jira-stg.eisgroup.com/browse/"+key.key}>{key.key}</a></td>
                                        <td>{key.summary}</td>
                                        <td>
                                            {key.status}
                                            {Object.keys(this.state.dataTickets).length == 0?
                                            <img src={"./loading.gif"} id="loadingTickets" />
                                            :
                                            null}
                                        </td>
                                    </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Modal
                        isOpen={this.state.modalIsOpen}
                        onRequestClose={this.closeModal}
                        ariaHideApp={false}
                        className="modal-dialog modal-md fadeInDown fadeModal"
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title" id="message">Document was successfully updated</h4>
                            </div>
                            <div className="modal-footer">
                                <a className="btn btn-default" onClick={this.closeModal} >Ok</a>
                            </div>
                        </div>
                    </Modal>
            </div>
        )
    }
}
export default MainInfo
