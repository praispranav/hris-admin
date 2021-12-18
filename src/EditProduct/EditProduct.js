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

  const [image, setImage] = React.useState({
    image:
      "data:image/jpeg;base64,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",
  });

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
