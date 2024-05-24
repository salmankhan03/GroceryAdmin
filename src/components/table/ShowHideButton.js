import React, { useContext } from "react";
import Switch from "react-switch";
import { useLocation } from "react-router-dom";

//internal import
import { SidebarContext } from "context/SidebarContext";
import AttributeServices from "services/AttributeServices";
import CategoryServices from "services/CategoryServices";
import CouponServices from "services/CouponServices";
import CurrencyServices from "services/CurrencyServices";
import LanguageServices from "services/LanguageServices";
import ProductServices from "services/ProductServices";
import { notifyError, notifySuccess } from "utils/toast";
import BrandServices from "services/BrandServices";

const ShowHideButton = ({ id, status, category, currencyStatusName,data }) => {
  // console.log('from staf', id,status)
  const location = useLocation();
  const { setIsUpdate } = useContext(SidebarContext);
  //  console.log('coupns')
  const handleChangeStatus = async (id) => {
    // console.log("CALL",status)
    // return notifyError("CRUD operation is disabled for this option!");
    try {
      let newStatus;
      if (status === "show" || status === 1) {
        newStatus = status === 1 ? 0 : status === "show" ? "hide":'';
      } else {
        newStatus = status === 0 ? 1: status === "hide" ? "show":'';
      }

      // console.log(newStatus)
      // console.log(location.pathname,"path")
      if (location.pathname === "/categories" || category) {
        if(!data?.parent_id){
          data['parent_id'] = null
        }
        data.status = newStatus
        const res = await CategoryServices.updateStatus(id, data);
        setIsUpdate(true);
        // notifySuccess(res.message);
        notifySuccess('Category Status update Successfull');
      }
      if (location.pathname === "/brands" ) {
        data.is_active = newStatus
        const res = await BrandServices.addUpdateBrand(data);
        setIsUpdate(true);
        // notifySuccess(res.message);
        notifySuccess('Brand Status update Successfull');

      }

      if (location.pathname === "/products") {
        data.status = newStatus

        const res = await ProductServices.updateProduct(id, data);
        setIsUpdate(true);
        notifySuccess('Products Status update Successfull');
      }

      if (location.pathname === "/languages") {
        const res = await LanguageServices.updateStatus(id, {
          status: newStatus,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
      }
      if (location.pathname === "/currencies") {
        if (currencyStatusName === "status") {
          const res = await CurrencyServices.updateEnabledStatus(id, {
            status: newStatus,
          });
          setIsUpdate(true);
          notifySuccess(res.message);
        } else {
          const res = await CurrencyServices.updateLiveExchangeRateStatus(id, {
            live_exchange_rates: newStatus,
          });
          setIsUpdate(true);
          notifySuccess(res.message);
        }
      }

      if (location.pathname === "/attributes") {
        console.log("here",data)
        data.status = newStatus
        console.log("Data",data)
        const res = await AttributeServices.updateAttributes(data);
        setIsUpdate(true);
        notifySuccess(res.message);
      }

      if (
        location.pathname === `/attributes/${location.pathname.split("/")[2]}`
      ) {
        const res = await AttributeServices.updateChildStatus(id, {
          status: newStatus,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
      }

      if (location.pathname === "/coupons") {
        // console.log('coupns',id)
        const res = await CouponServices.updateStatus(id, {
          status: newStatus,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
      }

      if (location.pathname === "/our-staff") {
        // console.log('coupns',id)
        const res = await CouponServices.updateStaffStatus(id, {
          status: newStatus,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
      }
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
    }
  };

  return (
    <Switch
      onChange={() => handleChangeStatus(id)}
      checked={status === "show" || status === 1 ? true : false}
      className="react-switch md:ml-0"
      uncheckedIcon={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            width: 120,
            fontSize: 14,
            color: "white",
            paddingRight: 22,
            paddingTop: 1,
          }}
        ></div>
      }
      width={30}
      height={15}
      handleDiameter={13}
      offColor="#E53E3E"
      onColor={"#2F855A"}
      checkedIcon={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 73,
            height: "100%",
            fontSize: 14,
            color: "white",
            paddingLeft: 20,
            paddingTop: 1,
          }}
        ></div>
      }
    />
  );
};

export default ShowHideButton;
