import React, { Component } from 'react';
import UpdatePrefix from './updatePrefix';
import AddHosts from './addHosts';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus, faMinus} from "@fortawesome/free-solid-svg-icons";
library.add(faPlus, faMinus);
import Modal from 'react-modal';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { DateUtils } from 'react-day-picker';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';

class MainInfo extends Component{
    constructor(props){
        super(props);
        this.state = {modalHostIsOpen: false, dataWindow: {}, createNew: false };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.closeHostModal = this.closeHostModal.bind(this);
        this.closeDeleteModal = this.closeDeleteModal.bind(this);
        this.getData = this.getData.bind(this);
        this.addHosts = this.addHosts.bind(this);
        this.openWindow = this.openWindow.bind(this);
        this.changeInput = this.changeInput.bind(this);
        this.saveForm = this.saveForm.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
    }
    componentDidMount(){
        let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/hardware-templates/all/'+this.props.documentId;
        const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
        fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AuthStr
            }
        }).then(response => {
            return response.json()
        }).then(json => {
            this.setState({templates:json})
            this.getData()
        }).catch(error =>
            console.error(error)
        );
    }
    getData(){
        let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/hosts/'+this.props.ciStream.split("_")[0];
        const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
        fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AuthStr
            }
        }).then(response => {
            return response.json()
        }).then(json => {
            this.setState({data:json})
        }).catch(error =>
            console.error(error)
        );
    }
    addHosts(quantity, type){
        let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/hosts/add/'+this.props.ciStream.split("_")[0]+'/'+quantity+'/'+type;
        const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
        fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AuthStr
            }
        }).then(response => {
            return response.json()
        }).then(json => {
            this.getData()
        }).catch(error =>
            console.error(error)
        );
    }
    openModal() {
        this.setState({modalIsOpen: true});
    }
    closeModal() {
        this.setState({modalIsOpen: false});
    }
    closeHostModal() {
        this.setState({modalHostIsOpen: false});
    }
    closeDeleteModal() {
        this.setState({modalDeleteIsOpen: false});
    }
    handleCreate(){
        this.setState({dataWindow: {}});
        this.setState({createNew: true})
        this.setState({modalHostIsOpen: true})
    }
    openWindow(event){
        const index = event.currentTarget.id.split("_")[0];
        let dataWindow = JSON.parse(JSON.stringify(this.state.data)); // MAAAAGIC!!!!!
        this.setState({createNew: false})
        this.setState({dataWindow: dataWindow[index]});
        this.setState({modalHostIsOpen: true})
    }
    changeInput(event){
        if (event.target.id.indexOf('skip') != -1){
            this.state.dataWindow[event.target.id] = event.target.checked
        }else{ 
            this.state.dataWindow[event.target.id] = event.target.value
        }
        if (event.target.id == 'serverType'){
            for(var i in this.state.templates){
                if (this.state.templates[i].serverType == event.target.value){
                    break;
                }
            }
            var data = this.state.dataWindow
            data.projectedCore = this.state.templates[i].defaultCore
            data.projectedDisk = this.state.templates[i].defaultDisk
            data.projectedRAM = this.state.templates[i].defaultMemory
            data.description = this.state.templates[i].description
            data.osType = this.state.templates[i].osType
            data.serverType = this.state.templates[i].serverType
            data.vmTemplate = this.state.templates[i].vmTemplate
            this.setState({dataWindow: data})
        }
    }
    saveForm(){
        let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/hosts/'+this.props.ciStream.split("_")[0]
        const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
        fetch(URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AuthStr
            },
            body: JSON.stringify([this.state.dataWindow])
        }).then(response => {
            return response.json()
        }).then(json => {
            this.modalText = "Successfully updated";
            let checked = false
            if(this.state.createNew){
                checked = document.getElementById('host_another').checked
            }
            this.setState({modalHostIsOpen: false});
            this.getData();
            if(this.state.createNew && checked){
                this.setState({dataWindow: {}});
                this.setState({modalHostIsOpen: true});
                document.getElementById('host_another').checked = true;
            }else{
                this.openModal();
            }
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
        if (Object.keys(this.state).indexOf('data') != -1){
            return(
                <div className="row">
                    <div className="col-md-2"><h5>{this.props.ciStream.split("_")[1]}</h5></div>
                    <div className="col-md-4"><UpdatePrefix /></div>
                    <div className="col-md-6"><AddHosts templates={this.state.templates} addHosts={this.addHosts}/></div>
                    <hr />
                    <div className="col-md-2"><a className="btn btn-primary" onClick={this.updateHosts}>Update Hosts</a></div>
                    <div className="col-md-2"><a className="btn btn-primary" onClick={this.updateAttributes}>Update Attributes</a></div>
                    <div className="col-md-8">
                        <div className="btn-group" role="group">
                            <button className="btn btn-default">
                                <text><b>Disable</b> chosen hosts</text>
                            </button>
                            <button className="btn btn-default" onClick={this.massDelete}>
                                <text><b>Delete</b> chosen hosts</text>
                            </button>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <table className="table table-striped" id="ciStreamTable">
                            <thead>
                                <tr>
                                    <th className="columnModify"><button className="btn btn-default" onClick={this.handleCreate}><FontAwesomeIcon icon="plus" /></button></th>
                                    <th className="columnCheckbox">
                                        <label className="checkbox">
                                            <input type="checkbox" defaultChecked={false} onClick={this.massCheck}/>
                                            <span className="checkmark"></span>
                                        </label>
                                    </th>
                                    <th className="columnModify">#</th>
                                    <th className="columnServerTypeCi"><b className="mandaroryIcon">*</b>Server Type</th>
                                    <th className="columnHostnameCi">Hostname</th>
                                    <th className="columnHostnameAlies">Hostname alias</th>
                                    <th className="columnCPU">CPU</th>
                                    <th className="columnRAM">RAM</th>
                                    <th className="columnDisk">Disk</th>
                                    <th className="columnOS">OS</th>
                                    <th className="columnVMTemplate">Vm Templates</th>
                                    <th className="columnHostDescription">Host Description</th>
                                    <th className="columnUsage">Usage</th>
                                    <th className="columnStartDateCi">Start Date</th>
                                    <th className="columnEndDateCi">End Date</th>
                                    <th className="columnsJiraTicketStartCi">JIRA Ticker Start</th>
                                    <th className="columnsJiraTicketEndCi">JIRA Ticker End</th>
                                    <th className="columnSkipZabbix">Skip Zabbix</th>
                                    <th className="columnSkipConsul">Skip Consul</th>
                                    <th className="columnSkipWazuh">Skip Wazuh</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.data.map(key =>
                                    <tr key={Object.values(key)+this.state.data.indexOf(key)+this.props.ciStream.split("_")[0]} className={((new Date(key.endDate)).getTime() < (new Date()).getTime()) ? "text-muted":""}>
                                        <td className="columnModify"><button className="btn btn-default" id={key.id+"_workstationsconfigdelete_"+this.state.data.indexOf(key)} onClick={this.delete}><FontAwesomeIcon icon="minus" /></button></td>
                                        <td className="columnCheckbox">
                                            <label className="checkbox">
                                                <input type="checkbox" defaultChecked={false} id={key.id+"_workstationsconfig_"+this.state.data.indexOf(key)} onClick={this.modifyList}/>
                                                <span className="checkmark"></span>
                                            </label>
                                        </td>
                                        <td className="columnModify">{this.state.data.indexOf(key)+1}</td>
                                        <td className="columnServerTypeCi openWindow" id={this.state.data.indexOf(key)+"_serverType"} onClick={this.openWindow}>{key.serverType}</td>
                                        <td className="columnHostnameCi openWindow" id={this.state.data.indexOf(key)+"_hostname"} onClick={this.openWindow}>{key.hostname}</td>
                                        <td className="columnHostnameAlies openWindow" id={this.state.data.indexOf(key)+"_customHostname"} onClick={this.openWindow}>{key.customHostname}</td>
                                        <td className="columnCPU openWindow" id={this.state.data.indexOf(key)+"_projectedCore"} onClick={this.openWindow}>{key.projectedCore}</td>
                                        <td className="columnRAM openWindow" id={this.state.data.indexOf(key)+"_projectedRAM"} onClick={this.openWindow}>{key.projectedRAM}</td>
                                        <td className="columnDisk openWindow" id={this.state.data.indexOf(key)+"_projectedDisk"} onClick={this.openWindow}>{key.projectedDisk}</td>
                                        <td className="columnOS openWindow" id={this.state.data.indexOf(key)+"_osType"} onClick={this.openWindow}>{key.osType}</td>
                                        <td className="columnVMTemplate openWindow" id={this.state.data.indexOf(key)+"_vmTemplate"} onClick={this.openWindow}>{key.vmTemplate}</td>
                                        <td className="columnHostDescription openWindow" id={this.state.data.indexOf(key)+"_description"} onClick={this.openWindow}>{key.description}</td>
                                        <td className="columnUsage openWindow" id={this.state.data.indexOf(key)+"_usedFor"} onClick={this.openWindow}>{key.usedFor}</td>
                                        <td className="columnStartDateCi openWindow" id={this.state.data.indexOf(key)+"_startDate"} onClick={this.openWindow}>{key.startDate}</td>
                                        <td className="columnEndDateCi openWindow" id={this.state.data.indexOf(key)+"_endDate"} onClick={this.openWindow}>{key.endDate}</td>
                                        <td className="columnsJiraTicketStartCi openWindow" id={this.state.data.indexOf(key)+"_startTicket"} onClick={this.openWindow}>{key.startTicket}</td>
                                        <td className="columnsJiraTicketEndCi openWindow" id={this.state.data.indexOf(key)+"_endTicket"} onClick={this.openWindow}>{key.endTicket}</td>
                                        <td className="columnSkipZabbix">
                                            <label className="checkbox">
                                                <input type="checkbox" defaultChecked={key.skipZabbix}/>
                                                <span className="checkmark"></span>
                                            </label>
                                        </td>
                                        <td className="columnSkipConsul">
                                            <label className="checkbox">
                                                <input type="checkbox" defaultChecked={key.skipConsul}/>
                                                <span className="checkmark"></span>
                                            </label>
                                        </td>
                                        <td className="columnSkipWazuh">
                                            <label className="checkbox">
                                                <input type="checkbox" defaultChecked={key.skipWazuh}/>
                                                <span className="checkmark"></span>
                                            </label>
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
                                <h4 className="modal-title" id="message">{this.modalText}</h4>
                            </div>
                            <div className="modal-footer">
                                <a className="btn btn-default" onClick={this.closeModal} >Ok</a>
                            </div>
                        </div>
                    </Modal>
                    <Modal
                        isOpen={this.state.modalHostIsOpen}
                        onRequestClose={this.closeHostModal}
                        ariaHideApp={false}
                        className="modal-dialog modal-md fadeInDown fadeModal"
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Host data</h4>
                            </div>
                            <div className="modal-body" key={Object.values(this.state.dataWindow)}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6><b className="mandaroryIcon">*</b> Server type</h6>
                                        <select defaultValue={this.state.dataWindow.serverType || ""} className="form-control" onChange={this.changeInput} id="serverType">
                                            <option value="" disabled></option>
                                            {this.state.templates
                                            .map(key => <option value={key.serverType} key={Object.values(key)}>{key.serverType}</option>
                                            )}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <h6>Hostname alias</h6>
                                        <input className="form-control" type="text" defaultValue={this.state.dataWindow.customHostname} onChange={this.changeInput} id="customHostname"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6>Hostname</h6>
                                        <input className="form-control" type="text" defaultValue={this.state.dataWindow.hostname} onChange={this.changeInput} id="hostname" readOnly/>
                                    </div>
                                    <div className="col-md-6">
                                        <h6>OS</h6>
                                        <input className="form-control" type="text" defaultValue={this.state.dataWindow.osType} onChange={this.changeInput} id="osType"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6>VM Template</h6>
                                        <input className="form-control" type="text" defaultValue={this.state.dataWindow.vmTemplate} onChange={this.changeInput} id="vmTemplate"/>
                                    </div>
                                    <div className="col-md-2">
                                        <h6>RAM</h6>
                                        <input className="form-control" type="text" defaultValue={this.state.dataWindow.projectedRAM} onChange={this.changeInput} id="projectedRAM"/>
                                    </div>
                                    <div className="col-md-2">
                                        <h6>Disk</h6>
                                        <input className="form-control" type="text" defaultValue={this.state.dataWindow.projectedDisk} onChange={this.changeInput} id="projectedDisk"/>
                                    </div>
                                    <div className="col-md-2">
                                        <h6>CPU</h6>
                                        <input className="form-control" type="text" defaultValue={this.state.dataWindow.projectedCore} onChange={this.changeInput} id="projectedCore"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6>Host Description</h6>
                                        <input className="form-control" type="text" defaultValue={this.state.dataWindow.description} onChange={this.changeInput} id="description"/>
                                    </div>
                                    <div className="col-md-6">
                                        <h6>Usage</h6>
                                        <input className="form-control" type="text" defaultValue={this.state.dataWindow.usedFor} onChange={this.changeInput} id="usedFor"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6>Srart Date</h6>
                                        <DayPickerInput
                                            dayPickerProps={{
                                                fixedWeeks : true
                                            }}
                                            formatDate={formatDate}
                                            format={'MM/dd/yyyy'}
                                            onDayChange={day => this.changeInput({target:{id:"startDate", "value": formatDate(day, 'MM/dd/yyyy')}})}
                                            parseDate={parseDate}
                                            value={this.state.dataWindow.startDate}
                                            placeholder={`MM/DD/YYYY`}
                                            inputProps={{
                                                readOnly: true,
                                                className: 'form-control',
                                                type: 'text'
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <h6>End Date</h6>
                                        <DayPickerInput
                                            dayPickerProps={{
                                                fixedWeeks : true
                                            }}
                                            formatDate={formatDate}
                                            format={'MM/dd/yyyy'}
                                            onDayChange={day => this.changeInput({target:{id:"endDate", "value": formatDate(day, 'MM/dd/yyyy')}})}
                                            parseDate={parseDate}
                                            value={this.state.dataWindow.endDate}
                                            placeholder={`MM/DD/YYYY`}
                                            inputProps={{
                                                readOnly: true,
                                                className: 'form-control',
                                                type: 'text'
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6>JIRA Start Ticket<br/><small>(Only project abbreviation with number)</small></h6>
                                        <input className="form-control" type="text" defaultValue={this.state.dataWindow.startTicket} placeholder="EXMPL-11111" onChange={this.changeInput} id="startTicket"/>
                                    </div>
                                    <div className="col-md-6">
                                        <h6>JIRA End Ticket<br/><small>(Only project abbreviation with number)</small></h6>
                                        <input className="form-control" type="text" defaultValue={this.state.dataWindow.endTicket} placeholder="EXMPL-11111" onChange={this.changeInput} id="endTicket"/>
                                    </div>
                                </div>
                                <div className="row skipZWC">
                                    <div className="col-md-4">
                                        <h6>Skip Zabbix</h6>
                                        <label className="checkbox">
                                            <input type="checkbox" defaultChecked={this.state.dataWindow.skipZabbix} onChange={this.changeInput} id="skipZabbix"/>
                                            <span className="checkmark"></span>
                                        </label>
                                    </div>
                                    <div className="col-md-4">
                                        <h6>Skip Consul</h6>
                                        <label className="checkbox">
                                            <input type="checkbox" defaultChecked={this.state.dataWindow.skipConsul} onChange={this.changeInput} id="skipConsul"/>
                                            <span className="checkmark"></span>
                                        </label>
                                    </div>
                                    <div className="col-md-4">
                                        <h6>Skip Wazuh</h6>
                                        <label className="checkbox">
                                            <input type="checkbox" defaultChecked={this.state.dataWindow.skipWazuh} onChange={this.changeInput} id="skipWazuh"/>
                                            <span className="checkmark"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer modify">
                                <div className="row">
                                    <div className="col-md-4">
                                        {this.state.createNew ?
                                            <div>
                                                <label className="checkbox">
                                                    <input id="host_another" className="form-control" name="AnotherHost" type="checkbox"/>
                                                    <span className="checkmark"></span>
                                                </label>
                                                <h6 id="createAnotherField">Create another host</h6>
                                            </div>
                                        :
                                            null
                                        }
                                    </div>
                                    <div className="col-md-4 buttons">
                                        <a className="btn btn-default" onClick={this.closeHostModal} >Close</a>
                                        <a className="btn btn-primary" onClick={this.saveForm}>Save</a>
                                    </div>
                                    <div className="col-md-4 mandatory">
                                        <h6><b className="mandaroryIcon">*</b> Mandatory fields</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                </div>
            )
        }else{
            return(
                <div>
                    <img src={"./loading.gif"} id="loadingImage" />
                </div>
            )
        }
    }
}
export default MainInfo