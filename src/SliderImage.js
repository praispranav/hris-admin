import axios from "axios";
import React, { useState } from "react";
//
export default function SliderImage() {
  const [image, setImages] = React.useState([]);

  const [state, setState] = useState("");

  const saveImage = async () => {
    try {
      await axios.post("/admin/carusel/image", {
        img: state,
        token: localStorage.getItem("token"),
      });
      fetchImages();
    } catch (error) {
      alert(error.response.data);
    }
  };

  const deleteImage = async (id) => {
    try {
      await axios.post("/admin/carusel/image/delete", {
        id: id,
        token: localStorage.getItem("token"),
      });
      fetchImages();
    } catch (error) {
      alert(error.response.data);
    }
  };

  const fetchImages = async () => {
    try {
      const { data } = await axios.post("/admin/carusel/image/get",{ token: localStorage.getItem('token') });
      setImages(data);
    } catch (error) {
      alert(error.response.data);
    }
  };

  React.useEffect(() => {
    fetchImages();
  }, []);
  return (
    <div className="container">
      <div className="row">
        {image.map((item) => (
          <div className="col-3">
            <img src={item.img} style={{ height: "300px" }} />
            <div className="text-center">
                <button onClick={()=> deleteImage(item._id) } className="btn btn-danger btn-sm">
                    Delete
                </button>
            </div>
          </div>
        ))}
      </div>
      <div className="row justify-content-center mt-5">
        <div className="col-12 col-sm-4">
            <label className="label">Image Url</label>
          <input
            type="text"
            value={state} placeholder="Image Url"
            className="form-control mt-2"
            onChange={(e) => setState(e.target.value)}
          />
          <div className="text-center">
            <button
              onClick={() => saveImage()}
              className="btn btn-primary btn-sm mt-3"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
