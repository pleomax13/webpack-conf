import React from 'react';
import './App.css';
import logo from './logo.svg';

class App extends React.Component {
    render() {
        return(
            <div className = 'App'>
                App
                <img src = {logo} />
            </div>
        );
    }
}

export default App;