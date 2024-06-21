"use client";

import { useState } from "react";
import Loader from "./Loader";

const OrderButton = ({ vehicle, baseUrl }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);

    fetch(`${baseUrl}/api/checkout`, {
      method: "POST",
      body: JSON.stringify(vehicle),
    })
      .then((res) => res.json())
      .then((data) => {
        window.location.href = data.url;
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <button
      disabled={isLoading}
      onClick={handleClick}
      className="bg-blue-600 text-center border py-1 px-3 w-full rounded-md text-sm cursor-pointer transition hover:bg-blue-800"
    >
      {isLoading ? <Loader /> : "Sipariş Et"}
    </button>
  );
};

export default OrderButton;
