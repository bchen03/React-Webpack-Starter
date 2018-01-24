import React from "react";
import ReactDOM from "react-dom";

import './css/styles.scss';

class App extends React.Component {
    render() {
        return (
            <div>React Webpack Starter Application</div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
  );

