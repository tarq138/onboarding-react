import React, { Component } from 'react';
import TitleDocument from './titleDocument';
import NewDocument from './newDocument';
import {NavLink} from 'react-router-dom';

class BodyOnboarding extends Component{
    render(){
        return(
            <div className="row" id="documentList">
                <NewDocument />
                {Object.keys(this.props.Data).map(key => <TitleDocument document={key} key={key} />)}
            </div>
        )
    }
}
export default BodyOnboarding