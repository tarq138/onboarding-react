import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus, faMinus} from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from 'react-tooltip';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { DateUtils } from 'react-day-picker';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
library.add(faPlus, faMinus);

class TableCI extends Component{
    constructor(props){
        super(props);
        this.state = {data: this.props.dataci}
        this.changeInput = this.changeInput.bind(this);
        this.updateData = this.updateData.bind(this);
    }
    changeInput(event){
        const index = event.target.id.split("_")[0]
        const param = event.target.id.split("_")[2]
        var data = this.state.data
        data[index][param] = event.target.value
        this.setState({data: data})
    }
    updateData(){
        var flagError = false
        var names = []
        var elems = document.querySelectorAll(".columnNameCi input");
        [].forEach.call(elems, function(el) {
            el.classList.remove("input-error");
        });
        for (var i in this.state.data){
            if (names.indexOf(this.state.data[i].name) != -1){
                flagError = true
                document.getElementById(i+"_ciconfig_name").classList.add('input-error')
                document.getElementById(names.indexOf(this.state.data[i].name) +"_ciconfig_name").classList.add('input-error')
            }
            if (this.state.data[i].name == ""){
                flagError = true
                document.getElementById(i+"_ciconfig_name").classList.add('input-error')
            }
            names.push(this.state.data[i].name)
        }
        if (!flagError){ 
            console.log(this.state.data)
            this.props.put(this.state.data)
        }
    }
    render(){
        function parseDate(str, format, locale) {
            const parsed = dateFnsParse(str, format, { locale });
            if (DateUtils.isDate(parsed)) {
                return parsed;
            }
            return undefined;
        }
        function formatDate(date, format, locale) {
            return dateFnsFormat(date, format, { locale });
        }
        return(
            <div className="col-md-12">
                <div id="CITable">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th colSpan={3}></th>
                                <th colSpan={6}>Provisioned</th>
                                <th colSpan={5}>Projected</th>
                                <th colSpan={3}></th>
                            </tr>
                            <tr>
                                <th className="columnModify"><button className="btn btn-default" onClick={this.props.post}><FontAwesomeIcon icon="plus" /></button></th>
                                <th className="columnNameCi">Name</th>
                                <th className="columnWsCi">Work Streams</th>
                                <th className="columnappServersCi">App servers</th>
                                <th className="columnDevCi">Dev</th>
                                <th className="columnCMsCi">CMs</th>
                                <th className="columnQAsCi">QAs</th>
                                <th className="columnBAsCi">BAs</th>
                                <th className="columnARsCi">ARs</th>
                                <th className="columnDevCi">Dev</th>
                                <th className="columnCMsCi">CMs</th>
                                <th className="columnQAsCi">QAs</th>
                                <th className="columnBAsCi">BAs</th>
                                <th className="columnARsCi">ARs</th>
                                <th className="columnDueDateCI">Due Date</th>
                                <th className="columnMercurialUrlCi">Mercurial URL to clone, timestamp or changeset</th>
                                <th className="columnChangesetIdCi">Changeset ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map(key =>
                                <tr key={Object.values(key)+this.state.data.indexOf(key)}>
                                    <td className="columnModify"><button className="btn btn-default" id={key.id+"_ciconfig_delete"} name={"ci_"+key.name+"_"+key.id} onClick={this.state.delete}><FontAwesomeIcon icon="minus" /></button></td>
                                    <td className="columnNameCi"><input className="form-control" type="text" id={this.state.data.indexOf(key)+"_ciconfig_name"} defaultValue={key.name} onChange={this.changeInput}/></td>
                                    <td className="columnWsCi">
                                        <input className="form-control" type="text" defaultValue={key.onbWorkStreams.join("; ")} readOnly data-tip  data-for={this.state.data.indexOf(key)+'WsCi'}/>
                                        {((key.onbWorkStreams.length > 0) && (key.onbWorkStreams.join("; ").length > 18)) ?
                                            <ReactTooltip id={this.state.data.indexOf(key)+'WsCi'}>
                                                <span>{key.onbWorkStreams.join("; ")}</span>
                                            </ReactTooltip>
                                            :
                                            null
                                        }
                                    </td>
                                    <td className="columnappServersCi"><input className="form-control" type="text" defaultValue={key.amountAppServers} readOnly/></td>
                                    <td className="columnDevCi"><input className="form-control" type="text" defaultValue={key.amountDev} readOnly/></td>
                                    <td className="columnCMsCi"><input className="form-control" type="text" defaultValue={key.amountCM} readOnly/></td>
                                    <td className="columnQAsCi"><input className="form-control" type="text" defaultValue={key.amountQA} readOnly/></td>
                                    <td className="columnBAsCi"><input className="form-control" type="text" defaultValue={key.amountBA} readOnly/></td>
                                    <td className="columnARsCi"><input className="form-control" type="text" defaultValue={key.amountAR} readOnly/></td>
                                    <td className="columnDevCi"><input className="form-control" type="text" id={this.state.data.indexOf(key)+"_ciconfig_projectedDev"} defaultValue={key.projectedDev} placeholder={0} onChange={this.changeInput}/></td>
                                    <td className="columnCMsCi"><input className="form-control" type="text" id={this.state.data.indexOf(key)+"_ciconfig_projectedCm"} defaultValue={key.projectedCM} placeholder={0} onChange={this.changeInput}/></td>
                                    <td className="columnQAsCi"><input className="form-control" type="text" id={this.state.data.indexOf(key)+"_ciconfig_projectedQA"} defaultValue={key.projectedQa} placeholder={0} onChange={this.changeInput}/></td>
                                    <td className="columnBAsCi"><input className="form-control" type="text" id={this.state.data.indexOf(key)+"_ciconfig_projectedBa"} defaultValue={key.projectedBa} placeholder={0} onChange={this.changeInput}/></td>
                                    <td className="columnARsCi"><input className="form-control" type="text" id={this.state.data.indexOf(key)+"_ciconfig_projectedAr"} defaultValue={key.projectedAr} placeholder={0} onChange={this.changeInput}/></td>
                                    <td className="columnDueDateCI">
                                        <DayPickerInput
                                            dayPickerProps={{
                                                fixedWeeks : true
                                            }}
                                            formatDate={formatDate}
                                            format={'MM/dd/yyyy'}
                                            onDayChange={day => this.changeInput({target:{id: this.state.data.indexOf(key)+"_ciconfig_eta", "value": formatDate(day, 'MM/dd/yyyy')}})}
                                            parseDate={parseDate}
                                            value={key.eta}
                                            placeholder={`MM/DD/YYYY`}
                                            inputProps={{
                                                readOnly: true,
                                                className: 'form-control',
                                                type: 'text'
                                            }}
                                        />
                                    </td>
                                    <td className="columnMercurialUrlCi"><input className="form-control" type="text" id={this.state.data.indexOf(key)+"_ciconfig_scmCloneUrl"} defaultValue={key.scmCloneUrl} onChange={this.changeInput}/></td>
                                    <td className="columnChangesetIdCi"><input className="form-control" type="text" id={this.state.data.indexOf(key)+"_ciconfig_scmCloneChangeset"} defaultValue={key.scmCloneChangeset} onChange={this.changeInput}/></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <a className="btn btn-primary" id="cistream_update" onClick={this.updateData}>Update CI Streams</a>
            </div>
        )
    }
}
export default TableCI
