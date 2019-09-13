import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus, faMinus} from "@fortawesome/free-solid-svg-icons";
library.add(faPlus, faMinus);
import Modal from 'react-modal';

class AccessGroup extends Component{
    constructor(props){
        super(props);
        this.modalText = "";
        this.state = {modalIsOpen: false, modalDeleteIsOpen: false}
        this.changeInput = this.changeInput.bind(this);
        this.updateData = this.updateData.bind(this);
        this.add = this.add.bind(this);
        this.delete = this.delete.bind(this);
        this.deleteNew = this.deleteNew.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.massCheck = this.massCheck.bind(this);
        this.deleteList = this.deleteList.bind(this);
        this.massDelete = this.massDelete.bind(this);
        this.deleteId = null;
        this.namesDelete = [];
        this.deleteIds = [];
    }
    componentDidMount(){
        let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/groups/'+this.props.documentId
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
    massCheck(event){ 
        this.namesDelete = [];
        this.deleteIds = [];
        var elems = document.querySelectorAll("tbody .columnCheckbox input");
        for(var el of elems){
            el.checked = event.target.checked;
            if(event.target.checked){
                this.deleteIds.push(el.getAttribute("id").split("_")[0])
                this.namesDelete.push(this.state.data[el.getAttribute("id").split("_")[2]].accessResource)
            }
        }
    }
    deleteList(event){
        var elems = document.querySelectorAll("thead .columnCheckbox input");
        elems[0].checked = false;
        const id = event.target.getAttribute("id").split("_")[0];
        const name = this.state.data[event.target.getAttribute("id").split("_")[2]].accessResource;
        if(event.target.checked){
            this.deleteIds.push(id)
            this.namesDelete.push(name)
        }else{
            this.deleteIds.splice(this.deleteIds.indexOf(id), 1)
            this.namesDelete.splice(this.namesDelete.indexOf(name), 1)
        }
    }
    massDelete(){
        if (this.namesDelete.length != 0){
            this.modalText = "Delete all entry for " + this.namesDelete.join(", ") +" ?";
            this.setState({modalDeleteIsOpen: true});
        }else{ 
            this.modalText = "There is no chosen groups for delete";
            this.setState({modalIsOpen: true});
        }
    }
    changeInput(event) {
        const index = event.target.id.split("_")[0]
        const param = event.target.id.split("_")[2]
        this.state.data[index][param] = event.target.value
    }
    add(){
        var data = this.state.data
        data.push({})
        this.setState({data: data})
    }
    deleteNew(){
        var data = this.state.data
        data.pop();
        this.setState({data: data})
    }
    delete(event){
        this.namesDelete = [];
        this.modalText = "Delete all entry for " + this.state.data[event.currentTarget.id.split("_")[3]].accessResource + " ?"
        this.deleteId = event.currentTarget.id.split("_")[0]
        this.setState({modalDeleteIsOpen: true});
    }
    confirmDelete(){
        if (this.namesDelete.length == 0){
            const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
            let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/group/'+this.deleteId
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
                this.setState({data:json})
            })
        }else{
            var data = {
                ids: this.deleteIds,
                docId: this.props.documentId
            }
            const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
            let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/groups'
            fetch(URL, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AuthStr
                },
                body: JSON.stringify(data)
            }).then(response => {
                return response.json()
            }).then(json => {
                this.closeModal();
                this.setState({data:json})
            })
        }
    }
    updateData(){
        var flagError = false
        var names = []
        var elems = document.querySelectorAll(".columnAccessGroup input");
        [].forEach.call(elems, function(el) {
            el.classList.remove("input-error");
        });
        for (var i in this.state.data){
            if((this.state.data[i].accessResource == undefined) || (this.state.data[i].accessResource == '')){
                document.getElementById(i+"_accessconfig_accessResource").classList.add('input-error')
                flagError = true
            }
            if (names.indexOf(this.state.data[i].accessResource) != -1){
                flagError = true
                document.getElementById(i+"_accessconfig_accessResource").classList.add('input-error')
                document.getElementById(names.indexOf(this.state.data[i].name) +"_accessconfig_accessResource").classList.add('input-error')
            }
        }
        if(!flagError){
            let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/groups/'+this.props.documentId
            const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
            fetch(URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AuthStr
                },
                body: JSON.stringify(this.state.data)
            }).then(response => {
                return response.json()
            }).then(json => {
                this.modalText = "Successfully updated";
                this.setState({data:json});
                this.openModal();
            })
        }
    }
    openModal() {
        this.setState({modalIsOpen: true});
    }
    closeModal() {
        this.setState({modalIsOpen: false});
        this.setState({modalDeleteIsOpen: false});
    }
    render(){
        if (Object.keys(this.state).indexOf('data') != -1){
            return(
                <div className="row">
                    <h5>Access Groups</h5>
                    <div className="col-md-12">
                        <table className="table table-striped" id="AcceessGroupTable">
                            <thead>
                                <tr>
                                    <th className="columnModify"><button className="btn btn-default" onClick={this.add}><FontAwesomeIcon icon="plus" /></button></th>
                                    <th className="columnCheckbox">
                                    <label className="checkbox">
                                        <input type="checkbox" defaultChecked={false} onClick={this.massCheck}/>
                                        <span className="checkmark"></span>
                                    </label>
                                    </th>
                                    <th className="columnModify">#</th>
                                    <th className="columnAccessGroup"><b className="mandaroryIcon">*</b> Access Group</th>
                                    <th className="columnLdapName">Ldap Name</th>
                                    <th className="columnACtiveDirectoryPath">Active Directory Path</th>
                                    <th className="columnDescription">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.data.map(key =>
                                    <tr key={Object.values(key)}>
                                        {Object.keys(key).length != 0 ?
                                            <td className="columnModify"><button className="btn btn-default" id={key.id+"_accessconfig_delete_"+this.state.data.indexOf(key)} onClick={this.delete}><FontAwesomeIcon icon="minus" /></button></td>
                                            :
                                            <td className="columnModify"><button className="btn btn-default" id={key.id+"_accessconfig_delete_"+this.state.data.indexOf(key)} onClick={this.deleteNew}><FontAwesomeIcon icon="minus" /></button></td>
                                        }
                                        <td className="columnCheckbox">
                                            <label className="checkbox">
                                                <input type="checkbox" defaultChecked={false} className="access_mass" id={key.id+"_accessconfig_"+this.state.data.indexOf(key)} onClick={this.deleteList}/>
                                                <span className="checkmark"></span>
                                            </label>
                                        </td>
                                        <td className="columnModify">{this.state.data.indexOf(key)+1}</td>
                                        <td className="columnAccessGroup"><input className="form-control" type="text" id={this.state.data.indexOf(key)+"_accessconfig_accessResource"} defaultValue={key.accessResource} onChange={this.changeInput}/></td>
                                        <td className="columnLdapName"><input className="form-control" type="text" id={this.state.data.indexOf(key)+"_accessconfig_groupName"} defaultValue={key.groupName} onChange={this.changeInput}/></td>
                                        <td className="columnACtiveDirectoryPath"><input className="form-control" type="text" id={this.state.data.indexOf(key)+"_accessconfig_groupLdapName"} defaultValue={key.groupLdapName} onChange={this.changeInput}/></td>
                                        <td className="columnDescription"><input className="form-control" type="text" id={this.state.data.indexOf(key)+"_accessconfig_description"} defaultValue={key.description} onChange={this.changeInput}/></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-5">
                        <a className="btn btn-primary" id="groups_update" onClick={this.updateData}>Update Access Groups</a>            
                    </div>
                    <div className="col-md-7">
                        <a className="btn btn-default" id="groups_mass_delete" onClick={this.massDelete}><b>Delete </b>chosen groups</a>
                    </div>
                    <Modal
                        isOpen={this.state.modalIsOpen}
                        onRequestClose={this.closeModal}
                        ariaHideApp={false}
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
export default AccessGroup
