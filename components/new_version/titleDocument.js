import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
//import '/react-app-boilerplate/app/App';

class TitleDocument extends Component{
    render(){
        if (JSON.parse(localStorage.getItem('documentsList'))[this.props.document]["inProgressVersion"] != null){
            return(
                <div className="document-onboarding col-md-2">
                    <div className="card">
                        <div className="card-header">
                            {this.props.document}
                        </div>
                        <div className="card-body">
                            <p className="card-text">CI streams: {JSON.parse(localStorage.getItem('documentsList'))[this.props.document]["inProgressVersion"]["amountCIStreams"]}</p>
                            <p className="card-text">Active users: {JSON.parse(localStorage.getItem('documentsList'))[this.props.document]["inProgressVersion"]["amountAllEnabledMembers"]}</p>
                            <p className="card-text">Enabled hosts: {JSON.parse(localStorage.getItem('documentsList'))[this.props.document]["inProgressVersion"]["amountEnabledHosts"]}</p>
                            <p className="card-text">Last edit: </p> 
                            <p className="card-text">{JSON.parse(localStorage.getItem('documentsList'))[this.props.document]["inProgressVersion"]["editDateTimePDT"]}</p>
                            <NavLink className="btn btn-primary" to={`/${JSON.parse(localStorage.getItem('documentsList'))[this.props.document]["inProgressVersion"]["id"]}`}>Open</NavLink>
                        </div>
                    </div>
                </div>
            )
        }else{ 
            return null
        }
    }
}
export default TitleDocument