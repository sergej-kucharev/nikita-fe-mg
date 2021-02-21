import { BrowserRouter, Switch, Route, Redirect, } from 'react-router-dom';

import { Bank, } from '../containers/Bank';
import { Calc, } from '../containers/Calc';
import { NotFound, } from '../containers/NotFound';

export function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact strict path="/">
            <Redirect to="/bank" />
          </Route>
          <Route exact strict path="/bank">
            <Bank />
          </Route>
          <Route exact strict path="/calc/:bankId(\d+)">
            <Calc />
          </Route>
          <Route >
            <NotFound />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}