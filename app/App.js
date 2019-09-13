import React, { Component } from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import {render} from 'react-dom';
import UserForm from './userForm';
import MainOnboarding from '../components/MainOnboardding';
import DocumentOnboarding from '../components/documentOnboarding';
import CreateDocument from '../components/new_version/createDocument';
import DocumentDetails from '../components/new_version/documentDetails/documentTemplate';

localStorage.setItem('urlPrefix', 'https://stgdashboard.exigengroup.com/backend')
class Main extends Component{
    render(){
      if (localStorage.getItem('tokenId') == null){
        return <Redirect to='/login' />
      }else{
        return <MainOnboarding />
      }
    }
}
class NotFound extends Component{render(){return <h2>Ресурс не найден</h2>;}}
class DocumentDet extends Component{
  render(){
    return <DocumentDetails documentId={this.props.match.params.id}/>
  }
}
render(
<BrowserRouter>
  <Switch>
    <Route exact path="/" component={Main}/>
    <Route path="/login" component={UserForm} />
    <Route path="/create-document" render={() => <CreateDocument/>}/>
    <Route path="/:id" component={DocumentDet}/>
    <Route component={NotFound} />
  </Switch>
</BrowserRouter>,
document.getElementById("bodyDocument")
)