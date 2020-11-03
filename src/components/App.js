// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import './App.css';
import * as microsoftTeams from "@microsoft/teams-js";
import { HashRouter as Router, Route } from "react-router-dom";

import AuthService from '../services/AuthService'

import Privacy from "./Privacy";
import TermsOfUse from "./TermsOfUse";
import Tab from "./Tab";
import TeamsAuthPopup from './TeamsAuthPopup';
import Web from './Web';
import MitelDialer from './MitelDialer';
import { Link } from "react-router-dom";

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      authInitialized: false
    };
  }

  componentDidMount() {
    // React routing and OAuth don't play nice together
    // Take care of the OAuth fun before routing
    AuthService.init().then(() => {
      this.setState({
        authInitialized: true
      });
    });
  }

  render() {

    if (microsoftTeams) {

      if (!this.state.authInitialized) {

        // Wait for Auth Service to initialize
        return (<div className="App"><p>Authorizing...</p></div>);

      } else {

        // Set app routings that don't require microsoft Teams
        // SDK functionality.  Show an error if trying to access the
        // Home page.
        if (window.parent === window.self) {
          return (
            <div className="App">

              <Router>
                <div>
                  <Link to="/dialer">Dialer</Link>
                </div>
                <div>
                  <Link to="/tab">Users</Link>
                </div>
                <Route exact path="/privacy" component={Privacy} />
                <Route exact path="/termsofuse" component={TermsOfUse} />
                <Route exact path="/tab" component={Web} />
                <Route exact path="/web" component={Web} />
                <Route exact path="/teamsauthpopup" component={TeamsAuthPopup} />
                <Route exact path="/dialer" component={MitelDialer} />
              </Router>
            </div>
          );
        }

        // Initialize the Microsoft Teams SDK
        microsoftTeams.initialize(window);

        // Display the app home page hosted in Teams
        return (
          <div className="App">
            <Router>
              <div>
                <Link to="/dialer">Dialer</Link>
              </div>
              <div>
                <Link to="/tab">Users</Link>
              </div>
              <Route exact path="/tab" component={Tab} />
              <Route exact path="/dialer" component={MitelDialer} />
            </Router>
          </div>
        );
      }
    }
  }
}

export default App;
