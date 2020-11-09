import React from 'react';
import * as microsoftTeams from "@microsoft/teams-js";
import TeamsAuthService from '../services/TeamsAuthService';
import { List, Icon } from "@fluentui/react";
import * as MicrosoftGraphClient from "@microsoft/microsoft-graph-client";


class Tab extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            accessToken: null,
            messages: [],
            name: ''
        }

        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        this.msGraphClient = MicrosoftGraphClient.Client.init({
            authProvider: async (done) => {
                if (!this.state.accessToken) {
                    const token = await TeamsAuthService
                        .getAccessToken(["User.Read", "User.ReadBasic.All", "Directory.Read.All"],
                            microsoftTeams);
                    this.setState({
                        accessToken: token
                    });
                }
                done(null, this.state.accessToken);
            }
        });

    }

    handleChange(event) {
        this.setState({ name: event.target.value });
    }

    callhandler(event, number) {
        console.log(number);

        microsoftTeams.getContext((context) => {
            if (context) {
                if (context.hostClientType === "web") {
                    microsoftTeams.authentication.authenticate({
                        url: window.location.origin + "#/lauchdialer?number=" + number,
                        width: 600,
                        height: 535,
                        successCallback: () => {
                        },
                        failureCallback: () => {
                        }
                    });
                } else {
                    window.location = 'tel://' + number;
                }
            }
        });
    }

    render() {

        return (
            <div>
                <p>Username: {TeamsAuthService.getUsername()}</p>
                <label>
                    Name:
                        <input type="text" value={this.state.name} onChange={this.handleChange} />
                </label>
                <button onClick={this.getMessages.bind(this)}>Get Users</button>
                <ul>
                    {this.state.messages.map(message => (
                        <li key={message.id} onClick={event => this.callhandler(event, message.businessPhones[0])}> {message.displayName}: {message.businessPhones[0]}</li>
                    ))}
                </ul>
            </div>
        );
    }

    getMessages() {

        this.msGraphClient
            .api("users")
            .filter(`startswith(displayName,'${this.state.name}')`)
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
export default Tab;