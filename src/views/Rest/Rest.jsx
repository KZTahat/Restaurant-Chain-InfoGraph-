import "./rest.css";
import { CreateRestaurant, RestaurantCard, RestaurantView } from "./comps";
import { BreadCrump, DataModel, PageLoader, Title } from "../../components";
import useBreadcrumb from "../../customHooks/useBreadCrump.jsx";
import { useEffect, useState } from "react";
import axios from "axios";

function Rest() {
  const [isLoading, setIsLoading] = useState(false);
  let [showAddRestaurantModal, setShowAddRestaurantModal] = useState(false);
  const [viewedRestaurant, setViewedRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  // Breadcrumb setup
  const { trail, view, updateBreadcrumb, handleBack } = useBreadcrumb(
    ["Restaurants"],
    "Restaurants"
  );

  useEffect(() => {
    const source = axios.CancelToken.source();
    try {
      !restaurants.length ? fetchData() : null;
    } catch (error) {
      console.error("Error fetching projects:", error.message);
    }

    return () => {
      source.cancel("request is canceled");
    };
  }, []);

  const fetchData = () => {
    const server_ = "https://restaurantchain-server.onrender.com";
    setIsLoading(true);
    axios
      .get(`${server_}/getallrestaurants`)
      .then((response) => {
        setRestaurants(response.data);
      })
      .catch((err) => {
        console.log(err.message); /// error handler
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRestaurantChoice = (restaurant) => {
    updateBreadcrumb(`/ ${restaurant.restaurantName}`);
    setViewedRestaurant(restaurant);
  };

  return (
    <>
      <section className="restaurants-page">
        <div className="restaurants-header">
          <BreadCrump trail={trail} back={handleBack} />
          {view === "Restaurants" ? (
            <span className="add-restaurant-button">
              <i
                className="ri-add-circle-fill"
                onClick={() => setShowAddRestaurantModal(true)}
              ></i>
            </span>
          ) : null}
        </div>

        {view == "Restaurants" ? (
          <div className="restaurant-list">
            {isLoading ? (
              <PageLoader top="300px" left='50%' />
            ) : !restaurants.length ? (
              <Title text="You Have No Restaurants Yet" />
            ) : (
              restaurants.map((ele) => (
                <RestaurantCard
                  restaurant={ele}
                  key={ele.id}
                  handler={handleRestaurantChoice}
                />
              ))
            )}
          </div>
        ) : viewedRestaurant ? (
          <RestaurantView restaurant={viewedRestaurant} />
        ) : (
          <></>
        )}

        {showAddRestaurantModal ? (
          <DataModel handler={setShowAddRestaurantModal}>
            <CreateRestaurant
              setShowAddRestaurantModal={setShowAddRestaurantModal}
              fetchData={fetchData}
            />
          </DataModel>
        ) : (
          <></>
        )}
      </section>
    </>
  );
}

export default Rest;
