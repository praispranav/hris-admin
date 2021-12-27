import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "../hooks/useQuery";
import axios from "axios";
import TableContainer from "../TableContainer";
import moment from "moment";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoonLoader from "react-spinners/MoonLoader";

class InitialStatistics {
  constructor() {
    this.TodaysOrder = 0;
    this.YesterdayOrder = 0;
    this.AllOrders = 0;
    this.ConfirmedOrder = 0;
    this.RejectedOrder = 0;
    this.CancelledOrder = 0;
    this.ClosedOrder = 0;
    this.ProcessingOrder = 0;
  }
}

const SubItem = ({ label, value }) => {
  return (
    <div className="d-flex align-items-center">
      <Typography variant="h6">{label}</Typography>
      <Typography variant="body" className="mx-2">
        {value}
      </Typography>
    </div>
  );
};

const StatusList = ["Confirmed", "Delivered", "Rejected", "Active"];

const SingleProduct = ({
  user,
  address,
  product,
  order,
  filterOrder,
  orderStatusColor,
  fetchOrders,
  deliveries,
  cancel,
  extended,
  subscriptionId,
  fetchDeliveries,
}) => {
  console.log("Separe Deliveries", deliveries, cancel, extended);
  const [statusSelected, setStatusSelected] = useState("");
  const [loading, setLoading] = useState(false);

  const [commentValue, setCommentValue] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [quantityValue, setQuantityValue] = useState("");

  const delivery = async (e) => {
    e.preventDefault();
    const obj = {
      subscriptionId: subscriptionId,
      comment: commentValue,
      status: statusValue,
      deliveryDate: new Date(deliveryDate),
      quantity: quantityValue,
      token: localStorage.getItem("token"),
    };
    console.log("Order SUbscription", order);
    console.log(obj, "Delivbery Date");
    try {
      const { data } = await axios.post(
        "/admin/order/subscription/deliveries/save",
        obj
      );
      alert(data.message);
      fetchOrders();
      fetchDeliveries();
    } catch (error) {
      console.log(error);
      alert("Failed TO Save");
    }
    console.log("Delivery Object", obj);
  };

  const save = async () => {
    try {
      if (statusSelected.length < 4) return;
      setLoading(true);
      const { data } = await axios.post("/admin/order/subscription/status", {
        token: localStorage.getItem("token"),
        id: order._id,
        status: statusSelected,
      });
      alert(data.message);
      setLoading(false);
      fetchOrders();
    } catch (error) {
      console.log(error);
      alert(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setStatusSelected(order.status);
  }, [order.status]);

  const Total = () => {
    let num = 0;
    deliveries.forEach((item) => {
      num += item.quantity;
    });
    return num;
  };
  return (
    <div className="container-fluid mt-4">
      <Link to="/order/subscription">
        <Button variant="outlined" color="primary">
          <ArrowBackIcon fontSize="small" className={"me-2"} />
          Back
        </Button>
      </Link>
      <h1 className="display-4">{user.name}</h1>
      <div className="row">
        <div className="col-12 col-sm-4 border-end">
          <h5>User Details</h5>
          <div className="mx-2">
            <SubItem label={"Email"} value={user.email} />
            <SubItem label={"Phone"} value={user.phone} />
            <h6>Address</h6>
            {address.map((item) => (
              <div className="card p-2 mt-2">
                <SubItem label={"Address1"} value={item.address1} />
                {item.address2 && (
                  <SubItem label={"Address2"} value={item.address2} />
                )}
                <div className="d-flex justify-content-between">
                  <div>
                    <SubItem label={"Pin Code"} value={item.pinCode} />
                    <SubItem label={"Phone"} value={item.phone} />
                  </div>
                  <div>
                    <SubItem label={"City"} value={item.city} />
                    <SubItem label={"State"} value={item.state} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <h5 className="mt-4">Product Details</h5>
          <div className="mx-2">
            <SubItem label={"Name"} value={product.name} />
            <SubItem
              label={"Price & Price Unit"}
              value={product.price + "/" + product.priceUnit}
            />
            {/* <SubItem label={"Available Quantity"} value={} /> */}
            <SubItem label={"Description"} value={product.description} />
            <SubItem
              label={"Status"}
              value={
                <span
                  class={`badge ${
                    product.status &&
                    product.status.toLowerCase() === "available"
                      ? "bg-success"
                      : "bg-danger"
                  }`}
                >
                  {product.status}
                </span>
              }
            />
            <SubItem label={"Category"} value={product.category} />
          </div>
        </div>
        <div className="col-12 col-sm-4 border-end">
          <h5>Order Details</h5>
          <div className="mx-2 mt-4">
            <SubItem label={"Product Name"} value={order.name} />
            <SubItem
              label={"Order Date"}
              value={moment(order.createdDate).format("DD-MM-YYYY")}
            />
            <SubItem
              label={"Price & Unit"}
              value={order.price + "/" + order.priceUnit}
            />
            <SubItem label={"Quantity"} value={order.selectedQuantity} />
            <div className="d-flex align-items-center">
              <Typography variant="h6">{"Status"}</Typography>
              <Typography variant="body" className="mx-2">
                <span class={`badge ${orderStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </Typography>
            </div>
            <div className="d-flex align-items-center">
              <Typography variant="h6">{"Days"}</Typography>
              <Typography variant="body" className="mx-2">
                {console.log("Days Selected For Delivery", order.days)}
                {console.log("Order Days", order.days)}
                {order.days &&
                  order.days.map((item) => (
                    <span class={`badge bg-primary mx-2`}>{item}</span>
                  ))}
              </Typography>
            </div>
            <SubItem label={"Payment Mode"} value={order.paymentMode} />
            <SubItem label={"Delivery Time"} value={order.deliveryTimeRange} />
            <SubItem label={"Total Quantity TO Deliver"} value={order.duration * order.selectedQuantity} />

            <SubItem label={"Total Quantity Delivered"} value={Total()} />
            {order.deliveryDate && (
              <SubItem
                label={"Delivery Date"}
                value={moment(order.deliveryDate).format("MM-DD-YYYY")}
              />
            )}
            <h6 className="mt-4">Address</h6>
            <div>
              <SubItem label={"Address1"} value={order.address1} />
              {order.address2 && (
                <SubItem label={"Address2"} value={order.address2} />
              )}
            </div>
            <div className="d-flex justify-content-between">
              <div>
                <SubItem label={"Pin Code"} value={order.pinCode} />
                <SubItem label={"Phone"} value={order.phone} />
              </div>
            </div>
          </div>
          <Typography variant="h5" className="mt-4">
            Edit Order
          </Typography>
          <div className="bg-white">
            <MoonLoader loading={loading} />
          </div>
          <div className="mx-2">
            <div className="d-flex align-items-center">
              <Typography variant="h6">Status</Typography>
              <div className="mx-3">
                <select
                  value={statusSelected}
                  onChange={(e) => setStatusSelected(e.target.value)}
                >
                  <option value="">None</option>
                  {StatusList.map((i) => (
                    <option value={i}>{i}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <Button variant="contained" className="mt-3" onClick={save}>
                Save
              </Button>
            </div>
          </div>

          <Typography variant="h5" className="mt-4">
            Deliveries
          </Typography>
          <form onSubmit={(e) => delivery(e)}>
            <div className="d-flex mt-3">
              <label>Comment</label>{" "}
              <input
                type={"text"}
                className="mx-3 form-control"
                value={commentValue}
                onChange={(e) => setCommentValue(e.target.value)}
              />
            </div>
            <div className="d-flex mt-3">
              <label>Status</label>
              <select
                className="mx-3 form-control"
                value={statusValue}
                onChange={(e) => setStatusValue(e.target.value)}
              >
                <option>None</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
            <div className="d-flex mt-3">
              <label>Delivery Date</label>{" "}
              <input
                type={"date"}
                value={deliveryDate}
                className="mx-3 form-control"
                onChange={(e) => setDeliveryDate(e.target.value)}
              />
            </div>
            <div className="d-flex mt-3">
              <label>Quantity</label>{" "}
              <input
                type={"text"}
                value={quantityValue}
                className="mx-3 form-control"
                onChange={(e) => setQuantityValue(e.target.value)}
              />
            </div>
            <div className="d-flex justify-content-end mt-3">
              <button className="btn btn-primary btn-sm">
                Save Deliveries
              </button>
            </div>
          </form>
          <div className="mt-5">
            <Typography variant="h5">Deliveries List</Typography>
            <div className="d-flex flex-column">
              {console.log("Deliveries", deliveries)}
              {deliveries.map((item, index) => (
                <div className="d-flex justify-content-between">
                  <p className="m-0 p-0 mt-2">{index + 1}</p>
                  <p className="m-0 p-0 mt-2">{item.comment}</p>
                  <p className="m-0 p-0 mt-2">
                    {moment(item.deliveryDate).format("MM-DD-YYYY")}
                  </p>
                  <p className="m-0 p-0 mt-2">{item.status}</p>
                  <p className="m-0 p-0 mt-2">{item.quantity}</p>
                </div>
              ))}

              <div className="d-flex justify-content-between">
                <b>Total</b>
                <b>{Total()}</b>
              </div>
            </div>
          </div>
          <div className="my-5" />
        </div>
        <div className="col-12 col-sm-4">
          <h5>Cancel Requests</h5>
          {cancel.map((item, index) => (
            <div className="d-flex flex-row m-1 justify-content-between">
              <p className="p-0 m-0">{index + 1}.</p>
              <p className="p-0 m-0">
                {moment(item.date).format("DD-MM-YYYY")}
              </p>
              <p className="p-0 m-0">{item.comment}</p>
              <p className="p-0 m-0">{item.approved}</p>
            </div>
          ))}
          <h5>Extended Deliveries Requests</h5>

          {extended.map((item, index) => (
            <div className="d-flex flex-row m-1 justify-content-between">
              <p className="p-0 m-0">{index + 1}.</p>
              <p className="p-0 m-0">
                {moment(item.date).format("DD-MM-YYYY")}
              </p>
              <p className="p-0 m-0">{item.quantity}</p>
              <p className="p-0 m-0">{item.approved}</p>
            </div>
          ))}

          <h5>User Other Orders</h5>
          {filterOrder.map((item) => (
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id={item._id.toString()}
              >
                <Typography>
                  {item.name} -{" "}
                  <span class={`badge ${orderStatusColor(item.status)}`}>
                    {item.status}
                  </span>{" "}
                  - {moment(order.createdDate).format("DD/MM/YYYY")}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="mx-2">
                  <SubItem label={"Product Name"} value={item.name} />
                  <SubItem
                    label={"Order Date"}
                    value={moment(order.createdDate).format("DD-MM-YYYY")}
                  />
                  <SubItem
                    label={"Price & Unit"}
                    value={item.price + "/" + item.priceUnit}
                  />
                  <SubItem label={"Quantity"} value={item.selectedQuantity} />
                  <div className="d-flex align-items-center">
                    <Typography variant="h6">{"Status"}</Typography>
                    <Typography variant="body" className="mx-2">
                      {item.status}
                    </Typography>
                  </div>
                  {/* <SubItem label={"Status"} value={} /> */}
                  <SubItem label={"Payment Mode"} value={item.paymentMode} />
                  <h6 className="mt-2">Address</h6>
                  <div>
                    <SubItem label={"Address1"} value={item.address1} />
                    {order.address2 && (
                      <SubItem label={"Address2"} value={item.address2} />
                    )}
                  </div>
                  <div className="d-flex justify-content-between">
                    <div>
                      <SubItem label={"Pin Code"} value={item.pinCode} />
                      <SubItem label={"Phone"} value={item.phone} />
                    </div>
                  </div>
                  <Link
                    to={`/order/subscription?mode=single&address=${item.addressId}&user=${item.userId}&order=${item._id}&product=${item.productId}`}
                  >
                    <button className="btn btn-success btn-sm">Change</button>
                  </Link>
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Subscription() {
  const query = useQuery();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [originalOrder, setOriginalOrder] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allAddress, setAllAddresses] = useState([]);
  const [products, setProducts] = useState([]);

  const [allDeliveries, setAllDeliveries] = useState([]);
  const [cancelDeliveries, setCancelDeliveriess] = useState([]);
  const [extendedDeliveries, setExtendedDeliveries] = useState([]);

  const [todayOrder, setTodayOrder] = useState([]);

  const [confirmedOrder, setConfirmedOrder] = useState([]);
  const [activeOrders, setActiveOrder] = useState([]);
  const [processingOrders, setProcessingOrder] = useState([]);
  const [statistics, setStatistics] = useState(new InitialStatistics());

  const filterTodayOrder = (data, date = new Date()) => {
    const order = data.filter((item) => {
      const filter =
        moment(item.createdDate).format("DD-MM-YYYY") ==
        moment(new Date(11 - 12 - 2021)).format("DD-MM-YYYY");

      console.log(
        "Dates",
        moment(item.createdDate).format("DD-MM-YYYY"),
        moment(date).format("DD-MM-YYYY")
      );
      console.log("Filter", filter);
      return filter;
    });
    console.log("Order", order);
    return order;
  };
  const filterConfirmedOrder = (data) => {
    const order = data.filter((item) => {
      const filter = item.status && item.status.toLowerCase() === "confirmed";
      return filter;
    });
    console.log("Order", order);
    return order;
  };
  const filterActiveOrder = (data) => {
    const order = data.filter((item) => {
      const filter = item.status && item.status.toLowerCase() === "active";
      return filter;
    });
    console.log("Order", order);
    return order;
  };
  const filterProcessingOrder = (data) => {
    const order = data.filter((item) => {
      const filter = item.status && item.status.toLowerCase() === "processing";
      return filter;
    });
    console.log("Order", order);
    return order;
  };
  const calculateStatistics = (data) => {
    const stat = new InitialStatistics();
    stat.TodaysOrder = filterTodayOrder(data).length;
    const yeasterday = moment(new Date()).subtract("d", "1");
    stat.YesterdayOrder = filterTodayOrder(data, yeasterday).length;
    stat.AllOrders = data.length;
    stat.ConfirmedOrder = filterConfirmedOrder(data).length;
    stat.RejectedOrder = data.filter(
      (item) => item.status && item.status.toLowerCase() === "rejected"
    ).length;
    stat.CancelledOrder = data.filter(
      (item) => item.status && item.status.toLowerCase() === "cancelled"
    ).length;
    stat.ClosedOrder = data.filter(
      (item) =>
        (item.status && item.status.toLowerCase() === "closed") ||
        (item.status && item.status.toLowerCase() === "delivered")
    ).length;
    stat.ProcessingOrder = data.filter(
      (item) => item.status && item.status.toLowerCase() === "processing"
    ).length;
    return stat;
  };
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/admin/order/subscription", {
        token: token,
      });
      setOriginalOrder(
        data.sort((a, b) => b.createdDate.localeCompare(a.createdDate))
      );
      setTodayOrder(filterTodayOrder(data));
      setConfirmedOrder(
        filterConfirmedOrder(data).sort((a, b) =>
          b.createdDate.localeCompare(a.createdDate)
        )
      );
      setActiveOrder(
        filterActiveOrder(data).sort((a, b) =>
          b.createdDate.localeCompare(a.createdDate)
        )
      );
      setProcessingOrder(
        filterProcessingOrder(data).sort((a, b) =>
          b.createdDate.localeCompare(a.createdDate)
        )
      );
      setStatistics(calculateStatistics(data));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // console.log(error);
      alert(error);
    }
  };
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/admin/user", {
        token: token,
      });

      setAllUsers(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert(error);
    }
  };
  const findUser = (userId) => {
    const user = allUsers.find((item) => {
      return (item._id = userId);
    });
    return user || {};
  };

  const DataTableColumns = useMemo(
    () => [
      {
        Header: "Product Name",
        accessor: "name",
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: (cellprops) => (
          <Typography variant="body">
            ₹{cellprops.row.original.price}
          </Typography>
        ),
      },
      {
        Header: "Price Unit",
        accessor: "priceUnit",
      },
      {
        Header: "Ordered Quantity",
        accessor: "selectedQuantity",
      },
      {
        Header: "Pin Code",
        accessor: "pinCode",
      },
      {
        Header: "Payment Mode",
        accessor: "paymentMode",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: (cellProps) => (
          <span
            className={`badge ${orderStatusColor(
              cellProps.row.original.status
            )}`}
          >
            {cellProps.row.original.status}
          </span>
        ),
      },
      {
        Header: "Ordered Date",
        accessor: "createdDate",
        Cell: (cellProps) => (
          <p>
            {moment(cellProps.row.original.createdDate).format("DD-MM-YYYY")}
          </p>
        ),
      },
      {
        Header: "Edit",
        accessor: "no",
        Cell: (cellProps) => {
          return (
            <Link
              to={`/order/subscription?mode=single&address=${cellProps.row.original.addressId}&user=${cellProps.row.original.userId}&order=${cellProps.row.original._id}&product=${cellProps.row.original.productId}`}
            >
              <button className="btn btn-success btn-sm">
                Edit {"&"} View
              </button>
            </Link>
          );
        },
      },
    ],
    [originalOrder]
  );

  const fetchAddress = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/admin/address", {
        token: token,
      });

      setAllAddresses(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert(error);
    }
  };
  const fetchCancelRequest = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/admin/order/subscription/cancel-request",
        {
          token: token,
        }
      );

      setCancelDeliveriess(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert(error);
    }
  };
  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/admin/order/subscription/deliveries",
        {
          token: token,
        }
      );

      setAllDeliveries(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert(error);
    }
  };
  const fetchExtendedDeliveries = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/admin/order/subscription/extended-delivery-request",
        {
          token: token,
        }
      );

      setExtendedDeliveries(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert(error);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/admin/products");
      console.log("Products", data);
      setProducts(data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert(error);
    }
  };

  const findOrder = (orderId) => {
    if (loading) return {};
    const result = originalOrder.find((item) => item._id === orderId);
    return result || {};
  };
  const filterOrders = (userId) => {
    if (loading) return [];
    const result = originalOrder.filter((item) => item.userId === userId);
    return result || [];
  };
  const findProduct = (id) => {
    if (loading) return {};
    const result = products.find((item) => item._id === id);
    return result || {};
  };
  const filterAddress = (id) => {
    if (loading) return [];
    const result = allAddress.filter((item) => item.userId === id);
    return result || [];
  };

  const filterDeliveries = (id) => {
    const result = allDeliveries
      ? allDeliveries.filter((item) => item.subscriptionId == id)
      : [];
    return result;
  };

  const filterCancellled = (id) => {
    const result = cancelDeliveries
      ? cancelDeliveries.filter((item) => item.subscriptionId == id)
      : [];
    return result;
  };

  const filterExtended = (id) => {
    const result = extendedDeliveries
      ? extendedDeliveries.filter((item) => item.subscriptionId == id)
      : [];
    return result;
  };

  const orderStatusColor = (orderStatus) => {
    orderStatus = orderStatus && orderStatus.toLowerCase();
    if (orderStatus === "confirmed") return "rounded-pill bg-success";
    if (orderStatus === "active") return "rounded-pill bg-success";
    if (orderStatus === "processing") return "rounded-pill bg-primary";
    if (orderStatus === "cancelled") return "bg-warning rounded-pill text-dark";
    if (orderStatus === "rejected") return "bg-danger rounded-pill";
    if (orderStatus === "closed" || orderStatus === "delivered")
      return "bg-secondary rounded-pill";
  };

  useEffect(() => {
    fetchOrders();
    fetchUsers();
    fetchProduct();
    fetchAddress();
    fetchCancelRequest();
    fetchDeliveries();
    fetchExtendedDeliveries();
  }, []);

  useEffect(() => {
    console.log("Query", query);
  }, [query]);
  return (
    <div className="d-flex flex-column">
      {query.getAll("mode")[0] === "single" ? (
        <SingleProduct
          fetchOrders={fetchOrders}
          orderStatusColor={orderStatusColor}
          user={findUser(query.getAll("user")[0])}
          address={filterAddress(query.getAll("user")[0])}
          product={findProduct(query.getAll("product")[0])}
          order={findOrder(query.getAll("order")[0])}
          filterOrder={filterOrders(query.getAll("user")[0])}
          deliveries={filterDeliveries(query.get("order"))}
          cancel={filterCancellled(query.get("order"))}
          extended={filterExtended(query.get("order"))}
          subscriptionId={query.get("order")}
          fetchDeliveries={fetchDeliveries}
        />
      ) : (
        <>
          <div className="row px-2">
            <div className="col-12 col-sm-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Today New Orders</h5>
                </div>
                <div
                  className="card-body"
                  style={{ height: "35vh", overflowY: "auto" }}
                >
                  {todayOrder.map((item) => (
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id={item._id.toString()}
                      >
                        <Typography>{findUser(item.userId).name}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>
                          <div className="d-flex">
                            <b>Product Name:</b>
                            <p className="p-0 m-0 mb-2">{item.name}</p>
                          </div>
                          <div className="d-flex">
                            <b>Ordered:</b>
                            <p className="p-0 m-0 mb-2">{item.createdDate}</p>
                          </div>
                          <div className="d-flex">
                            <b>Quantity:</b>
                            <p className="p-0 m-0 mb-2">
                              {item.selectedQuantity + " " + item.priceUnit}
                            </p>
                          </div>
                          <div className="d-flex">
                            <b>Price:</b>
                            <p className="p-0 m-0 mb-2">
                              {item.price + "/" + item.priceUnit}
                            </p>
                          </div>
                          <h3>Address</h3>
                          <div className="d-flex">
                            <b>Address1:</b>
                            <p className="p-0 m-0 mb-2">{item.address1}</p>
                          </div>
                          {item.address2 && (
                            <div className="d-flex">
                              <b>Address2:</b>
                              <p className="p-0 m-0 mb-2">{item.address2}</p>
                            </div>
                          )}
                          <div className="d-flex">
                            <b>Pin Code:</b>
                            <p className="p-0 m-0 mb-2">{item.pinCode}</p>
                          </div>
                          <div className="d-flex">
                            <b>Phone:</b>
                            <p className="p-0 m-0 mb-2">{item.phone}</p>
                          </div>
                          <div className="d-flex">
                            <b>Product Name:</b>
                            <p className="p-0 m-0 mb-2">{item.name}</p>
                          </div>
                          <Link
                            to={`/order/subscription?mode=single&address=${item.addressId}&user=${item.userId}&order=${item._id}&product=${item.productId}`}
                          >
                            <button className="btn btn-success btn-sm">
                              Change
                            </button>
                          </Link>
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Processing Order</h5>
                </div>
                <div
                  className="card-body"
                  style={{ height: "35vh", overflowY: "auto" }}
                >
                  {processingOrders.map((item) => (
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id={item._id.toString()}
                      >
                        <Typography>{findUser(item.userId).name}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>
                          <div className="d-flex">
                            <b>Product Name:</b>
                            <p className="p-0 m-0 mb-2">{item.name}</p>
                          </div>
                          <div className="d-flex">
                            <b>Ordered:</b>
                            <p className="p-0 m-0 mb-2">{item.createdDate}</p>
                          </div>
                          <div className="d-flex">
                            <b>Quantity:</b>
                            <p className="p-0 m-0 mb-2">
                              {item.selectedQuantity + " " + item.priceUnit}
                            </p>
                          </div>
                          <div className="d-flex">
                            <b>Price:</b>
                            <p className="p-0 m-0 mb-2">
                              {item.price + "/" + item.priceUnit}
                            </p>
                          </div>
                          <h3>Address</h3>
                          <div className="d-flex">
                            <b>Address1:</b>
                            <p className="p-0 m-0 mb-2">{item.address1}</p>
                          </div>
                          {item.address2 && (
                            <div className="d-flex">
                              <b>Address2:</b>
                              <p className="p-0 m-0 mb-2">{item.address2}</p>
                            </div>
                          )}
                          <div className="d-flex">
                            <b>Pin Code:</b>
                            <p className="p-0 m-0 mb-2">{item.pinCode}</p>
                          </div>
                          <div className="d-flex">
                            <b>Phone:</b>
                            <p className="p-0 m-0 mb-2">{item.phone}</p>
                          </div>
                          <div className="d-flex">
                            <b>Product Name:</b>
                            <p className="p-0 m-0 mb-2">{item.name}</p>
                          </div>
                          <Link
                            to={`/order/subscription?mode=single&address=${item.addressId}&user=${item.userId}&order=${item._id}&product=${item.productId}`}
                          >
                            <button className="btn btn-success btn-sm">
                              Change
                            </button>
                          </Link>
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Active Order</h5>
                </div>
                <div
                  className="card-body"
                  style={{ height: "35vh", overflowY: "auto" }}
                >
                  {activeOrders.map((item) => (
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id={item._id.toString()}
                      >
                        <Typography>{findUser(item.userId).name}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>
                          <div className="d-flex">
                            <b>Product Name:</b>
                            <p className="p-0 m-0 mb-2">{item.name}</p>
                          </div>
                          <div className="d-flex">
                            <b>Ordered:</b>
                            <p className="p-0 m-0 mb-2">{item.createdDate}</p>
                          </div>
                          <div className="d-flex">
                            <b>Quantity:</b>
                            <p className="p-0 m-0 mb-2">
                              {item.selectedQuantity + " " + item.priceUnit}
                            </p>
                          </div>
                          <div className="d-flex">
                            <b>Price:</b>
                            <p className="p-0 m-0 mb-2">
                              {item.price + "/" + item.priceUnit}
                            </p>
                          </div>
                          <h3>Address</h3>
                          <div className="d-flex">
                            <b>Address1:</b>
                            <p className="p-0 m-0 mb-2">{item.address1}</p>
                          </div>
                          {item.address2 && (
                            <div className="d-flex">
                              <b>Address2:</b>
                              <p className="p-0 m-0 mb-2">{item.address2}</p>
                            </div>
                          )}
                          <div className="d-flex">
                            <b>Pin Code:</b>
                            <p className="p-0 m-0 mb-2">{item.pinCode}</p>
                          </div>
                          <div className="d-flex">
                            <b>Phone:</b>
                            <p className="p-0 m-0 mb-2">{item.phone}</p>
                          </div>
                          <div className="d-flex">
                            <b>Product Name:</b>
                            <p className="p-0 m-0 mb-2">{item.name}</p>
                          </div>
                          <Link
                            to={`/order/subscription?mode=single&address=${item.addressId}&user=${item.userId}&order=${item._id}&product=${item.productId}`}
                          >
                            <button className="btn btn-success btn-sm">
                              Change
                            </button>
                          </Link>
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Confirmed Order</h5>
                </div>
                <div
                  className="card-body"
                  style={{ height: "35vh", overflowY: "auto" }}
                >
                  {confirmedOrder.map((item) => (
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id={item._id.toString()}
                      >
                        <Typography>{findUser(item.userId).name}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>
                          <div className="d-flex">
                            <b>Product Name:</b>
                            <p className="p-0 m-0 mb-2">{item.name}</p>
                          </div>
                          <div className="d-flex">
                            <b>Ordered:</b>
                            <p className="p-0 m-0 mb-2">{item.createdDate}</p>
                          </div>
                          <div className="d-flex">
                            <b>Quantity:</b>
                            <p className="p-0 m-0 mb-2">
                              {item.selectedQuantity + " " + item.priceUnit}
                            </p>
                          </div>
                          <div className="d-flex">
                            <b>Price:</b>
                            <p className="p-0 m-0 mb-2">
                              {item.price + "/" + item.priceUnit}
                            </p>
                          </div>
                          <h3>Address</h3>
                          <div className="d-flex">
                            <b>Address1:</b>
                            <p className="p-0 m-0 mb-2">{item.address1}</p>
                          </div>
                          {item.address2 && (
                            <div className="d-flex">
                              <b>Address2:</b>
                              <p className="p-0 m-0 mb-2">{item.address2}</p>
                            </div>
                          )}
                          <div className="d-flex">
                            <b>Pin Code:</b>
                            <p className="p-0 m-0 mb-2">{item.pinCode}</p>
                          </div>
                          <div className="d-flex">
                            <b>Phone:</b>
                            <p className="p-0 m-0 mb-2">{item.phone}</p>
                          </div>
                          <div className="d-flex">
                            <b>Product Name:</b>
                            <p className="p-0 m-0 mb-2">{item.name}</p>
                          </div>
                          <Link
                            to={`/order/subscription?mode=single&address=${item.addressId}&user=${item.userId}&order=${item._id}&product=${item.productId}`}
                          >
                            <button className="btn btn-success btn-sm">
                              Change
                            </button>
                          </Link>
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Statistics</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    {Object.entries(statistics).map((item) => (
                      <div className="card col-4 d-flex justify-content-center align-items-center">
                        <b>{item[0]}</b>
                        <p>{item[1]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <TableContainer data={originalOrder} columns={DataTableColumns} />
        </>
      )}
    </div>
  );
}
