import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faFile, faFileAlt, faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import '../app/App';
library.add(faFile, faFileAlt);
class HeadersOnboarding extends Component{
    render(){
        var style ={
            width: "150px",
            float: "left",
            height: "100%",
            position: "fixed",
            background: "#fff"
        }
        return(
            <div className="nav flex-column nav-pills" id="documentHeaders" role="tablist" aria-orientation="vertical" style={style}>
                <FontAwesomeIcon icon="file-alt" />
                <span>Onboarding</span>
                {Object.keys(this.props.Data)
                .map(key =>
                    key==this.props.documentId ? 
                        <NavLink key={key} className="nav-link active"  role="tab" aria-selected="true" to={`/${key}`}>{key}</NavLink>
                        :
                        <NavLink key={key} className="nav-link"  role="tab" aria-selected="true" to={`/${key}`}>{key}</NavLink>
                )} 
            </div>
        )
    }
}
export default HeadersOnboarding