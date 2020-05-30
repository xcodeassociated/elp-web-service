import React, {Component} from "react";
import {connect} from 'react-redux';

interface IAboutProps {
  isRedirectHome: boolean
}

class About extends Component<IAboutProps> {

  public render() {
    return (
      <div>
        <p>About Page</p>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state
  };
};

export default connect(mapStateToProps)(About);
