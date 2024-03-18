import React, { useContext, useState } from "react";
import { Select } from "@windmill/react-ui";

import OrderServices from "services/OrderServices";
import { notifySuccess, notifyError } from "utils/toast";
import { SidebarContext } from "context/SidebarContext";
import useToggleDrawer from "hooks/useToggleDrawer";
import CustomUpdateModal from "components/modal/UpdateModal";

const SelectStatus = ({ id, order, handleUpdateStatus}) => {
  return (
    <>
      <Select
        onChange={(e) => handleUpdateStatus(id, e.target.value)}
        className="border border-gray-50 bg-gray-50 dark:border-gray-700 h-8 rounded-md text-xs focus:border-gray-400 focus:outline-none"
      >
        <option value="status" defaultValue hidden>
          {order?.status}
        </option>
        <option defaultValue={order?.status === "Pending"} value="Pending">
          Pending
        </option>
        <option defaultValue={order?.status === "Confirmed"} value="Confirmed">
        Confirmed
        </option>
        <option defaultValue={order?.status === "Delivered"} value="Delivered">
          Delivered
        </option>
        <option
          defaultValue={order?.status === "Returned"} value="Returned">
          Returned
        </option>
        <option
          defaultValue={order?.status === "Refunded"} value="Refunded">
          Refund
        </option>
        <option defaultValue={order?.status === "Cancelled"} value="Cancelled">
          Cancel
        </option>
      </Select>

    </>
  );
};

export default SelectStatus;
