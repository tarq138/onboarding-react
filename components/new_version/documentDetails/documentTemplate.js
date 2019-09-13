import React, { Component } from 'react';
import HeaderOnboarding from '../headerOnboarding'
import DocumentBody from './documentBody'

class DocumentDetails extends Component{
    constructor(props){
        super(props);
        this.state = {};
    }
    componentDidMount(){
        let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/main-info/'+this.props.documentId
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
    render(){
        if (Object.keys(this.state).length != 0){
            return(
                <div>
                    <HeaderOnboarding/>
                    <DocumentBody data={this.state.data} documentId={this.props.documentId}/>
                </div>
            )
        }else{
            return(
                <div>
                    <HeaderOnboarding/>
                    <img src={"./loading.gif"} id="loadingImage" />
                </div>
            )
        }
    }
}
export default DocumentDetails