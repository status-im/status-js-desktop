import React from 'react';
import StatusLogo from './status-logo';
import JSLogo from './js-logo';

const StatusJSLogo = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <StatusLogo />
    <div style={{ width: '25%' }}>
      <JSLogo />
    </div>
  </div>
)

export default StatusJSLogo;
