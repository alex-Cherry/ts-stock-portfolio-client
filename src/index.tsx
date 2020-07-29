import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import './normalize.css';


import './index.scss';
// import routes
import Routes from './routes';
// import custom components
import Header from './components/header';
import { ToastContainer } from './components/toast';
// import CurrentUserChecker
import CurrentUserChecker from './components/currentUserChecker';
import ErrorBoundary from './components/errorBoundary';

// import for redux
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './store';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

const App = () => {
  return (
    <Provider store={store}>
      <CurrentUserChecker>
        <Router>
          <ErrorBoundary>
            <Header />
            <Routes />
            <ToastContainer />
          </ErrorBoundary>
        </Router>
        </CurrentUserChecker>
    </Provider>
  );
}



ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

