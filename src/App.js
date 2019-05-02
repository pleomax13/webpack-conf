import React from 'react';
import './App.css';
import logo from './logo.svg';
import Home from './components/Home';

class App extends React.Component {
    render() {
        return(
            <div className = 'App'>
                App
                <Home />
                <img src = {logo} />
            </div>
        );
    }
}

export default App;