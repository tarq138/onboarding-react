var React = require('react')
import { Component } from 'react';

var SelectBox = React.createFactory(require('./selectBox'))

var div = React.createElement.bind(null,'div')
var option = React.createElement.bind(null,'option')
var h1 = React.createElement.bind(null,'h1')

var Example = React.createFactory(React.createClass({displayName: 'Example',
    getInitialState: function () {
        if (this.props.multiSelect){
            return {
                colors: []
            }
        }else{ 
            return {
                colors: "-1"
            }
        }
    },
    handleMultiChange: function (colors) {
        if(this.props.multiSelect){
            if (colors.indexOf("-1") == 0){
                colors.shift()
            }
            if (colors.indexOf("-1") == (colors.length - 1)){
                colors = ["-1"]
            }
        }
        this.setState({ colors: colors })
        if (colors.indexOf("-1") != -1){
            this.props.change([this.props.all])
        }else{
            this.props.change(colors)
        }
    },
    render: function () {
        var opt = [];
        opt.push(option({key:this.props.all, value: '-1'}, this.props.all));
        for(var el in this.props.data){
            opt.push(option({key:this.props.data[el], value: this.props.data[el]}, this.props.data[el]));
        }
        return(
        div({className: "example"},
            SelectBox(
            {
                label: this.props.title,
                onChange: this.handleMultiChange,
                value: this.state.colors,
                multiple: this.props.multiSelect
            }, opt
            )
        )
        )
    }
}))

class MultiSelect extends Component{
    render(){
        return(
            Example(this.props)
        )
    }
}
export default MultiSelect