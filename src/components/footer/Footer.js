import React, { Component } from 'react';
import './footer.scss';

 class Footer extends Component {
  render() {
    return (
        <div className="footer">
            <footer className="footer">
                <p>
                    App is built with &nbsp;
                    <a href="https://github.com/facebook/create-react-app">
                        Create React App
                    </a>.
                </p>
            </footer>
        </div>
    )
  }
}

export default Footer;
