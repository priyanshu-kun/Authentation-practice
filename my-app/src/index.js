import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Register from "./screens/register.jsx";
import App from './App';
import 'react-toastify/dist/ReactToastify.css'

ReactDOM.render(
  <React.StrictMode >
    <Router>
      <Switch>
        <Route path='/' exact render={(props) => <App {...props} />} />
        <Route path='/register' exact render={(props) => <Register {...props} />} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
