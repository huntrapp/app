import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Provider } from 'react-redux';
import createStore from './createStore';
import Raven from 'raven-js';
import config from './constants/config';

(async () => {
    Raven.config(config.publicDSN).install();

    window.onunhandledrejection = function (data) {
        Raven.captureException(data.reason);
    };

    try {
        const store = await createStore();
        const renderApp = (App) => {
            ReactDOM.render(
                <Provider store={store}>
                    <App/>
                </Provider>,
                document.getElementById('root'),
            );
        };

        renderApp(App);

        if (module.hot) {
            module.hot.accept('./components/App', () => {
                const NextApp = require('./components/App').default;
                renderApp(NextApp);
            });
        }
    } catch (ex) {
        console.error(ex); // eslint-disable-line no-console
        Raven.captureException(ex);
    }
})();
