import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";

import TableContainer from "./TableContainer"

export default function Table() {
  const [state, setState] = useState([]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("https://hris-app-backend.azurewebsites.net/admin/products");
      console.log(data)
      setState(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Product Name",
        accessor: "name",
      },
      {
        Header: "Price",
        accessor: "price",
      },
      {
        Header: "Price Unit",
        accessor: "priceUnit",
      },
      {
        Header: "Subscription",
        accessor: "subscription",
      },
      {
        Header: "Category",
        accessor: "category",
      },
      {
        Header: "City",
        accessor: "location.city",
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: (cellProps) => {
          return <div {...cellProps} style={{ width: '200px', textOverflow: "ellipsis" }}>
            {cellProps.value}
          </div>
        }
      },
      {
        Header: "Edit",
        accessor: "",
        Cell: (cellProps) => {
          return <div {...cellProps} style={{ width: '50px', textOverflow: "ellipsis" }}>
               <button className="btn btn-success btn-sm">Edit</button>
          </div>
        }
      },
      {
        Header: "Delete",
        accessor: "",
        Cell: (cellProps) => {
          return <div {...cellProps} style={{ width: '50px', textOverflow: "ellipsis" }}>
            <button className="btn btn-danger btn-sm">Delete</button>
          </div>
        }
      },
    ],
    []
  );

  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <div className="container-fluid mt-3">
      <TableContainer columns={columns} data={state} />
    </div>
  );
}
