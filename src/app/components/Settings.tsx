import React, {Component} from "react";
import {connect} from 'react-redux';

interface IAboutProps {
  isRedirectHome: boolean
}

class Settings extends Component<IAboutProps> {

  public render() {
    return (
      <div>
        <p>Settings Page</p>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state
  };
};

export default connect(mapStateToProps)(Settings);
