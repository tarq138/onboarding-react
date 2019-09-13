import React, { Component } from 'react';
import MultiSelect from '../usersAccess/MultiSelect';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus, faMinus, faInfoCircle, faEye} from "@fortawesome/free-solid-svg-icons";
import { element } from 'prop-types';
library.add(faPlus, faMinus, faInfoCircle, faEye);

class ProvisionedUsers extends Component{
    constructor(props){
        super(props);
        this.state = {active: true};
        this.showPassword = this.showPassword.bind(this);
        this.changeView = this.changeView.bind(this);
    }
    componentDidMount(){
        const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
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
            this.setState({teams: json})
        }).catch(error =>
            console.error(error)
        );
        var components = []
        URL = localStorage.getItem('urlPrefix') + '/api/onboarding/workstream/components/'+this.props.documentId;
        fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AuthStr
            }
        }).then(response => {
            return response.json()
        }).then(json => {
            this.setState({components: json})
        }).catch(error =>
            console.error(error)
        );
        URL = localStorage.getItem('urlPrefix') + '/api/onboarding/users/locations/'+this.props.documentId;
        fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AuthStr
            }
        }).then(response => {
            return response.json()
        }).then(json => {
            this.setState({locations: json})
        }).catch(error =>
            console.error(error)
        );
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
            this.setState({roles: json})
        }).catch(error =>
            console.error(error)
        );
        this.getUsers('true');
    }
    getUsers(type){
        const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
        let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/users/'+this.props.documentId+"/"+type;
        fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AuthStr
            }
        }).then(response => {
            return response.json()
        }).then(json => {
            this.setState({data: json})
        }).catch(error =>
            console.error(error)
        );
    }
    showPassword(event){
        console.log(event.target)
    }
    changeView(event){
        event.target.classList.add('active');
        var value = (!(event.target.id.replace("Users", "") == "true")).toString();
        document.getElementById(value+"Users").classList.remove('active');
        this.getUsers(event.target.id.replace("Users", ""));
    }
    render(){
        if ((Object.keys(this.state).indexOf('data') != -1) && (Object.keys(this.state).indexOf('teams') != -1) && (Object.keys(this.state).indexOf('locations') != -1) && (Object.keys(this.state).indexOf('components') != -1) && (Object.keys(this.state).indexOf('roles') != -1)){
            return(
                <div>
                    <h5>Provisioned Users</h5>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="btn-group">
                                        <lable className="btn">
                                            <b>Team filter</b>
                                        </lable>
                                        <br/>
                                        <MultiSelect data={this.state.teams} all="All Teams" title="Team filter" change={this.changeTeam} multiSelect={true}/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="btn-group">
                                        <lable className="btn">
                                            <b>Role filter</b>
                                        </lable>
                                        <MultiSelect data={this.state.roles} all="All Roles" title="Role filter" change={this.changeRole} multiSelect={true}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div style={{height: "35px"}}></div>
                            <div className="btn-group" data-toggle="buttons">
                                <labels className="btn btn-default active" id="trueUsers" onClick={this.changeView}>Show active users</labels>
                                <labels className="btn btn-default" id="falseUsers" onClick={this.changeView}>Show all users</labels>
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div style={{height: "35px"}}></div>
                            <div className="btn-group" data-toggle="buttons">
                                <select defaultValue={"EIS"} className="form-control" id="userSelectRole">
                                    <option value="EIS">EIS</option>
                                    <option value="CUSTOMER">CUSTOMER</option>
                                    <option value="PARTNER">PARTNER</option>
                                </select>
                                <labels className="btn btn-default">Download team members</labels>
                                <labels className="btn btn-default">Download empty template</labels>
                            </div>
                            <a className="btn btn-default" style={{float: "right"}}>Import from CSV</a>
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-md-2">
                            <a className="btn btn-primary">Update Team Members</a>
                        </div>
                        <div className="col-md-2">
                            <a className="btn btn-primary">Update attribute</a>
                        </div>
                        <div className="col-md-4">
                            <div className="btn-group" role="group">
                                <button className="btn btn-default">
                                    <text><b>Disable</b> chosen users</text>
                                </button>
                                <button className="btn btn-default" onClick={this.massDelete}>
                                    <text><b>Delete</b> chosen users</text>
                                </button>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <h6 style={{color: "orange", float: "right"}}>User marked by this color has LDAP issues</h6>
                            <FontAwesomeIcon icon="info-circle" style={{color: "#5491A6", float: "right"}}/>
                        </div>
                    </div>
                    <table className="table table-striped">
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
                                <th className="columnUsersFullName">Full name</th>
                                <th className="columnTeamUser">Team</th>
                                <th className="columnEmailUser">Email</th>
                                <th className="columnUsersRole">Role</th>
                                <th className="columnLogin">Login</th>
                                <th className="columnAddToLdap">Add to LDAP</th>
                                <th className="columnPasswordUser">Initial password</th>
                                <th className="columnEyeIcon"></th>
                                <th className="columnComponentsUser">Components</th>
                                <th className="columnLocation">Locations</th>
                                <th className="columnStartDateUser">Start Date</th>
                                <th className="columnEndDateUser">End Date</th>
                                <th className="columnsJiraTicketStartUser">JIRA Ticker Start</th>
                                <th className="columnsJiraTicketEndUser">JIRA Ticker End</th>
                                <th className="columnBluePrint">Blueprint Role</th>
                                <th className="columnBluePrint">Blueprint Login</th>
                                <th className="columnSandbox">Sandbox Login</th>
                                <th className="columnSandbox">Sandbox Password</th>
                                <th className="columnEyeIcon"></th>
                                <th className="columnSandbox">RDP IP</th>
                            </tr>
                        </thead>
                        <tbody id="provisionedUsers">
                            {this.state.data.map(key =>
                                <tr key={Object.values(key)+this.state.data.indexOf(key)} className={((new Date(key.onbEndDate)).getTime() < (new Date()).getTime()) ? "text-muted":""}>
                                    <td className="columnModify"><button className="btn btn-default" onClick={this.handleCreate}><FontAwesomeIcon icon="minus" /></button></td>
                                    <td className="columnCheckbox">
                                        <label className="checkbox">
                                            <input type="checkbox" defaultChecked={false} onClick={this.massCheck}/>
                                            <span className="checkmark"></span>
                                        </label>
                                    </td>
                                    <td className="columnModify">{this.state.data.indexOf(key) + 1}</td>
                                    <td className="columnUsersFullName openWindow">{key.fullName}</td>
                                    <td className="columnTeamUser openWindow">{key.userTeam}</td>
                                    <td className="columnEmailUser openWindow">{key.email}</td>
                                    <td className="columnUsersRole openWindow">{key.userRoleShort}</td>
                                    <td className="columnLogin openWindow">{key.login}</td>
                                    <td className="columnAddToLdap">
                                        <label className="checkbox">
                                            <input type="checkbox" defaultChecked={key.addToLdap}/>
                                            <span className="checkmark"></span>
                                        </label>
                                    </td>
                                    <td className="columnPasswordUser openWindow">{"*".repeat(key.pw.length)}</td>
                                    <td className="columnEyeIcon"><FontAwesomeIcon icon="eye" onClick={this.showPassword}/></td>
                                    <td className="columnComponentsUser openWindow">{key.components}</td>
                                    <td className="columnLocation openWindow">{key.location}</td>
                                    <td className="columnStartDateUser openWindow">{key.onbStartDate}</td>
                                    <td className="columnEndDateUser openWindow">{key.onbEndDate}</td>
                                    <td className="columnsJiraTicketStartUser"><a target="_blank" href={key.startTicket}>{key.startTicket.split("/")[key.startTicket.split("/").length - 1]}</a></td>
                                    <td className="columnsJiraTicketEndUser">{key.endTicket}</td>
                                    <td className="columnBluePrint openWindow">{key.bpRole}</td>
                                    <td className="columnBluePrint openWindow">{key.bpLogin}</td>
                                    <td className="columnSandbox openWindow">{key.sandboxLogin}</td>
                                    <td className="columnSandbox openWindow">{"*".repeat(key.sandboxPw.length)}</td>
                                    <td className="columnEyeIcon"><FontAwesomeIcon icon="eye"/></td>
                                    <td className="columnSandbox openWindow">{key.rdpIp}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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
export default ProvisionedUsers