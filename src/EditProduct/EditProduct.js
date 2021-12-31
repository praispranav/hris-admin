import React, { useEffect, useState } from "react";
import DropDown from "react-select";
import axios from "axios";
import { Link } from "react-router-dom";
import { useQuery } from "../hooks/useQuery";
import MoonLoader from "react-spinners/MoonLoader";

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

const PRICE_UNITS = ["kg", "liters", "gram", "piece"];

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
];

export default function AddProduct() {
  const query = useQuery();

  const [state, setState] = React.useState(INITIAL_PRODUCT_STATE);

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
      await axios.get("/category/update");
      if (response.data) {
        alert("Saved Sucess");
      }
    } catch (error) {
      console.log(error);
      alert("Error WHile Saving", error.toString());
    }
  };
  document.title = "Edit Product";

  const [originalData, setOriginalData] = useState(INITIAL_PRODUCT_STATE);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(
        `/category/product/${query.getAll("id")[0]}`
      );
      setOriginalData(response.data[0]);
      setState(response.data[0]);
      setAvailableQty(response.data[0].availableQuantity);
      setInitialQTY(response.data[0].initialQuantity);
      console.log(response.data[0]);
    } catch (error) {
      alert(error);
    }
  };
  const fetchImage = async () => {
    try {
      const response = await axios.get(
        `/category/image/id/${query.getAll("id")[0]}`
      );
      setImage(response.data[0]);
      let base64 = response.data[0].image
      console.log(base64)
      // let buffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      // let blob = new Blob([buffer], { type: "image/jpeg" });
      // let url = URL.createObjectURL(blob);
      const parent = document.getElementById('img1')
      let img = document.createElement("img");
      img.src = base64;
      img.width = '200';
      parent.appendChild(img);
      console.log(response.data);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
    fetchImage();
  }, [query.getAll("id")[0]]);
  console.log(query.getAll("id"));
  return (
    <>
      <div className="container  d-flex justify-content-center">
        <div
          style={{ top: "20%", left: "30px" }}
          className="position-fixed card p-4"
        >
          <div className="d-flex">
            <b>Name:</b>
            <p className="mb-2">{originalData.name}</p>
          </div>
          <div className="d-flex">
            <b>Price:</b>
            <p className="mb-2">{originalData.price}</p>
          </div>
          <div className="d-flex">
            <b>PriceUnit:</b>
            <p className="mb-2">{originalData.priceUnit}</p>
          </div>
          <div className="d-flex">
            <b>Description:</b>
            <p className="mb-2" style={{ maxWidth: '100px'}}>{originalData.description}</p>
          </div>
          <div className="d-flex">
            <b>Subscription:</b>
            <p className="mb-2">{originalData.subscription}</p>
          </div>
          <div className="d-flex">
            <b>Category:</b>
            <p className="mb-2">{originalData.category}</p>
          </div>
          <div className="d-flex">
            <b>Status:</b>
            <p className="mb-2">{originalData.status}</p>
          </div>
        </div>
        <div
          style={{ top: "20%", right: "30px" }}
          className="position-fixed card p-4" id="img1"
        >
        </div>
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
              value={state.name}
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
              value={state.price}
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
              value={state.priceUnit}
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
              value={state.subscription}
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
              value={state.category}
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
              value={state.status}
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
              value={state.description}
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
    </>
  );
}
