import React, { Component } from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import '../app/App';
import HeaderOnboarding from './new_version/headerOnboarding';
import BodyOnboarding from './new_version/bodyOnboarding';
global.documentsList = []
class MainOnboarding extends Component{
    constructor(props) {
        super(props);
        this.state = {data: {}};
    }
    componentDidMount(){
        let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/documents-history'
        const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
        axios.get(URL, { headers: { Authorization: AuthStr } })
        .then(res => {
            localStorage.setItem('documentsList', JSON.stringify(res["data"]));
            this.setState({data: res["data"]});
        })
        .catch(res => {
            this.setState({data: res.response.status});
        })
    }
    render(){
        if ((typeof(this.state.data) == 'number') && (this.state.data == 401)){
            return <Redirect to='/login' />
        }
        if (Object.keys(this.state.data).length == 0){
            return <div><HeaderOnboarding /></div>
        }else{
            //var link = '/'+Object.keys(this.state.data)[0]
            //return <Redirect to={link} />
            return(
                <div>
                    <HeaderOnboarding />
                    <BodyOnboarding  Data={JSON.parse(localStorage.getItem("documentsList"))} />
                </div>
            )
        }
    }
}
export default MainOnboarding