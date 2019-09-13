import React, { Component } from 'react';
import HeadersOnboarding from './headersOnboarding';
import BodyOnboarding from './bodyOnboarding'
import "./MainOnboardding"

class DocumentOnboarding extends Component{
    render(){
        var style ={
            marginLeft: "150px"
        }
        return(
            <div>
                <HeadersOnboarding Data={JSON.parse(localStorage.getItem("documentsList"))} documentId={this.props.documentId} />
                <div className="tab-content" style={style}>
                    <BodyOnboarding document={JSON.parse(localStorage.getItem("documentsList"))[this.props.documentId]} documentId={this.props.documentId} />
                </div>
            </div>
        )
    }
}
export default DocumentOnboarding