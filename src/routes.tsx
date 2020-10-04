import React from 'react';
import { Switch, Route } from 'react-router-dom';

import HomePage from './pages/homePage';
import CompaniesPage from './pages/companiesPage';
import BrokersPage from './pages/brokersPage';
import StocksPage from './pages/stocksPage';
import AuthPage from './pages/authPage';
import EditStockPage from './pages/editStockPage';
import NotFoundPage from './pages/notFoundPage';

export default () => {
  return (
    <Switch>
      <Route path="/" exact component={HomePage} />
      <Route path="/companies" component={CompaniesPage} />
      <Route path="/brokers" component={BrokersPage} />
      <Route path="/stocks" component={StocksPage} />
      <Route path="/signin" component={AuthPage} />
      <Route path="/editStock/:id?" component={EditStockPage} />
      <Route path="/notfound" component={ NotFoundPage } />
      <Route component={ NotFoundPage } />
    </Switch>
  )
}
