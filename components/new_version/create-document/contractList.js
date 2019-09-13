import React from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { DateUtils } from 'react-day-picker';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';

class ContractList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: Object.keys(JSON.parse(localStorage.getItem('pricePlan')))[0]
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {
        this.setState({value: event.target.value});
        this.props.changeInput(event)
    }
    render() {
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
        return (
            <div className="panel-body">
                <div className="row">
                    <div className="col-md-7 text-row">
                        Current Contract Plan
                    </div>
                    <div className="col-md-5">
                        <form onSubmit={this.handleSubmit} className="form-select">
                            <select value={this.state.value} onChange={this.handleChange} className="form-control" id="contractName">
                                {Object.keys(JSON.parse(localStorage.getItem('pricePlan')))
                                    .map(key => <option value={key} key={key}>{key}</option>
                                    )}
                                <option value='Custom'>Custom</option>
                            </select>
                        </form>
                    </div>
                </div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <td className="headerContractTable"></td>
                            <td className="valueContractTable"><small>Projected</small></td>
                            <td className="valueContractTable"><small>Contract limit</small></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="headerContractTable">CI Streams</td>
                            <td className="valueContractTable">
                                <input className="form-control" type="text" id="projectedCI" onChange={this.props.changeInput}></input>
                            </td>
                            <td className="valueContractTable">
                                {this.state.value == "Custom" ?
                                    <input className="form-control" type="text" id="contractedCI" onChange={this.props.changeInput}></input>
                                    :
                                    JSON.parse(localStorage.getItem('pricePlan'))[this.state.value]["maxCi"]
                                }
                            </td>
                        </tr>
                        <tr>
                            <td className="headerContractTable">VMs</td>
                            <td className="valueContractTable">
                                <input className="form-control" type="text" id="projectedVM" onChange={this.props.changeInput}></input>
                            </td>
                            <td className="valueContractTable">
                                {this.state.value == "Custom" ?
                                    <input className="form-control" type="text" id="contractedVM" onChange={this.props.changeInput}></input>
                                    :
                                    JSON.parse(localStorage.getItem('pricePlan'))[this.state.value]["maxVM"]
                                }
                            </td>
                        </tr>
                        <tr>
                            <td className="headerContractTable">Total Users</td>
                            <td className="valueContractTable">
                                <input className="form-control" type="text" id="projectedTotalUsers" onChange={this.props.changeInput}></input>
                            </td>
                            <td className="valueContractTable">
                                {this.state.value == "Custom" ?
                                    <input className="form-control" type="text" id="contractedTotalUsers" onChange={this.props.changeInput}></input>
                                    :
                                    JSON.parse(localStorage.getItem('pricePlan'))[this.state.value]["maxTotalUsers"]
                                }</td>
                        </tr>
                        <tr>
                            <td className="headerContractTable">Developers</td>
                            <td className="valueContractTable">
                                <input className="form-control" type="text" id="projectedDev" onChange={this.props.changeInput}></input>
                            </td>
                            <td className="valueContractTable">
                                {this.state.value == "Custom" ?
                                    <input className="form-control" type="text" id="contractedDev" onChange={this.props.changeInput}></input>
                                    :
                                    JSON.parse(localStorage.getItem('pricePlan'))[this.state.value]["maxDev"]
                                }</td>
                        </tr>
                        <tr>
                            <td className="headerContractTable">QAs</td>
                            <td className="valueContractTable">
                                <input className="form-control" type="text" id="projectedQA" onChange={this.props.changeInput}></input>
                            </td>
                            <td className="valueContractTable">
                                {this.state.value == "Custom" ?
                                    <input className="form-control" type="text" id="contractedQA" onChange={this.props.changeInput}></input>
                                    :
                                    JSON.parse(localStorage.getItem('pricePlan'))[this.state.value]["maxQa"]
                                }
                            </td>
                        </tr>
                        <tr>
                            <td className="headerContractTable">Contract start date</td>
                            <td colSpan="2">
                                <DayPickerInput
                                    dayPickerProps={{
                                        fixedWeeks : true
                                    }}
                                    formatDate={formatDate}
                                    format={'yyyy/MM/dd'}
                                    onDayChange={day => this.props.changeInput({target:{id:"contractStartDatePDT", "value": day}})}
                                    parseDate={parseDate}
                                    placeholder={`YYYY/MM/DD`}
                                    inputProps={{
                                        readOnly: true,
                                        className: 'form-control',
                                        type: 'text'
                                    }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="headerContractTable">Projected Work Streams</td>
                            <td colSpan="2">
                                <input className="form-control" type="text" id="projectedWorkStreams" onChange={this.props.changeInput}></input>
                            </td>
                        </tr>
                        <tr>
                            <td className="headerContractTable">Projected Workstations</td>
                            <td colSpan="2">
                                <input className="form-control" type="text" id="projectedWorkstations" onChange={this.props.changeInput}></input>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
export default ContractList