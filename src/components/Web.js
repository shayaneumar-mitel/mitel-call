import React from 'react';
import AuthService from '../services/AuthService'
import { List, Icon } from "@fluentui/react";
import * as MicrosoftGraphClient from "@microsoft/microsoft-graph-client";

/**
 * The web UI used when Teams pops out a browser window
 */
class Web extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: null,
      messages: [],
      name: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    if (!AuthService.isLoggedIn()) {
      // Will redirect the browser and not return; will redirect back if successful
      AuthService.login(["User.Read", "User.ReadBasic.All"]);
    } else {
      this.msGraphClient = MicrosoftGraphClient.Client.init({
        authProvider: async (done) => {
          if (!this.state.accessToken) {
            // Might redirect the browser and not return; will redirect back if successful
            const token = await AuthService.getAccessToken(["User.Read", "User.ReadBasic.All"]);
            this.setState({
              accessToken: token
            });
          }
          done(null, this.state.accessToken);
        }
      });
    }
  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  render() {

    return (
      <div>

        <p>Username: {AuthService.getUsername()}</p>
        <label>
          Name:
          <input type="text" value={this.state.name} onChange={this.handleChange} />
        </label>
        <button onClick={this.getMessages.bind(this)}>Get Users</button>
        <ul>
          {this.state.messages.map(message => (
            <li key={message.id}> {message.displayName}: {message.businessPhones[0]}</li>
          ))}
        </ul>
      </div>
    );
  }

  getMessages() {

    this.msGraphClient
      .api("users")
      .filter(`startswith(displayName,'${this.state.name}')`)
      // .select(["displayName", "mail", "businessPhones"])
      .top(5)
      .get(async (error, rawMessages, rawResponse) => {
        if (!error) {
          this.setState(Object.assign({}, this.state, {
            messages: rawMessages.value
          }));
        } else {
          this.setState({
            error: error
          });
        }
      });
  }
}

export default Web;