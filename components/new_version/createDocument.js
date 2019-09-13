import React, { Component } from 'react';
import axios from 'axios';
import HeaderOnboarding from './headerOnboarding';
import BodyCreateDocument from './create-document/bodyCreateDocument';

class CreateDocument extends Component{
    constructor(props) {
        super(props);
        this.state = {data: {}};
    }
    componentDidMount(){
        let URL = localStorage.getItem('urlPrefix') + '/api/onboarding/price-plans'
        const AuthStr = 'Bearer '.concat(localStorage.getItem('tokenId'));
        axios.get(URL, { headers: { Authorization: AuthStr } })
        .then(res => {
            localStorage.setItem('pricePlan', JSON.stringify(res["data"]));
            this.setState({data: res["data"]});
        })
        .catch(res => {
            console.log(res)
            this.setState({data: res.response.status});
        })
    }
    render(){
        if (Object.keys(this.state.data).length == 0){
            return <div></div>
        }else{
            return(
                <div>
                    <HeaderOnboarding />
                    <BodyCreateDocument/>
                </div>
            )
        }
    }
}
export default CreateDocument