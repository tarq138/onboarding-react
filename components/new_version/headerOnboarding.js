import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';

class HeaderOnboarding extends Component{
    render(){ 
        return(
            <div id="newHeader">
                <NavLink to='/'><h5>Dashboard: Onboarding</h5></NavLink>
            </div>
        )
    }
}
export default HeaderOnboarding