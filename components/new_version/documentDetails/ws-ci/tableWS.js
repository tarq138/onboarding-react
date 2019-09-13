import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus, faMinus} from "@fortawesome/free-solid-svg-icons";
library.add(faPlus, faMinus);

class TableWS extends Component{
    constructor(props){
        super(props);
        this.state = {data: this.props.data}
        this.changeInput = this.changeInput.bind(this);
        this.updateData = this.updateData.bind(this);
    }
    changeInput(event) {
        const index = event.target.id.split("_")[0]
        const param = event.target.id.split("_")[2]
        var data = this.state.data
        data[index][param] = event.target.value
        this.setState({data: data})
    }
    updateData(){
        var flagError = false
        var names = []
        var elems = document.querySelectorAll(".columnCiWs select");
        [].forEach.call(elems, function(el) {
            el.classList.remove("input-error");
        });
        var elems = document.querySelectorAll(".columnNameWs input");
        [].forEach.call(elems, function(el) {
            el.classList.remove("input-error");
        });
        for (var i in this.state.data){
            if(this.state.data[i].ciName == null){ 
                document.getElementById(i+"_wsconfig_ciName").classList.add('input-error')
                flagError = true
            }
            if (names.indexOf(this.state.data[i].name) != -1){
                flagError = true
                document.getElementById(i+"_wsconfig_name").classList.add('input-error')
                document.getElementById(names.indexOf(this.state.data[i].name) +"_wsconfig_name").classList.add('input-error')
            }
            if (this.state.data[i].name == ""){
                flagError = true
                document.getElementById(i+"_wsconfig_name").classList.add('input-error')
            }
            names.push(this.state.data[i].name)
        }
        if (!flagError){ 
            this.props.put(this.state.data)
        }
    }
    render(){
        return(
            <div className="col-md-12">
                <div id="WSTable">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th colSpan={5}></th>
                                <th colSpan={5}>Provisioned</th>
                                <th colSpan={5}>Projected</th>
                                <th colSpan={5}></th>
                            </tr>
                            <tr>
                                <th className="columnModify"><button className="btn btn-default" onClick={this.props.post}><FontAwesomeIcon icon="plus" /></button></th>
                                <th className="columnNameWs">Name</th>
                                <th className="columnCiWs">CI Stream</th>
                                <th className="columnComponentWs">Component</th>
                                <th className="columnVendorWs">Vendor</th>
                                <th className="columnDevWs">Dev</th>
                                <th className="columnCMsWs">CMs</th>
                                <th className="columnQAsWs">QAs</th>
                                <th className="columnBAsWs">BAs</th>
                                <th className="columnARsWs">ARs</th>
                                <th className="columnDevWs">Dev</th>
                                <th className="columnCMsWs">CMs</th>
                                <th className="columnQAsWs">QAs</th>
                                <th className="columnBAsWs">BAs</th>
                                <th className="columnARsWs">ARs</th>
                                <th className="columnEISTargetWs">EIS Target</th>
                                <th className="columnEISSuiteWs">EIS Suite</th>
                                <th className="columnExtAccessWs">Ext Access</th>
                                <th className="columnCommentsWs">Comments</th>
                                <th className="columnSmokeTestsWs">Smoke tests</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.data.map(key =>
                                <tr key={Object.values(key)+this.props.data.indexOf(key)}>
                                    <td className="columnModify"><button className="btn btn-default" id={key.id+"_wsconfig_delete"} name={"ws_"+key.name+"_"+key.id} onClick={this.props.delete}><FontAwesomeIcon icon="minus" /></button></td>
                                    <td className="columnNameWs"><input className="form-control" type="text" id={this.props.data.indexOf(key)+"_wsconfig_name"} defaultValue={key.name} onChange={this.changeInput}/></td>
                                    <td className="columnCiWs">
                                        <select value={key.ciName || ''} className="form-control" id={this.props.data.indexOf(key)+"_wsconfig_ciName"} onChange={this.changeInput}>
                                            <option value='' disabled></option>
                                            {key.ciNames
                                                .map(key => <option value={key} key={key}>{key}</option>
                                                )}
                                        </select>
                                    </td>
                                    <td className="columnComponentWs"><input className="form-control" type="text" id={this.props.data.indexOf(key)+"_wsconfig_component"} defaultValue={key.component} placeholder="Component" onChange={this.changeInput}/></td>
                                    <td className="columnVendorWs"><input className="form-control" type="text" id={this.props.data.indexOf(key)+"_wsconfig_vendor"} defaultValue={key.vendor} onChange={this.changeInput}/></td>
                                    <td className="columnDevWs"><input className="form-control" type="text" defaultValue={key.amountDev} readOnly/></td>
                                    <td className="columnCMsWs"><input className="form-control" type="text" defaultValue={key.amountCM} readOnly/></td>
                                    <td className="columnQAsWs"><input className="form-control" type="text" defaultValue={key.amountQA} readOnly/></td>
                                    <td className="columnBAsWs"><input className="form-control" type="text" defaultValue={key.amountBA} readOnly/></td>
                                    <td className="columnARsWs"><input className="form-control" type="text" defaultValue={key.amountAR} readOnly/></td>
                                    <td className="columnDevWs"><input className="form-control" type="text" id={this.props.data.indexOf(key)+"_wsconfig_projectedDev"} defaultValue={key.projectedDev} placeholder={0} onChange={this.changeInput}/></td>
                                    <td className="columnCMsWs"><input className="form-control" type="text" id={this.props.data.indexOf(key)+"_wsconfig_projectedCm"} defaultValue={key.projectedCM} placeholder={0} onChange={this.changeInput}/></td>
                                    <td className="columnQAsWs"><input className="form-control" type="text" id={this.props.data.indexOf(key)+"_wsconfig_projectedQA"} defaultValue={key.projectedQa} placeholder={0} onChange={this.changeInput}/></td>
                                    <td className="columnBAsWs"><input className="form-control" type="text" id={this.props.data.indexOf(key)+"_wsconfig_projectedBa"} defaultValue={key.projectedBa} placeholder={0} onChange={this.changeInput}/></td>
                                    <td className="columnARsWs"><input className="form-control" type="text" id={this.props.data.indexOf(key)+"_wsconfig_projectedAr"} defaultValue={key.projectedAr} placeholder={0} onChange={this.changeInput}/></td>
                                    <td className="columnEISTargetWs"><input className="form-control" type="text" id={this.props.data.indexOf(key)+"_wsconfig_eisTargetVersion"} defaultValue={key.eisTargetVersion} onChange={this.changeInput}/></td>
                                    <td className="columnEISSuiteWs"><input className="form-control" type="text" id={this.props.data.indexOf(key)+"_wsconfig_eisSuiteVersion"} defaultValue={key.eisSuiteVersion} onChange={this.changeInput}/></td>
                                    <td className="columnExtAccessWs">
                                        <label className="checkbox">
                                        <input type="checkbox" id={this.props.data.indexOf(key)+"_wsconfig_externalAccess"} value={key.externalAccess} onChange={this.changeInput}/>
                                            <span className="checkmark"></span>
                                        </label>
                                    </td>
                                    <td className="columnCommentsWs"><input className="form-control" type="text" id={this.props.data.indexOf(key)+"_wsconfig_comments"} defaultValue={key.comments} onChange={this.changeInput}/></td>
                                    <td className="columnSmokeTestsWs"><input className="form-control" type="text" id={this.props.data.indexOf(key)+"_wsconfig_smokeTests"} defaultValue={key.smokeTests} onChange={this.changeInput}/></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <a className="btn btn-primary" id="workstream_update" onClick={this.updateData}>Update Work Streams</a>
            </div>
        )
    }
}
export default TableWS