import React from "react";
import { Switch, Route, Redirect, Link } from "react-router-dom";
import AddProductPage from "./AddProductPage";
import Table from "./Table"
import axios from 'axios'

axios.defaults.baseURL = "https://hris-app-backend.azurewebsites.net"
// axios.defaults.baseURL = "http://localhost:3000/"

function AccessToken() {
  const [password, setPassword] = React.useState("");
  const onChange = (e) => {
    const value = e.target.value;
    setPassword(value);
  };

  const submit = () => {
    localStorage.setItem("token", password);
  };
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="d-flex flex-column align-items-center">
        <div className="w-100">
          <h1 className="display-6">Access Token</h1>
        </div>
        <div>
          <input
            type="password"
            className="form-control-sm"
            value={password}
            onChange={onChange}
          />
        </div>
        <Link to="/add">
          <button onClick={submit} className="btn btn-primary">
            Submit
          </button>
        </Link>
      </div>
    </div>
  );
}

function Protected(props) {
  if (localStorage.getItem("token").length) return <Route {...props} />;
  return <Redirect to="/" />;
}

function App(props) {
  return (
    <Switch>
      <Protected exact path="/add/" component={AddProductPage} />
      <Protected exact path="/table/" component={Table} />
      <Route exact path="/" component={AccessToken} />
    </Switch>
  );
}

export default App;
