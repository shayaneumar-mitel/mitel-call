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
            messages: []
        }
    }

    componentWillMount() {
        this.msGraphClient = MicrosoftGraphClient.Client.init({
            authProvider: async (done) => {
                if (!this.state.accessToken) {
                    const token = await TeamsAuthService
                        .getAccessToken(["User.Read", "User.ReadBasic.All"],
                            microsoftTeams);
                    this.setState({
                        accessToken: token
                    });
                }
                done(null, this.state.accessToken);
            }
        });
    }

    render() {

        return (
            <div>
                <button onClick={this.getMessages.bind(this)}>Get Mail</button>
                <p>Username: {TeamsAuthService.getUsername()}</p>
                <List selectable>
                    {
                        this.state.messages.map(message => (
                            <List.Item media={<Icon name="email"></Icon>}
                                header={message.displayName}
                                content={message.mail}>
                            </List.Item>
                        ))
                    }
                </List>            </div>
        );
    }

    getMessages() {

        this.msGraphClient
            .api("users")
            .select(["displayName", "mail"])
            .top(15)
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