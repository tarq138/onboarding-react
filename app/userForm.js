import React from 'react';
import axios from 'axios';
import './App.js'
class UserForm extends React.Component {
    constructor(props) {
        super(props);
        var login = props.login;
        var password = props.password;
        this.state = {login: login, password: password};
        this.onLoginChange = this.onLoginChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    onPasswordChange(e) {
        var val = e.target.value;
        this.setState({password: val});
    }
    onLoginChange(e) {
        var val = e.target.value;
        this.setState({login: val});
    }
  
    handleSubmit(e) {
        e.preventDefault();
        let URL = localStorage.getItem('urlPrefix') + '/api/authenticate'
        const logindata = {
            'username': this.state.login,
            'password': this.state.password,
            'rememberMe': 'true'
        }
        axios.post(URL, logindata, false)
            .then(res =>{
                if (res["status"] == 200){
                    localStorage.setItem('tokenId', res["data"]["id_token"])
                    localStorage.setItem('username', this.state.login)
                    this.props.history.push("/");
                }
            })
    }
  
    render() {
        return (
            <div className="wrapper fadeInDown"> 
                <div id="formContent">
                    <form onSubmit={this.handleSubmit}>
                        <h2 className="titleForm">Dashboard: Onboarding</h2>
                        <input type="text" value={this.state.name}
                            onChange={this.onLoginChange} className="fadeIn second" name="username" placeholder="Username"/>
                        <input type="password" value={this.state.password}
                            onChange={this.onPasswordChange} className="fadeIn third" name="username" placeholder="Password"/>
                        <input type="submit" value="Login"  className="fadeIn fourth btn" defaultValue="Log In"/>
                    </form>
                </div>
            </div>
        );
    }
  }
  export default UserForm