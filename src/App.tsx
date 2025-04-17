import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import DefaultLayout from './layouts/DefaultLayout';
import BM01 from './pages/BM01';
import BM02 from './pages/BM02';
import '@coreui/coreui/dist/css/coreui.min.css';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <DefaultLayout>
        <Switch>
          <Route exact path="/bm01" component={BM01} />
          <Route exact path="/bm02" component={BM02} />
          <Route exact path="/" component={BM02} />
        </Switch>
      </DefaultLayout>
    </Router>
  );
};

export default App;
