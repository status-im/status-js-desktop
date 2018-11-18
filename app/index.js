import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';

const store = configureStore();

render(
  <StrictMode>
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>
  </StrictMode>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    // eslint-disable-next-line global-require
    const NextRoot = require('./containers/Root').default;
    render(
      <StrictMode>
        <AppContainer>
          <NextRoot store={store} history={history} />
        </AppContainer>
      </StrictMode>,
      document.getElementById('root')
    );
  });
}
