import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

export default function Nav() {
  const updateChanges = async () => {
    const res = await axios.get("/category/update");
    alert(res.data.msg);
  };

  const logout = () =>{
    localStorage.setItem('token', '')
  } 
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Hris Admin
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/add">
                <a className="nav-link active" aria-current="page" href="#">
                  Add Product
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/table">
                <a className="nav-link active" href="#">
                  Product List
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/order/normal">
                <a className="nav-link active" href="#">
                  Normal Order
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/order/subscription">
                <a className="nav-link active" href="#">
                  Subscription Order
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/slider-image">
                <a className="nav-link active" href="#">
                  Slider Images
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <a onClick={updateChanges} className="nav-link active" href="#">
                Update Changes
              </a>
            </li>
            {/* <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Dropdown
          </a>
          <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><a className="dropdown-item" href="#">Action</a></li>
            <li><a className="dropdown-item" href="#">Another action</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </li> */}
            {/* <li className="nav-item">
          <a className="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
        </li> */}
          </ul>
          <div className="mx-2">
            <button onClick={logout} className="btn-sm btn btn-warning text-dark">Logout</button>
          </div>
          {/* <form className="d-flex">
        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
        <button className="btn btn-outline-success" type="submit">Search</button>
      </form> */}
        </div>
      </div>
    </nav>
  );
}
