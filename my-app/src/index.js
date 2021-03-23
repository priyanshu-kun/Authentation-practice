import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Register from "./screens/register.jsx";
import Activate from "./screens/activation.jsx";
import Login from "./screens/login.jsx";
import App from './App';
import 'react-toastify/dist/ReactToastify.css'

ReactDOM.render(
  <React.StrictMode >
    <Router>
      <Switch>
        <Route path='/' exact render={(props) => <App {...props} />} />
        <Route path='/register' exact render={(props) => <Register {...props} />} />
        <Route path='/login' exact render={(props) => <Login {...props} />} />
        <Route path='/user/activate/:token' exact render={(props) => <Activate {...props} />} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
