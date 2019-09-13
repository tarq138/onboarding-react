import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHome, faFile, faStream, faUsers, faUsersCog, faServer, faTasks, faUserFriends } from "@fortawesome/free-solid-svg-icons";
library.add(faHome, faFile, faStream, faUsers, faUsersCog, faServer, faTasks, faUserFriends);
import MainInfo from './main-info/mainInfo';
import WsCi from './ws-ci/wc-ci';
import ProvisionedUsers from './provisionedUsers/provisionderUsers'
import AccessGroup from './accessGroups/accessGroup'
import UsersAccess from './usersAccess/usersAccess'
import CiStream from './ciStream/ciStream';
import Workstations from './workstations/workstations';
import HWTemplate from './hwTemplates/hwTemplates';
import ReactTooltip from 'react-tooltip';

class DocumentDetails extends Component{
    constructor(props){
        super(props);
        this.state = {componentName: MainInfo};
        this.componentDidMount = this.componentDidMount.bind(this);
        this.ciStream = null;
    }
    componentDidMount(){
        let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/main-info/'+this.props.documentId;
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
    handleChange(event) {
        var elems = document.querySelectorAll(".nav-link");
        [].forEach.call(elems, function(el) {
            el.classList.remove("active");
        });
        event.currentTarget.classList.add('active')
        var id = event.currentTarget.attributes["aria-controls"]["value"]
        switch(id){
            case 'main-info':
                this.setState({componentName: MainInfo})
                break;
            case 'ws-ci':
                this.setState({componentName: WsCi})
                break;
            case 'provisioned-users':
                this.setState({componentName: ProvisionedUsers})
                break;
            case 'access-group':
                this.setState({componentName: AccessGroup})
                break;
            case 'users-access':
                this.setState({componentName: UsersAccess})
                break;
            case 'ci-hosts':
                this.ciStream = event.currentTarget.id;
                this.setState({componentName: CiStream})
                break;
            case 'workstations':
                this.setState({componentName: Workstations})
                break;
            case 'hw-template':
                this.setState({componentName: HWTemplate})
                break;
        }
        //document.getElementById(id).classList.add('show')
        //document.getElementById(id).classList.add('active')
    }
    render(){
        if (Object.keys(this.state).indexOf('data') != -1){
            return(
                <div className="content-body">
                    <div>
                        <ul className="nav nav-tabs nav-justified" id="myTab" role="tablist">
                            <li className="nav-item" data-tip  data-for='mainInfo'>
                                <a className="nav-link active" data-toggle="tab" role="tab" aria-controls="main-info" aria-selected="true" onClick={this.handleChange.bind(this)}><FontAwesomeIcon icon="home" /></a>
                            </li>
                            <ReactTooltip id='mainInfo'>
                                <span>Main Info</span>
                            </ReactTooltip>
                            <li className="nav-item" >
                                <a className="nav-link" data-toggle="tab" role="tab" aria-controls="ws-ci" aria-selected="false" onClick={this.handleChange.bind(this)}><FontAwesomeIcon icon="stream" /></a>
                            </li>
                            <ReactTooltip id='WSCI'>
                                <span>WS/Ci</span>
                            </ReactTooltip>
                            <li className="nav-item" data-tip  data-for='accessGroup'>
                                <a className="nav-link" data-toggle="tab" role="tab" aria-controls="access-group" aria-selected="false" onClick={this.handleChange.bind(this)}><FontAwesomeIcon icon="users" /></a>
                            </li>
                            <ReactTooltip id='accessGroup'>
                                <span>Access Group</span>
                            </ReactTooltip>
                            <li className="nav-item" data-tip  data-for='provisionedUsers'>
                                <a className="nav-link" data-toggle="tab" role="tab" aria-controls="provisioned-users" aria-selected="false" onClick={this.handleChange.bind(this)}><FontAwesomeIcon icon="user-friends" /></a>
                            </li>
                            <ReactTooltip id='provisionedUsers'>
                                <span>Provisioned Users</span>
                            </ReactTooltip>
                            <li className="nav-item" data-tip  data-for='usersAccess'>
                                <a className="nav-link" data-toggle="tab" role="tab" aria-controls="users-access" aria-selected="false" onClick={this.handleChange.bind(this)}><FontAwesomeIcon icon="users-cog" /></a>
                            </li>
                            <ReactTooltip id='usersAccess'>
                                <span>Users Access</span>
                            </ReactTooltip>

                            {Object.keys(this.state.data.onbCiStreamMap)
                            .map(key =>
                                <div key={key}>
                                    <li className="nav-item" data-tip  data-for={key+this.state.data.onbCiStreamMap[key]}>
                                        <a className="nav-link" data-toggle="tab" role="tab" aria-controls="ci-hosts" aria-selected="false" onClick={this.handleChange.bind(this)} id={this.state.data.onbCiStreamMap[key]+"_"+key}><FontAwesomeIcon icon="server" /></a>
                                    </li>
                                    <ReactTooltip id={key+this.state.data.onbCiStreamMap[key]}>
                                        <span>{key} hosts</span>
                                    </ReactTooltip>
                                </div>
                            )}
                            <li className="nav-item" data-tip  data-for='workstation'>
                                <a className="nav-link" data-toggle="tab" role="tab" aria-controls="workstations" aria-selected="false" onClick={this.handleChange.bind(this)}><FontAwesomeIcon icon="tasks" /></a>
                            </li>
                            <ReactTooltip id='workstation'>
                                <span>Workstations</span>
                            </ReactTooltip>
                            <li className="nav-item" data-tip  data-for='hwTemplates'>
                                <a className="nav-link" data-toggle="tab"  role="tab" aria-controls="hw-template" aria-selected="false" onClick={this.handleChange.bind(this)}><FontAwesomeIcon icon="file" /></a>
                            </li>
                            <ReactTooltip id='hwTemplates'>
                                <span>HW templates</span>
                            </ReactTooltip>
                        </ul>
                        <div className="tab-content panel-body" id="myTabContent">
                            <div className="tab-pane fade show active"  role="tabpanel" aria-labelledby="home-tab">
                                {
                                    (this.state.componentName == MainInfo) ?
                                    <this.state.componentName documentId={this.props.documentId} data={this.state.data}/>
                                    :
                                    (this.state.componentName == WsCi) ?
                                    <this.state.componentName documentId={this.props.documentId} globalUpdate={this.componentDidMount}/>
                                    :
                                    (this.state.componentName == CiStream) ?
                                    <this.state.componentName documentId={this.props.documentId} ciStream={this.ciStream} key={this.ciStream}/>
                                    :
                                    <this.state.componentName documentId={this.props.documentId}/>
                                }
                            </div>
                        </div>
                    </div>
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
export default DocumentDetails