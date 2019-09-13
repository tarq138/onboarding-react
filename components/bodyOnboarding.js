import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import '../app/App';
class HeadersOnboarding extends Component{
    render(){
        var styleRight = {
            textAlign: "right"
        }
        var styleLeft = {
            textAlign: "left"
        }
        var styleButton ={
            width: "400px"
        }
        return(
            <div className="tab-pane fade show active" role="tabpanel" aria-labelledby="v-pills-home-tab">
                <div className="row actions-block">
                    <div className="col-md-6" style={styleRight}>
                        <button className="btn btn-primary" style={styleButton}>Create New Document</button>
                    </div>
                    <div className="col-md-6" style={styleLeft}>
                        <button className="btn btn-primary" style={styleButton}>Create/Update Document from existing resources</button>
                    </div>
                </div>
                <NavLink to={`/document/${this.props.documentId}/${this.props.document.inProgressVersion.id}`}>{this.props.document.inProgressVersion.documentName}</NavLink>
                <br></br>
                <span>Status<h5>{this.props.document.inProgressVersion.version}</h5></span>
                <span>Requester<h5>{this.props.document.inProgressVersion.editorName}</h5></span>
                <span>CI Streams<h5>{this.props.document.inProgressVersion.projectedCI}</h5></span>
                <span>Work Streams<h5>{this.props.document.inProgressVersion.projectedWorkStreams}</h5></span>
                <span>Developers<h5>{this.props.document.inProgressVersion.projectedDev}</h5></span>
                <span>QAs<h5>{this.props.document.inProgressVersion.projectedQA}</h5></span>
                <span>Active/Total users<h5>{this.props.document.inProgressVersion.amountAllEnabledMembers}/{this.props.document.inProgressVersion.amountAllMembers}</h5></span>
            </div>
        )
    }
}
export default HeadersOnboarding