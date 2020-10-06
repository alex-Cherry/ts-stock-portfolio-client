import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
// For redux
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
// Routes
import Routes from './routes';
// Custom components
import Header from './components/header';
import { ToastContainer } from './components/toast';
import CurrentUserChecker from './components/_projectComponents/currentUserChecker';
import ErrorBoundary from './components/_projectComponents/errorBoundary';
// Store
import rootReducer from './store';
// CSS
import './normalize.css';
import './index.scss';


const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

// COMPONENT
// 
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

// RENDER
// 
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

