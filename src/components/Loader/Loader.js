import React from 'react'
import './Loader.scss'

const Loader = props => (
  <div className='Loader lds-css ng-scope'>
    <div className="lds-eclipse">
      <div/>
    </div>
  </div>
);

export default Loader