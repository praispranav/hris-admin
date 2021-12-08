import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";

import TableContainer from "./TableContainer";
import { NormalCell, Quantity, Status,Delete, Discount } from "./TableCells"

export default function Table() {
  const [state, setState] = useState([]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/admin/products");
      console.log(data);
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
        Cell: (cellProps)=> <NormalCell {...cellProps} />
      },
      {
        Header: "Price Unit",
        accessor: "priceUnit",
        Cell: (cellProps)=> <NormalCell {...cellProps} />
      },
      {
        Header: "Sub...",
        accessor: "subscription",
        Cell: (cellProps)=> <NormalCell {...cellProps} />
      },
      {
        Header: "Discount",
        accessor: "discount",
        Cell: (cellProps)=> <Discount {...cellProps} />
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: (cellProps)=> <NormalCell {...cellProps} />
      },
      {
        Header: "Quantity",
        accessor: "availableQuantity",
        Cell: (cellProps) => <Quantity {...cellProps} />,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: (cellProps) => <Status {...cellProps} />,
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: (cellProps) => {
          return (
            <div
              {...cellProps}
              style={{ width: "200px", textOverflow: "ellipsis" }}
            >
              {cellProps.value}
            </div>
          );
        },
      },
      {
        Header: "Edit",
        accessor: "",
        Cell: (cellProps) => {
          return (
            <div
              {...cellProps}
              style={{ width: "30px", textOverflow: "ellipsis" }}
            >
              <button className="btn btn-success btn-sm">Edit</button>
            </div>
          );
        },
      },
      {
        Header: "Del.",
        accessor: "",
        Cell: (cellProps) => <Delete {...cellProps} fetchProducts={fetchProducts} />
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
