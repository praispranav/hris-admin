import axios from "axios";
import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Select from "react-select";

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

const STATUS = [
  { label: "Available", value: "Available" },
  { label: "Out of stock", value: "Out of stock" },
];

export const Quantity = (cellProps) => {
  const [state, setState] = useState([]);

  const submit = async (qty) => {
    try {
      const id = cellProps.row.original._id;
      const token = localStorage.getItem("token");
      const url = `/admin/products/qty/${id}`;
      const response = await axios.post(url, {
        availableQuantity: qty,
        token: token,
      });
      if (response.status === 200) {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error);
    }
  };

  const handleChange = (e) => {
    setState(e);
    submit(e);
  };

  useEffect(() => {
    setState(cellProps.value);
  }, [cellProps.value]);
  return (
    <Select
      className="w-100"
      value={state}
      options={QTY_OPTIONS}
      onChange={handleChange}
      isMulti={true}
    />
  );
};

export const Status = (cellProps) => {
  const [state, setState] = useState();

  const submit = async (status) => {
    try {
      const token = localStorage.getItem("token");
      const id = cellProps.row.original._id;
      const url = `/admin/products/status/${id}`;
      const response = await axios.post(url, {
        status: status.value,
        token: token,
      });
      if (response.status === 200) {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error);
    }
  };

  const handleChange = (e) => {
    setState(e);
    submit(e);
  };
  useEffect(() => {
    console.log("Status", cellProps);
    setState({ label: cellProps.value, value: cellProps.value });
  }, [cellProps.value]);
  return (
    <div style={{ width: "150px" }}>
      <Select
        className="w-100"
        value={state}
        options={STATUS}
        onChange={handleChange}
      />
    </div>
  );
};

export const Delete = (cellProps) => {
  const [confirm, setConfirm] = useState();

  const submit = async (qty) => {
    try {
      const id = cellProps.row.original._id;
      const token = localStorage.getItem("token");
      const url = `/admin/products/delete/${id}`;
      const response = await axios.post(url, { token: token });
      if (response.status === 200) {
        alert(response.data.message);
        cellProps.fetchProducts();
      }
    } catch (error) {
      alert(error);
    }
  };
  const handleConfirm = () => {
    submit();
    setConfirm((prevState) => !prevState);
  };
  return (
    <div {...cellProps} style={{ width: "30px", textOverflow: "ellipsis" }}>
      {confirm ? (
        <button onClick={handleConfirm} className="btn btn-danger btn-sm">
          Confirm Delete
        </button>
      ) : (
        <button
          onClick={() => setConfirm((prevState) => !prevState)}
          className="btn btn-danger btn-sm"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export const NormalCell = (cellProps) => {
  return <div style={{ width: "10px" }}>{cellProps.value}</div>;
};

export const Discount = (cellProps) => {
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    setLoading(true);
    try {
      const body = {
        token: localStorage.getItem("token"),
        id: cellProps.row.original._id,
        discount: state,
      };
      const response = await axios.post(`/admin/products/discount/${body.id}`, body);
      setLoading(false)
      alert("Discount Updated" + response.data.message);
    } catch (error) {
      setLoading(false)
      alert("Discount Not Updated");
    }
  };

  useEffect(() => {
    setState(cellProps.value);
  }, [cellProps.value]);
  return (
    <>
      {loading ? (
        <div className="w-100 d-flex justify-content-center">
          <ClipLoader loading={loading} />
        </div>
      ) : (
        <div style={{ width: "50px" }} className="d-flex">
          <input
            type="number"
            value={Number(state)}
            style={{ width: '50px'}}
            onChange={(e) => setState(e.target.value)}
            onBlur={submit}
          />%
        </div>
      )}
    </>
  );
};
