import React, {Component} from 'react';
import AppContextProvider from "./AppContextProvider";
import '../style/App.css';

class App extends Component {

  public render(): JSX.Element {
    return (
      <div id="app">
        <AppContextProvider />
      </div>
    )
  }

}

export default App
