import React, { Component } from 'react';
import { Link } from 'react-router';

export default class NotFoundView extends Component {
  render () {
    return (
      <div className='container'>
        <h1 style={{ margin: "20px 0" }}>404!</h1>
        <Link to='/'><span style={{ color: "#32cf65" }}>Back To Home</span></Link>
      </div>
    );
  }
}
