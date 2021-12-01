import React from "react";
import { Switch, Route, Redirect  } from "react-router-dom";
import AddProductPage from "./AddProductPage"

function AccessToken() {
  const [password, setPassword] = React.useState('')
  const onChange= (e) =>{
    const value = e.target.value
    setPassword(value)
  }

  const submit = () =>{
    localStorage.setItem('token', password)
  }
  return(
    <div className="d-flex justify-content-center align-items-center">
      <div className="d-flex flex-column align-items-center">
        <div className="w-100">
          <h1 className="display-6">Access Token</h1>
        </div>
        <div>
          <input type="password" className="form-control-sm" value={password} onChange={onChange} />
        </div>
        <button onClick={submit} className="btn btn-primary">Submit</button>
      </div>

    </div>
  )
}

function Protected(props){
  if(localStorage.getItem('token').length) return <Route {...props} />
  return<Redirect  to="/" />
}

function App(props) {
  return(
    <Switch>
      <Route exact path="/add" component={AddProductPage} />
      <Route exact path="/" component={AccessToken} />
    </Switch>
  )
}

export default App;