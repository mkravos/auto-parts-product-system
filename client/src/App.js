import React from 'react'
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom';

import { Products, Admin, Shipping, Receiving } from './components';

/*
* Generates the App Component that is the first component to be rendered by index.js.
*
* @return JSX that performs the generation of the App Component.
*/
const App = () => {
  return (
    <Router>      
      <Switch>
        <Route path="/" exact component={Products} />
        <Route path="/admin" exact component={Admin} />
        <Route path="/shipping" exact component={Shipping} />
        <Route path="/receiving" exact component={Receiving} />
      </Switch>
    </Router>
  )
}

export default App
