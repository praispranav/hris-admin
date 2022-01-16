import React from "react";
import { Switch, Route, Redirect, Link } from "react-router-dom";
import AddProductPage from "./AddProductPage";
import Table from "./Table";
import axios from 'axios';
import Login from "./Auth/Login";
import EditProductPage from './EditProduct/EditProduct';
import Navbar from "./Components/Nav"
import NormalOrder from "./Order/NormalOrder"
import Subscription from "./Order/Subscriptions"

axios.defaults.baseURL = "https://hris-backend-api.azurewebsites.net/"
// axios.defaults.baseURL = "http://localhost:3000/"


function Protected(props) {
  if (localStorage.getItem("token").length) return <Route {...props} />;
  return <Redirect to="/" />;
}

function App(props) {
  return (
    <>
    <Navbar />
    <Switch>
      <Protected exact path="/add/" component={AddProductPage} />
      <Protected exact path="/edit" component={EditProductPage} />
      <Protected exact path="/table/" component={Table} />
      <Protected exact path="/order/normal" component={NormalOrder} />
      <Protected exact path="/order/subscription" component={Subscription} />
      <Route exact path="/" component={Login} />
    </Switch>
    </>
  );
}

export default App;
