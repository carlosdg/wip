import React, { Component } from "react";

class Toolbar extends Component {

  render() {
    return (
        <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <a className="navbar-item" href="https://github.com/carlosdg/ImageProcessor.git">
                    <img alt="logo" src="https://i.imgur.com/DckFstm.png" height="50"/>
                </a>

                <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                </a>
            </div>

            <div className="navbar-menu">
                <div className="navbar-start">
                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link">
                            File
                        </a>

                        <div className="navbar-dropdown">
                            <a className="navbar-item">
                                <input 
                                    className="file-input" 
                                    type="file" 
                                    accept="image/*" 
                                    name="img"
                                    onChange={this.props.onNewImage} 
                                />
                                Open
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
  }
}

export default Toolbar;
