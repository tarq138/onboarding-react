import React, { Component } from 'react';
import UpdatePrefix from './updatePrefix';
import AddWorkstations from './addWorkstations';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus, faMinus} from "@fortawesome/free-solid-svg-icons";
library.add(faPlus, faMinus);
import Modal from 'react-modal';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { DateUtils } from 'react-day-picker';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';

class Workstations extends Component{
    constructor(props){
        super(props);
        this.state = {modalIsOpen: false, modalDeleteIsOpen: false, modalDisableOpen: false};
        this.modalText = "";
        this.namesList = [];
        this.idsList = [];
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.addWorkstations = this.addWorkstations.bind(this);
        this.changeInput = this.changeInput.bind(this);
        this.updateData = this.updateData.bind(this);
        this.delete = this.delete.bind(this);
        this.massDelete = this.massDelete.bind(this);
        this.massCheck = this.massCheck.bind(this);
        this.modifyList = this.modifyList.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.updatePreffix = this.updatePreffix.bind(this);
        this.showDisableForm = this.showDisableForm.bind(this);
        this.deleteId = null;
    }
    changeInput(event) {
        const index = event.target.id.split("_")[0];
        const param = event.target.id.split("_")[2];
        this.state.data[index][param] = event.target.value;
    }
    updateData(){
        var flagError = false;
        document.getElementById("errorMessage").innerHTML = "";
        for (var data in this.state.data){
            document.getElementById(data+"_wsworkstationsconfig_startDate").classList.remove("input-error");
            document.getElementById(data+"_wsworkstationsconfig_endDate").classList.remove("input-error");
            if ((this.state.data[data].startDate) && (this.state.data[data].endDate) && ((new Date(this.state.data[data].endDate)).getTime() < (new Date(this.state.data[data].startDate)).getTime())){
                flagError = true;
                document.getElementById(data+"_wsworkstationsconfig_startDate").classList.add("input-error");
                document.getElementById(data+"_wsworkstationsconfig_endDate").classList.add("input-error");
            }
        }
        if(!flagError){
            let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/workstations/'+this.props.documentId;
            const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
            fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AuthStr
                },
                body: JSON.stringify(this.state.data)
            }).then(response => {
                return response.json()
            }).then(json => {
                this.modalText = "Successfully updated";
                this.setState({data:json});
                this.openModal();
            })
        }else{
            document.getElementById("errorMessage").innerHTML = "Please check the dates (the start date should occur on or before the end date).";
        }
    }
    componentDidMount(){ 
        let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/users/locations/'+this.props.documentId;
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
            this.setState({locations:json})
        }).catch(error =>
            console.error(error)
        );
        URL = localStorage.getItem('urlPrefix') + '/api/onboarding/workstations/'+this.props.documentId;
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
    massCheck(event){
        this.idsList = [];
        this.namesList = [];
        var elems = document.querySelectorAll("tbody .columnCheckbox input");
        for(var el of elems){
            el.checked = event.target.checked;
            if(event.target.checked){
                this.idsList.push(el.getAttribute("id").split("_")[0])
                this.namesList.push(this.state.data[el.getAttribute("id").split("_")[2]].displayName)
            }
        }
    }
    modifyList(event){
        var elems = document.querySelectorAll("thead .columnCheckbox input");
        elems[0].checked = false;
        const id = event.target.getAttribute("id").split("_")[0];
        const name = this.state.data[event.target.getAttribute("id").split("_")[2]].displayName;
        if(event.target.checked){
            this.idsList.push(id)
            this.namesList.push(name)
        }else{
            this.idsList.splice(this.idsList.indexOf(id), 1)
            this.namesList.splice(this.namesList.indexOf(name), 1)
        }
    }
    addWorkstations(quantity, role){
        let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/workstations/add/'+this.props.documentId+"/"+quantity+"/"+role;
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
    delete(event){
        this.namesList = [];
        this.modalText = "Delete all entry for " + this.state.data[event.currentTarget.id.split("_")[2]].displayName + " ?"
        this.deleteId = event.currentTarget.id.split("_")[0]
        this.setState({modalDeleteIsOpen: true});
    }
    massDelete(){
        if (this.namesList.length != 0){
            this.modalText = "Delete all entry for " + this.namesList.join(", ") +" ?";
            this.setState({modalDeleteIsOpen: true});
        }else{
            this.modalText = "There is no chosen workstations for delete";
            this.setState({modalIsOpen: true});
        }
    }
    confirmDelete(){
        if (this.namesList.length == 0){
            const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
            let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/workstation/'+this.deleteId
            fetch(URL, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AuthStr
                }
            }).then(response => {
                return response.json()
            }).then(json => {
                this.setState({data:json})
                this.closeModal();
            })
        }else{
            var data = {
                ids: this.idsList,
                docId: this.props.documentId
            }
            const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
            let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/workstations'
            fetch(URL, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AuthStr
                },
                body: JSON.stringify(data)
            }).then(response => {
                return response.json()
            }).then(json => {
                this.closeModal();
                this.setState({data:json})
            })
        }
        this.namesList = [];
        this.idsList = [];
    }
    updatePreffix(workstation_preffix){
        if (this.namesList.length != 0){
            const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
            let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/workstations/update-prefix-ws-id/'+workstation_preffix
            fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AuthStr
                },
                body: JSON.stringify(this.idsList)
            }).then(response => {
                return response.json()
            }).then(json => {
                this.componentDidMount()
            })
        }else{
            this.modalText = "There is no chosen workstations for delete";
            this.setState({modalIsOpen: true});
        }
    }
    openModal() {
        this.setState({modalIsOpen: true});
    }
    closeModal() {
        this.setState({modalIsOpen: false});
        this.setState({modalDeleteIsOpen: false});
        this.setState({modalDisableOpen: false});
    }
    showDisableForm(){
        document.getElementById("errorMessage").innerHTML = "";
        if (this.namesList.length != 0){
            this.setState({modalDisableOpen: true})
        }else{
            document.getElementById("errorMessage").innerHTML = "Please check the dates (the start date should occur on or before the end date).";
        }
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
        if ((Object.keys(this.state).indexOf('data') != -1) && (Object.keys(this.state).indexOf('locations') != -1)){
            return(
                <div className="row">
                    <h5>Workstations</h5>
                    <div className="col-md-4">
                        <UpdatePrefix updatePreffix={this.updatePreffix}/>
                    </div>
                    <div className="col-md-6">
                        <AddWorkstations addWorkstations={this.addWorkstations} data={this.state.data}/>
                    </div>
                    <div className="col-md-2"></div>
                    <hr />
                    <div className="col-md-3">
                        <a className="btn btn-primary" onClick={this.updateData}>Update Workstations</a>
                    </div>
                    <div className="col-md-6">
                        <div className="btn-group" role="group">
                            <button className="btn btn-default" onClick={this.showDisableForm}>
                                <text><b>Disable</b> chosen workstations</text>
                            </button>
                            <button className="btn btn-default" onClick={this.massDelete}>
                                <text><b>Delete</b> chosen workstations</text>
                            </button>
                        </div>
                    </div>
                    <div className="col-md-3"></div>
                    <div className="col-md-12">
                        <h6 id="errorMessage"></h6>
                        <table className="table table-striped" id="workstationsTable">
                            <thead>
                                <tr>
                                    <th className="columnModify"></th>
                                    <th className="columnCheckbox">
                                        <label className="checkbox">
                                            <input type="checkbox" defaultChecked={false} onClick={this.massCheck}/>
                                            <span className="checkmark"></span>
                                        </label>
                                    </th>
                                    <th className="columnModify">#</th>
                                    <th className="columnHostname">Hostname</th>
                                    <th className="columnIPAddress">IP Address</th>
                                    <th className="columnUsersFullName">User's Full Name</th>
                                    <th className="columnUsersRole">User's Role</th>
                                    <th className="columnRepository">Repository</th>
                                    <th className="columnStartDateWorkstations">Start Date</th>
                                    <th className="columnEndDateWorkstations">End Date</th>
                                    <th className="columnJiraTicketStartWorkstations">JIRA Ticket Start</th>
                                    <th className="columnJiraTicketEndWorkstations">JIRA Ticket End</th>
                                    <th className="columnLocation">Location</th>
                                    <th className="columnEmail">Email</th>
                                    <th className="columnLogin">Login</th>
                                    <th className="columnPassword">Password</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.data.map(key =>
                                    <tr key={Object.values(key)+this.state.data.indexOf(key)+"_"+this.state.data.length}>
                                        <td className="columnModify"><button className="btn btn-default" id={key.id+"_workstationsconfigdelete_"+this.state.data.indexOf(key)} onClick={this.delete}><FontAwesomeIcon icon="minus" /></button></td>
                                        <td className="columnCheckbox">
                                            <label className="checkbox">
                                                <input type="checkbox" defaultChecked={false} id={key.id+"_workstationsconfig_"+this.state.data.indexOf(key)} onClick={this.modifyList}/>
                                                <span className="checkmark"></span>
                                            </label>
                                        </td>
                                        <td className="columnModify">{this.state.data.indexOf(key)+1}</td>
                                        <td className="columnHostname"><input className="form-control" type="text" defaultValue={key.displayName} readOnly/></td>
                                        <td className="columnIPAddress"><input className="form-control" type="text" defaultValue={key.ipAddress} id={this.state.data.indexOf(key)+"_wsworkstationsconfig_"}  onChange={this.changeInput}/></td>
                                        <td className="columnUsersFullName"><input className="form-control" type="text" defaultValue={key.fullName} id={this.state.data.indexOf(key)+"_wsworkstationsconfig_fullName"}  onChange={this.changeInput}/></td>
                                        <td className="columnUsersRole">
                                            <select defaultValue={key.role || ''} className="form-control" id={this.state.data.indexOf(key)+"_wsworkstationsconfig_role"} onChange={this.changeInput}>
                                                <option value='' disabled></option>
                                                <option value='Developer'>Developer</option>
                                                <option value='QA'>QA</option>
                                            </select>
                                        </td>
                                        <td className="columnRepository"><input className="form-control" type="text" defaultValue={key.repository} id={this.state.data.indexOf(key)+"_wsworkstationsconfig_repository"}  onChange={this.changeInput}/></td>
                                        <td className="columnStartDateWorkstations">
                                            <DayPickerInput
                                                dayPickerProps={{
                                                    fixedWeeks : true
                                                }}
                                                formatDate={formatDate}
                                                format={'MM/dd/yyyy'}
                                                onDayChange={day => this.changeInput({target:{id:this.state.data.indexOf(key)+"_wsworkstationsconfig_startDate", "value": formatDate(day, 'MM/dd/yyyy')}})}
                                                parseDate={parseDate}
                                                value={key.startDate}
                                                placeholder={`MM/DD/YYYY`}
                                                inputProps={{
                                                    readOnly: true,
                                                    className: 'form-control',
                                                    type: 'text',
                                                    id: this.state.data.indexOf(key)+"_wsworkstationsconfig_startDate"
                                                }}
                                            />
                                        </td>
                                        <td className="columnEndDateWorkstations">
                                            <DayPickerInput
                                                dayPickerProps={{
                                                    fixedWeeks : true
                                                }}
                                                formatDate={formatDate}
                                                format={'MM/dd/yyyy'}
                                                onDayChange={day => this.changeInput({target:{id:this.state.data.indexOf(key)+"_wsworkstationsconfig_endDate", "value": formatDate(day, 'MM/dd/yyyy')}})}
                                                parseDate={parseDate}
                                                value={key.endDate}
                                                placeholder={`MM/DD/YYYY`}
                                                inputProps={{
                                                    readOnly: true,
                                                    className: 'form-control',
                                                    type: 'text',
                                                    id: this.state.data.indexOf(key)+"_wsworkstationsconfig_endDate"
                                                }}
                                            />
                                        </td>
                                        <td className="columnJiraTicketStartWorkstations"><input className="form-control" type="text" defaultValue={key.startTicket} id={this.state.data.indexOf(key)+"_wsworkstationsconfig_startTicket"}  onChange={this.changeInput}/></td>
                                        <td className="columnJiraTicketEndWorkstations"><input className="form-control" type="text" defaultValue={key.endTicket} id={this.state.data.indexOf(key)+"_wsworkstationsconfig_endTicket"}  onChange={this.changeInput}/></td>
                                        <td className="columnLocation">
                                            <select defaultValue={key.location} className="form-control" id={this.state.data.indexOf(key)+"_wsworkstationsconfig_location"} onChange={this.changeInput}>
                                            {this.state.locations
                                                .map(key => <option value={key} key={key}>{key}</option>
                                                )}
                                            </select>
                                        </td>
                                        <td className="columnEmail"><input className="form-control" type="text" defaultValue={key.email} id={this.state.data.indexOf(key)+"_wsworkstationsconfig_email"} onChange={this.changeInput}/></td>
                                        <td className="columnLogin"><input className="form-control" type="text" defaultValue={key.login} id={this.state.data.indexOf(key)+"_wsworkstationsconfig_login"} onChange={this.changeInput}/></td>
                                        <td className="columnPassword"><input className="form-control" type="text" defaultValue={key.pw} id={this.state.data.indexOf(key)+"_wsworkstationsconfig_pw"} onChange={this.changeInput}/></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Modal
                        isOpen={this.state.modalIsOpen}
                        onRequestClose={this.closeModal}
                        ariaHideApp={false}
                        id="modalWindow"
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
                        isOpen={this.state.modalDeleteIsOpen}
                        onRequestClose={this.closeModal}
                        ariaHideApp={false}
                        id="modalWindow"
                        className="modal-dialog modal-md fadeInDown fadeModal"
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">{this.modalText}</h4>
                            </div>
                            <div className="modal-footer">
                                <a className="btn btn-default" onClick={this.closeModal} >No</a>
                                <a className="btn btn-default confirm-delete" onClick={this.confirmDelete} >Yes</a>
                            </div>
                        </div>
                    </Modal>
                    <Modal
                        isOpen={this.state.modalDisableOpen}
                        onRequestClose={this.closeModal}
                        ariaHideApp={false}
                        id="modalWindow"
                        className="modal-dialog modal-md fadeInDown fadeModal"
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Set Start Date or End Date for chosen Workstations</h4>
                                <h5 className="modal-title">{this.modalText}</h5>
                                <h6 className="modal-title">{this.modalText}</h6>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6>Srart Date</h6>
                                        <DayPickerInput
                                            dayPickerProps={{
                                                fixedWeeks : true
                                            }}
                                            formatDate={formatDate}
                                            format={'MM/dd/yyyy'}
                                            parseDate={parseDate}
                                            value=""
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
                                            parseDate={parseDate}
                                            value=""
                                            placeholder={`MM/DD/YYYY`}
                                            inputProps={{
                                                readOnly: true,
                                                className: 'form-control',
                                                type: 'text'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <a className="btn btn-default" onClick={this.closeModal} >Cancel</a>
                                <a className="btn btn-primary" onClick={this.setDisableDates} >Apply</a>
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
export default Workstations
