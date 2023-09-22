import React, { Fragment, useEffect, useState } from "react";
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import './main.css';

const PageInfiniteScroll = () => {
  const PAGE_LIMIT = 10;
  const apiPath = "https://650c14f047af3fd22f66ff65.mockapi.io/scrolldown/data";
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const getProductList = () => {
    let pageNo = Math.ceil(products.length / PAGE_LIMIT) + 1;
    const queryParam = "?page=" + pageNo + "&limit=" + PAGE_LIMIT;
    const finalUrl = apiPath + queryParam;

    axios.get(finalUrl)
      .then((res) => {
        const apiRes = res?.data;
        const mergeData = [...products, ...apiRes];
        console.log("api response", apiRes);
        setProducts(mergeData);
        setError(null);
      })
      .catch((err) => {
        console.error("error while loading products", err);
        setError("An error occurred while fetching data. Please try again later.");
      });
  };

  useEffect(() => {
    getProductList();
  }, []);

  const fetchMoreData = () => {
    getProductList();
  };

  const openPopup = (product) => {
    const popupWindow = window.open("", "_blank", "width=600,height=400");
    if (popupWindow) {
      popupWindow.document.open();
      popupWindow.document.write(`
        <html>
          <head>
            <title>Product Details</title>
          </head>
          <body>
            <h2>Product Details</h2>
            <p>Name: ${product.name}</p>
            <p>Description: ${product.descripion}</p>
            <button onclick="window.close()">Close</button>
          </body>
        </html>
      `);
      popupWindow.document.close();
    }
  };

  return (
    <Fragment>
      <div className="container">
        <h1 class="heading">Infinite scroll</h1>
        <div className="row">
          {error ? (
            <div className="error-message">
              {error}
            </div>
          ) : (
            <InfiniteScroll
              dataLength={products.length}
              next={fetchMoreData}
              hasMore={true}
              loader={<h4>Loading...</h4>}
            >
              <div className="grid-container">
                {products && products.length > 0 && products.map((key) => {
                  return (
                    <Fragment key={key.id}>
                      <div className="grid-item">
                        <div className="card" >
                          <div className="image-block">
                            <img
                              src={key?.imagee}
                              alt="test image"
                              onClick={() => openPopup(key)}
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                          <div className="content-block">
                            <h5> {key.name}</h5>
                            <h5>{key.description}</h5>
                          </div>
                        </div>
                      </div>
                      
                    </Fragment>
                  );
                })}
              </div>
            </InfiniteScroll>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default PageInfiniteScroll;