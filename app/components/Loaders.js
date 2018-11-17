import React from 'react';
import { css } from 'react-emotion';
// First way to import
import { RingLoader } from 'react-spinners';

const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', margin: '0 30% 0 30%' };
export const FullScreenLoader = ({ loading }) => (
  <div className='sweet-loading' style={containerStyle}>
    <RingLoader
      sizeUnit={"px"}
      size={150}
      color={'#4A90E2'}
      loading={loading}
    />
  </div>
)
