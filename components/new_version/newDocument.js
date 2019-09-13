import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
//import '/react-app-boilerplate/app/App';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus} from "@fortawesome/free-solid-svg-icons";
library.add(faPlus);

class NewDocument extends Component{
    render(){
        return(
            <div className="document-onboarding col-md-2">
                <div className="card" id="cardForNewDocument">
                    <div className="card-header">
                        Create new document
                    </div>
                    <div className="card-body">
                        <NavLink to={`/create-document`} ><FontAwesomeIcon icon="plus" /></NavLink>
                    </div>
                </div>
            </div>
        )
    }
}
export default NewDocument