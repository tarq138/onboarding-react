import React, { Component } from 'react';
import TableWS from './tableWS';
import TableCI from './tableCI';
import Modal from 'react-modal';

class WsCi extends Component{
    constructor(props){
        super(props);
        this.modalText = "";
        this.state = {modalIsOpen: false, modalDeleteIsOpen: false}
        this.getWS();
        this.getCI();
        this.putWS = this.putWS.bind(this);
        this.putCI = this.putCI.bind(this);
        this.postWS = this.postWS.bind(this);
        this.postCI = this.postCI.bind(this);
        this.deleteWS = this.deleteWS.bind(this);
        this.deleteCI = this.deleteCI.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openDelete = this.openDelete.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.delete = "";
    }
    openModal() {
        this.setState({modalIsOpen: true});
    }
    closeModal() {
        this.setState({modalIsOpen: false});
        this.setState({modalDeleteIsOpen: false});
    }
    openDelete(event){
        var type = event.currentTarget.name.split("_")[0]
        var streamName = event.currentTarget.name.split("_")[1]
        var id = event.currentTarget.name.split("_")[2]
        this.modalText = "Delete all entry for " + streamName + " ?"
        this.delete = type+"_"+id;
        this.setState({modalDeleteIsOpen: true});
    }
    confirmDelete(){
        var type = this.delete.split("_")[0]
        var id = this.delete.split("_")[1]
        if (type == "ws"){
            this.deleteWS(id)
        }else if (type == "ci"){
            this.deleteCI(id)
        }
    }
    getWS(){
        const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
        let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/workstream/'+this.props.documentId
        fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AuthStr
            }
        }).then(response => {
            return response.json()
        }).then(json => {
            this.setState({workstream:json})
        })
    }
    putWS(data){
        let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/workstream/'+this.props.documentId
        const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
        fetch(URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AuthStr
            },
            body: JSON.stringify(data)
        }).then(response => {
            return response.json()
        }).then(json => {
            this.modalText = "Successfully updated";
            this.setState({workstream:json});
            this.openModal();
            this.getCI();
        })
    }
    postWS(){
        const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
        let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/workstream/'+this.props.documentId
        fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AuthStr
            }
        }).then(response => {
            return response.json()
        }).then(json => {
            this.setState({workstream:json})
        })
    }
    deleteWS(wsId){
        const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
        let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/workstream/'+wsId
        fetch(URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AuthStr
            }
        }).then(response => {
            return response.json()
        }).then(json => {
            this.closeModal();
            this.setState({workstream:json})
            this.getCI()
        })
    }
    getCI(){
        const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
        let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/cistream/'+this.props.documentId
        fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AuthStr
            }
        }).then(response => {
            return response.json()
        }).then(json => {
            this.setState({cistream:json})
        })
    }
    postCI(){
        const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
        let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/cistream/'+this.props.documentId
        fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AuthStr
            }
        }).then(response => {
            return response.json()
        }).then(json => {
            this.setState({cistream:json})
            this.props.globalUpdate()
            this.getWS()
        })
    }
    deleteCI(ciId){
        const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
        let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/cistream/'+ciId
        fetch(URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AuthStr
            }
        }).then(response => {
            return response.json()
        }).then(json => {
            this.closeModal();
            this.setState({cistream:json})
            this.props.globalUpdate()
            this.getWS()
        })
    }
    putCI(data){
        let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/cistream/'+this.props.documentId
        const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
        fetch(URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AuthStr
            },
            body: JSON.stringify(data)
        }).then(response => {
            return response.json()
        }).then(json => {
            this.modalText = "Successfully updated";
            this.setState({cistream:json});
            this.openModal();
            this.props.globalUpdate()
            this.getWS();
        })
    }
    render(){
        if ((Object.keys(this.state).indexOf('workstream') != -1) && (Object.keys(this.state).indexOf('cistream') != -1)){
            return(
                <div className="tab-content">
                    <div className="row">
                        <h5>Work Stream</h5>
                        <TableWS data={this.state.workstream} put={this.putWS} delete={this.openDelete} post={this.postWS}/>
                    </div>
                    <hr></hr>
                    <div className="row">
                        <h5>CI Stream</h5>
                        <TableCI dataci={this.state.cistream} put={this.putCI} delete={this.openDelete} post={this.postCI}/>
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
                                <h4 className="modal-title" id="message">{this.modalText}</h4>
                            </div>
                            <div className="modal-footer">
                                <a className="btn btn-default" onClick={this.closeModal} >Ok</a>
                            </div>
                        </div>
                    </Modal>
                    <Modal
                        isOpen={this.state.modalDeleteIsOpen}
                        onRequestClose={this.closeModal}
                        ariaHideApp={false}
                        id="modalWindow"
                        className="modal-dialog modal-md fadeInDown fadeModal"
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">{this.modalText}</h4>
                            </div>
                            <div className="modal-footer">
                                <a className="btn btn-default" onClick={this.closeModal} >No</a>
                                <a className="btn btn-default confirm-delete" onClick={this.confirmDelete} >Yes</a>
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
export default WsCi