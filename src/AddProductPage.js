import React, { useState } from "react";
import DropDown from "react-select";
import axios from "axios";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const INITIAL_PRODUCT_STATE = {
  name: "",
  price: "",
  priceUnit: "",
  availableQuantity: [],
  initialQuantity: [],
  description: "",
  subscription: "",
  category: "",
  status: "",
  image: "",
  token: "",
};

const PRICE_UNITS = ["kg", "liters", "gram", "piece", "monthly", "yearly"];

const CATEGORY = [
  {
    name: "Flowers",
    value: "flowers",
  },
  {
    name: "Fruits",
    value: "fruits",
  },
  {
    name: "Vegetables",
    value: "vegetables",
  },
  {
    name: "News Paper",
    value: "newspaper",
  },
  {
    name: "Tifin",
    value: "tifin",
  },
  {
    name: "Dairy",
    value: "dairy",
  },
  {
    name: "Stationary",
    value: "stationary",
  },
  {
    name: "Grocery",
    value: "grocery",
  },
];

const QTY_OPTIONS = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "7", label: "7" },
  { value: "8", label: "8" },
  { value: "9", label: "9" },
  { value: "10", label: "10" },
  { value: "11", label: "11" },
  { value: "12", label: "12" },
  { value: "13", label: "13" },
  { value: "14", label: "14" },
  { value: "15", label: "15" },
  { value: "16", label: "16" },
  { value: "17", label: "17" },
  { value: "18", label: "18" },
  { value: "19", label: "19" },
  { value: "20", label: "20" },
  { value: "21", label: "21" },
  { value: "22", label: "22" },
  { value: "23", label: "23" },
  { value: "24", label: "24" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
];

export default function AddProduct() {
  const [state, setState] = React.useState(INITIAL_PRODUCT_STATE);

  const [loading, setLoading] = useState(false)

  const [availableQty, setAvailableQty] = React.useState([]);
  const [initialQTY, setInitialQTY] = React.useState([]);

  const [image, setImage] = React.useState({});

  function getBase64(file) {
    return new Promise((resolve, rejects) => {
      let image;
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        console.log(reader.result);
        image = reader.result;
        resolve(image);
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    });
  }
  const handleChangeImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleOTYChange = (value) => {
    console.log(value);
    setAvailableQty(value);
  };

  const handleOTYChangeInitial = (value) => {
    setInitialQTY(value);
  };

  const textChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    setState((prev) => ({ ...prev, [name]: value }));
    console.log(state);
  };

  const finalSubmit = async (e) => {
    setLoading(true)
    const a = await getBase64(image);
    const data = { ...state };
    data.availableQuantity = availableQty;
    data.initialQuantity = initialQTY;
    data.token = localStorage.getItem("token");
    data.image = a.toString();
    console.log(data);

    try {
      const response = await axios({
        method: "post",
        data: data,
        url: "/admin/products",
      });
      await axios.get(
        "/category/update"
      );
      if (response.data) {
        setLoading(false)
        alert("Saved Sucess");
      }
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
      alert("Error WHile Saving", error.toString());
    }
  };
  document.title = "Add Product";

  const updateChanges = async () =>{
    const res = await axios.get('/category/update')
    if(res) alert("Changes Applied to App")
  }
  return (
    <>
    {
      loading ? (
    <div className="w-100 d-flex justify-content-center">

    <ClipLoader loading={loading} />
    </div>

      ) :(

      <div className="container  d-flex justify-content-center">
        
        <div className=" col-4 w-50">
          <div class="input-group mb-3">
            <input
              type="file"
              class="form-control"
              onChange={handleChangeImageUpload}
              id="inputGroupFile02"
            />
            {/* <label class="input-group-text" for="inputGroupFile02">
              Upload
            </label> */}
          </div>
          <div classNameName="mb-3">
            <label for="exampleInputEmail1" classNameName="form-label">
              Name
            </label>
            <br />
            <input
              onChange={textChange}
              type="text"
              placeholder="Name"
              name="name"
              className="form-control"
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" className="form-text"></div>
          </div>
          <div className="mb-3">
            <label for="exampleInputEmail1" className="form-label">
              Price
            </label>
            <input
              onChange={textChange}
              type="text"
              placeholder="Price"
              name="price"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" className="form-text"></div>
          </div>

          <div className="mb-4">
            <label for="exampleInputEmail1" className="form-label">
              Priceunit
            </label>
            <select
              className="form-select"
              name="priceUnit"
              onChange={textChange}
              aria-label="Default select example"
            >
              <option selected>Select</option>
              {PRICE_UNITS.map((item) => (
                <option value={item}>{item}</option>
              ))}
            </select>
            <div id="emailHelp" className="form-text"></div>
          </div>

          <div className="mb-4">
            <label for="exampleInputEmail1" className="form-label">
              Subscription
            </label>
            <select
              className="form-select"
              name="subscription"
              onChange={textChange}
              aria-label="Default select example"
            >
              {" "}
              <option selected>Select</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
            <div id="emailHelp" className="form-text"></div>
          </div>
          <div className="mb-4">
            <label for="exampleInputEmail1" className="form-label">
              Category
            </label>
            <select
              className="form-select"
              name="category"
              onChange={textChange}
              aria-label="Default select example"
            >
              {" "}
              <option selected>Select</option>
              {CATEGORY.map((item) => (
                <option value={item.value}>{item.name}</option>
              ))}
            </select>
            <div id="emailHelp" className="form-text"></div>
          </div>
          <div className="mb-4">
            <label for="exampleInputEmail1" className="form-label">
              Status
            </label>
            <select
              className="form-select"
              name="status"
              onChange={textChange}
              aria-label="Default select example"
            >
              {" "}
              <option selected>Select</option>
              <option value="Available">Available</option>
              <option value="Out of stock">Out of stock</option>
            </select>
            <div id="emailHelp" className="form-text"></div>
          </div>

          <div className="mb-4">
            <label for="exampleInputEmail1" className="form-label">
              Description
            </label>
            <textarea
              type="text"
              onChange={textChange}
              name="description"
              placeholder="Description"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            ></textarea>
            <div id="emailHelp" className="form-text"></div>
          </div>

          <div className="mb-4">
            <label for="exampleInputEmail1" className="form-label">
              Available quantity
            </label>
            <div className="d-flex w-100">
              <DropDown
                className="w-100"
                value={availableQty}
                options={QTY_OPTIONS}
                onChange={handleOTYChange}
                isMulti={true}
              />
            </div>
            <div id="emailHelp" className="form-text"></div>
          </div>
          <div className="mb-4">
            <label for="exampleInputEmail1" className="form-label">
              Initial quantity
            </label>
            <DropDown
              className="w-100"
              value={initialQTY}
              options={availableQty}
              onChange={handleOTYChangeInitial}
              isMulti={true}
            />
            <div id="emailHelp" className="form-text"></div>
          </div>
          <button onClick={finalSubmit} className="btn btn-success">
            Submit
          </button>
        </div>
      </div>
      )
    }
    <div className="my-5" />
    <div className="my-5" />
    <div className="my-5" />
    <div className="my-5" />
    <div className="my-5" />
    </>
  );
}
