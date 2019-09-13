import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus, faMinus} from "@fortawesome/free-solid-svg-icons";
library.add(faPlus, faMinus);
import Modal from 'react-modal';

class HWTemplate extends Component{
    constructor(props){
        super(props);
        this.state = {modalIsOpen: false, modalDeleteIsOpen: false};
        this.templates = [];
        this.modalText = "";
        this.deleteId = null;
        this.changeInput = this.changeInput.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.serverTypeChange = this.serverTypeChange.bind(this)
        this.deleteHWTemplate = this.deleteHWTemplate.bind(this)
        this.deleteNewHWTemplate = this.deleteNewHWTemplate.bind(this)
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.getHwTemplates();
    }
    getHwTemplates(){
        let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/hardware-templates/all/'+this.props.documentId
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
            this.templates = json
        })
    }
    openModal() {
        this.setState({modalIsOpen: true});
    }
    closeModal() {
        this.setState({modalIsOpen: false});
        this.setState({modalDeleteIsOpen: false});
    }
    deleteHWTemplate(event){
        this.deleteId = event.currentTarget.id.split('_')[0]
        this.modalText = "Delete all entry for "+event.currentTarget.name+" ?"
        this.setState({modalDeleteIsOpen: true});
    }
    confirmDelete(){
        let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/hardware-template/'+this.deleteId
        const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
        fetch(URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AuthStr
            },
            body: JSON.stringify({})
        }).then(response => {
            return response.json()
        }).then(json => {
            this.closeModal();
            this.getHwTemplates();
            this.setState({data:json})
        })
    }
    changeInput(event) {
        const index = event.target.id.split("_")[0]
        const param = event.target.id.split("_")[2]
        this.state.data[index][param] = event.target.value
    }
    handleUpdate(){
        var flagError = false
        var elems = document.querySelectorAll(".columnSuffix input");
        [].forEach.call(elems, function(el) {
            el.classList.remove("input-error");
        });
        var elems = document.querySelectorAll(".columnServerType input");
        [].forEach.call(elems, function(el) {
            el.classList.remove("input-error");
        });
        var listServerTypes = []
        for (var i in this.state.data){
            if (this.state.data[i].suffix == ''){
                flagError = true
                document.getElementById(i+"_hwtemplate_suffix").classList.add('input-error')
            }
            if (listServerTypes.indexOf(this.state.data[i].serverType) != -1){
                flagError = true
                document.getElementById(i+"_hwtemplate_serverType").classList.add('input-error')
                document.getElementById(listServerTypes.indexOf(this.state.data[i].serverType)+"_hwtemplate_serverType").classList.add('input-error')
            }
            listServerTypes.push(this.state.data[i].serverType)
        }
        if (!flagError){
            let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/hardware-templates/'+this.props.documentId
            const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
            fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AuthStr
                },
                redirect: 'follow',
                body: JSON.stringify(this.state.data)
            }).then(response => {
                return response.json()
            }).then(json => {
                this.modalText = "Successfully updated";
                this.openModal();
                this.getHwTemplates();
                this.setState({data:json})
            })
        }
    }
    handleCreate(){
        var data = this.state.data
        data.push({})
        this.setState({data: data})
    }
    deleteNewHWTemplate(){
        var data = this.state.data
        data.pop();
        this.setState({data: data})
    }
    serverTypeChange(event){
        if (event.target.value != ''){
            const index = event.target.id.split("_")[0]
            const param = event.target.id.split("_")[2]
            this.state.data[index][param] = event.target.value
            var flagFound = false
            for(var i in this.templates){
                if (this.templates[i].serverType == event.target.value){
                    flagFound = true
                    break
                }
            }
            if (flagFound){
                const attrList = ["defaultCore", "defaultDisk", "defaultMemory", "description", "osType", "serverGroup", "serverType", "suffix", "vmTemplate"]
                for(var attr in attrList){
                    document.getElementById(index+"_hwtemplate_"+attrList[attr]).value = this.templates[i][attrList[attr]];
                    this.state.data[index][attrList[attr]] = this.templates[i][attrList[attr]];
                }
            }
        }
    }
    componentDidMount(){
        const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
        let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/hardware-templates/'+this.props.documentId
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
        })
    }
    render(){
        if (Object.keys(this.state).indexOf('data') != -1){
            return(
                <div className="tab-content">
                    <h5>HW Templates</h5>
                    <div className="row">
                        <div className="col-md-12" id="HWTable">
                            <table className="table table-striped" id="table_hwconfig">
                                <thead>
                                    <tr>
                                        <th className="columnModify"><button className="btn btn-default" onClick={this.handleCreate}><FontAwesomeIcon icon="plus" /></button></th>
                                        <th className="columnNumber">#</th>
                                        <th className="columnServerType">Server Type</th>
                                        <th className="columnServerGroup">Server Group</th>
                                        <th className="columnSuffix"><b className="mandaroryIcon">*</b> Suffix</th>
                                        <th className="columnTemplateDescription">Template Description</th>
                                        <th className="columnCPU">CPU</th>
                                        <th className="columnRAM">RAM</th>
                                        <th className="columnDisk">Disk</th>
                                        <th className="columnOS">OS</th>
                                        <th className="columnVMTemplate">VM Template</th>
                                    </tr>
                                </thead>
                                <tbody id="tbody_hwconfig">
                                {this.state.data
                                .map(key =>
                                    <tr key={Object.values(key)+this.state.data.indexOf(key)}>
                                        {Object.keys(key).length != 0 ?
                                            <td className="columnModify"><button className="btn btn-default" id={key.id+"_hwtemplate_delete"} onClick={this.deleteHWTemplate} name={key.serverType}><FontAwesomeIcon icon="minus" /></button></td>
                                            :
                                            <td className="columnModify"><button className="btn btn-default" id={key.id+"_hwtemplate_delete"} onClick={this.deleteNewHWTemplate}><FontAwesomeIcon icon="minus" /></button></td>
                                        }
                                        <td className="columnNumber">{this.state.data.indexOf(key) + 1}</td>
                                        {Object.keys(key).length != 0 ?
                                            <td className="columnServerType"><input className="form-control" type="text" value={key.serverType} id={this.state.data.indexOf(key)+"_hwtemplate_serverType"} readOnly /></td>
                                            :
                                            <td className="columnServerType">
                                                    <input className="form-control" list="serverTypeList" onChange={this.serverTypeChange} id={this.state.data.indexOf(key)+"_hwtemplate_serverType"}/>
                                                    <datalist id="serverTypeList">
                                                        {this.templates
                                                            .map(key => <option value={key.serverType} key={this.templates.indexOf(key)} id={this.templates.indexOf(key)+"_serverType"}>{key.serverType}</option>
                                                        )}
                                                    </datalist>
                                            </td>
                                        }
                                        {Object.keys(key).length != 0 ?
                                            <td className="columnServerGroup"><input className="form-control" type="text" value={key.serverGroup} readOnly/></td>
                                            :
                                            <td className="columnServerGroup"><input className="form-control" type="text" id={this.state.data.indexOf(key)+"_hwtemplate_serverGroup"}/></td>
                                        }
                                        <td className="columnSuffix"><input className="form-control" type="text" id={this.state.data.indexOf(key)+"_hwtemplate_suffix"} defaultValue={key.suffix} onChange={this.changeInput}/></td>
                                        <td className="columnTemplateDescription"><input className="form-control" type="text" id={this.state.data.indexOf(key)+"_hwtemplate_description"} defaultValue={key.description} onChange={this.changeInput} /></td>
                                        <td className="columnCPU"><input className="form-control" type="text" id={this.state.data.indexOf(key)+"_hwtemplate_defaultCore"} defaultValue={key.defaultCore} onChange={this.changeInput} /></td>
                                        <td className="columnRAM"><input className="form-control" type="text" id={this.state.data.indexOf(key)+"_hwtemplate_defaultMemory"} defaultValue={key.defaultMemory} onChange={this.changeInput}/></td>
                                        <td className="columnDisk"><input className="form-control" type="text" id={this.state.data.indexOf(key)+"_hwtemplate_defaultDisk"} defaultValue={key.defaultDisk} onChange={this.changeInput} /></td>
                                        <td className="columnOS"><input className="form-control" type="text" id={this.state.data.indexOf(key)+"_hwtemplate_osType"} defaultValue={key.osType} onChange={this.changeInput} /></td>
                                        <td className="columnVMTemplate"><input className="form-control" type="text" id={this.state.data.indexOf(key)+"_hwtemplate_vmTemplate"} defaultValue={key.vmTemplate} onChange={this.changeInput} /></td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <a className="btn btn-primary" id="hwconfig_update" onClick={this.handleUpdate} >Update HW Configuration</a>
                        </div>
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
export default HWTemplate
