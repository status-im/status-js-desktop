import React from 'react';
import { css } from 'react-emotion';
import { BounceLoader, GridLoader } from 'react-spinners';

const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', margin: '0 30% 0 30%' };
export const FullScreenLoader = () => (
  <div className='sweet-loading' style={containerStyle}>
    <BounceLoader
      sizeUnit={"px"}
      size={150}
      color={'#4A90E2'}
    />
  </div>
)

export const FullScreenGridLoader = () => (
  <div className='sweet-loading' style={containerStyle}>
    <GridLoader
      sizeUnit={"px"}
      size={25}
      color={'#4A90E2'}
    />
  </div>
)

