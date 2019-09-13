import React, { Component } from 'react';
import MultiSelect from './MultiSelect'
import Modal from 'react-modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faInfoCircle} from "@fortawesome/free-solid-svg-icons";
library.add(faInfoCircle);
import ReactTooltip from 'react-tooltip';

class UsersAccess extends Component{
    constructor(props){
        super(props);
        this.state = {modalIsOpen: false, displayList: [], };
        this.processedDisplay = this.processedDisplay.bind(this)
        this.changeAccess = this.changeAccess.bind(this)
        this.changeTeam = this.changeTeam.bind(this)
        this.changeRole = this.changeRole.bind(this)
        this.changeSelectedAccess = this.changeSelectedAccess.bind(this)
        this.changeSettings = this.changeSettings.bind(this)
        this.updateData = this.updateData.bind(this)
        this.openModal = this.openModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.changeList = this.changeList.bind(this)
        this.massCheck = this.massCheck.bind(this)
        this.setAccess = this.setAccess.bind(this)
        this.selectedIndexs = [];
        this.selectedAccessGroup = "All"
    }
    openModal() {
        this.setState({modalIsOpen: true});
    }
    closeModal() {
        this.setState({modalIsOpen: false});
    }
    componentDidMount(){
        const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
        var teams = [];
        let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/users/teams/'+this.props.documentId;
        fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AuthStr
            }
        }).then(response => {
            return response.json()
        }).then(json => {
            teams = json;
        }).catch(error =>
            console.error(error)
        );
        var roles = [];
        URL = localStorage.getItem('urlPrefix') + '/api/onboarding/users/roles/';
        fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AuthStr
            }
        }).then(response => {
            return response.json()
        }).then(json => {
            roles = json;
        }).catch(error =>
            console.error(error)
        );
        var access = [];
        URL = localStorage.getItem('urlPrefix') + '/api/onboarding/users/access/'+this.props.documentId;
        fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AuthStr
            }
        }).then(response => {
            return response.json()
        }).then(json => {
            access = json;
        }).catch(error =>
            console.error(error)
        );
        URL = localStorage.getItem('urlPrefix') + '/api/onboarding/users/'+this.props.documentId;
        fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AuthStr
            }
        }).then(response => {
            return response.json()
        }).then(json => {
            this.setState({teams: teams})
            this.setState({selectedTeams: ["All Teams"]})
            this.setState({access: access})
            this.setState({selectedAccess: ["All"]})
            this.setState({roles: roles})
            this.setState({selectedRoles: ["All Roles"]})
            this.setState({data: json})
            this.processedDisplay(["All"], ["All Teams"], ["All Roles"])
        }).catch(error =>
            console.error(error)
        );
    }
    changeAccess(listAccess){
        this.setState({selectedAccess: listAccess})
        this.processedDisplay(listAccess, this.state.selectedTeams, this.state.selectedRoles)
    }
    changeTeam(listTeams){
        this.setState({selectedTeams: listTeams})
        this.processedDisplay(this.state.selectedAccess, listTeams, this.state.selectedRoles)
    }
    changeRole(listRoles){
        this.setState({selectedRoles: listRoles})
        this.processedDisplay(this.state.selectedAccess, this.state.selectedTeams, listRoles)
    }
    changeSelectedAccess(value){
        this.selectedAccessGroup = value;
    }
    processedDisplay(selectedAccess, selectedTeams, selectedRoles){
        var access = [];
        for (var el in this.state.data){
            var teamFlag = true;
            if (selectedTeams.indexOf(this.state.data[el].userTeam) == -1){
                teamFlag = false;
            }
            if (selectedTeams.indexOf("All Teams") != -1){
                teamFlag = true;
            }
            var roleFlag = true;
            if (selectedRoles.indexOf(this.state.data[el].userRoleShort) == -1){
                roleFlag = false;
            }
            if (selectedRoles.indexOf("All Roles") != -1){
                roleFlag = true;
            }
            var accessFlag = selectedAccess.some(i => Object.keys(this.state.data[el].access).includes(i));
            if (selectedAccess.indexOf("All") != -1){
                accessFlag = true;
            }
            access.push(teamFlag && roleFlag && accessFlag)
        }
        this.setState({displayList: access})
    }
    changeSettings(event){
        var index = event.target.id.split("_")[0]
        var data = this.state.data
        if (event.target.checked){
            data[index].access[event.target.name] = event.target.checked
        }else{ 
            delete data[index].access[event.target.name]
        }
        this.setState({data: data})
    }
    updateData(){
        let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/user/access/'+this.props.documentId
        const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
        fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AuthStr
            },
            body: JSON.stringify(this.state.data)
        }).then(() => {
            this.componentDidMount();
            this.selectedIndexs = [];
            this.openModal();
        })
    }
    changeList(event){
        document.getElementById("massSelect").checked = false;
        var index = event.target.id.split("_")[0]
        if(event.target.checked){
            this.selectedIndexs.push(index)
        }else{
            this.selectedIndexs.splice(this.selectedIndexs.indexOf(index), 1);
        }
    }
    massCheck(event){
        this.selectedIndexs = []
        var checkboxes = document.querySelectorAll("tbody .columnCheckbox input");
        for(var el of checkboxes){
            el.checked = event.target.checked
            if(event.target.checked){
                this.selectedIndexs.push(Array.from(checkboxes).indexOf(el))
            }
        }
    }
    setAccess(){
        var data = this.state.data
        if (this.selectedAccessGroup == "All"){
            this.selectedAccessGroup = this.state.access
        }else{
            this.selectedAccessGroup = [this.selectedAccessGroup]
        }
        for(var index in this.selectedIndexs){
            for(var access in this.selectedAccessGroup){
                document.getElementById(this.selectedIndexs[index]+"_accessSettings_"+this.selectedAccessGroup[access].replace(" ", "")).checked = true
                data[this.selectedIndexs[index]].access[this.selectedAccessGroup[access]] = true
            }
        }
    }
    render(){
        if (this.state.displayList.length != 0){
            return(
                <div>
                    <h5>Users Access</h5>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="btn-group">
                                <lable className="btn">
                                    <b>Access filter</b>
                                </lable>
                                <MultiSelect data={this.state.access} all="All" title="Access filter" change={this.changeAccess} multiSelect={true}/>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="btn-group">
                                <lable className="btn">
                                    <b>Team filter</b>
                                </lable>
                                <MultiSelect data={this.state.teams} all="All Teams" title="Team filter" change={this.changeTeam} multiSelect={true}/>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="btn-group">
                                <lable className="btn">
                                    <b>Role filter</b>
                                </lable>
                                <MultiSelect data={this.state.roles} all="All Roles" title="Role filter" change={this.changeRole} multiSelect={true}/>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-md-12">
                            <div className="input-group disable-div">
                                <MultiSelect data={this.state.access} all="All" title="Access Group" change={this.changeSelectedAccess} multiSelect={false}/>
                                <span className="input-group-btn">
                                    <button className="btn btn-primary" id="accessInputGRoupButton" onClick={this.setAccess}>Set selected Access Group</button>
                                </span>
                                <h5 className="input-group-addon" id="accessInputGroup">
                                    <FontAwesomeIcon icon="info-circle" />
                                    <text>chechboxes of the chosen Access Group will be checked for selected users</text>
                                </h5>
                            </div>
                        </div>
                    </div>
                    <table className="table table-striped" id="accessTable">
                        <thead>
                            <tr>
                                <th className="columnCheckbox">
                                    <label className="checkbox">
                                        <input type="checkbox" defaultChecked={false} onClick={this.massCheck} id="massSelect"/>
                                        <span className="checkmark"></span>
                                    </label>
                                </th>
                                <th className="columnModify">#</th>
                                <th className="columnUsersFullName">Full Name</th>
                                <th className="columnUsersRole">Role</th>
                                <th className="columnTeamUser">Team</th>
                                {this.state.access.map(key =>
                                    <th className="columnAccessHeader" key={key}>{key}</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map(key =>
                                this.state.displayList[this.state.data.indexOf(key)] ?
                                    <tr key={Object.values(this.state.displayList) + Object.values(this.state) + this.state.data.indexOf(key)}>
                                        <td className="columnCheckbox">
                                            <label className="checkbox">
                                                <input type="checkbox" defaultChecked={false} id={this.state.data.indexOf(key)+"_userAccessConfig"} onClick={this.changeList}/>
                                                <span className="checkmark"></span>
                                            </label>
                                        </td>
                                        <td className="columnModify">{this.state.data.indexOf(key)+1}</td>
                                        <td className="columnUsersFullName">{key.fullName}</td>
                                        <td className="columnUsersRole">{key.userRoleShort}</td>
                                        <td className="columnTeamUser">{key.userTeam}</td>
                                        {this.state.access.map(access =>
                                            <td className="columnAccessHeader" key={access+key} >
                                                <label className="checkbox">
                                                    <input type="checkbox" defaultChecked={Object.keys(key.access).indexOf(access) != -1} id={this.state.data.indexOf(key)+"_accessSettings_"+access.replace(" ", "")} name={access} onChange={this.changeSettings}/>
                                                    <span className="checkmark" data-tip  data-for={this.state.data.indexOf(key)+"_cell_"+access}></span>
                                                    <ReactTooltip id={this.state.data.indexOf(key)+"_cell_"+access}>
                                                        <span>{this.state.data.indexOf(key)+1 + " " + key.fullName + " " + key.userTeam + " " + key.userRoleShort}</span>
                                                    </ReactTooltip>
                                                </label>
                                            </td>
                                        )}
                                    </tr>
                                :
                                    null
                            )}
                        </tbody>
                    </table>
                    <div className="row">
                        <a className="btn btn-primary" onClick={this.updateData}>Update Access</a>
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
                                <h4 className="modal-title" id="message">Successfully updated</h4>
                            </div>
                            <div className="modal-footer">
                                <a className="btn btn-default" onClick={this.closeModal} >Ok</a>
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
export default UsersAccess