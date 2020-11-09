import React from 'react';
import * as microsoftTeams from "@microsoft/teams-js";

class LaunchMitelDialer extends React.Component {

  componentDidMount() {
    if (microsoftTeams) {
      microsoftTeams.initialize(window);
      microsoftTeams.getContext((context, error) => {
        if (context) {
          const query = new URLSearchParams(this.props.location.search);
          const number = query.get('number');
          window.location = 'tel://' + number;
        }
      });
    }
  }

  render() {
    return (<p>Launching MiCollab...</p>);
  }
}
export default LaunchMitelDialer;