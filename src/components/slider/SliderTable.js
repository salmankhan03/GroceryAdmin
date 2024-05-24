import {
  Avatar,
  Badge,
  TableBody,
  TableCell,
  TableRow,
  Image,
} from "@windmill/react-ui";
import * as dayjs from "dayjs";

//internal import

import { useEffect } from "react";
import { useState } from "react";
import useToggleDrawer from "hooks/useToggleDrawer";
import useAsync from "hooks/useAsync";
import SettingServices from "services/SettingServices";
import DeleteModal from "components/modal/DeleteModal";
import MainDrawer from "components/drawer/MainDrawer";
import CouponDrawer from "components/drawer/CouponDrawer";
import CheckBox from "components/form/CheckBox";
import ShowHideButton from "components/table/ShowHideButton";
import EditDeleteButton from "components/table/EditDeleteButton";
import { showingTranslateValue } from "utils/translate";
import { showDateFormat } from "utils/dateFormate";
import moment from 'moment';
import SliderDrawer from "components/drawer/SliderDrawer";

const SliderTable = ({ lang, isCheck, sliders, setIsCheck }) => {
  console.log("slider", sliders)
  const [updatedCoupons, setUpdatedCoupons] = useState([]);

  const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();
  const { data: globalSetting } = useAsync(SettingServices.getGlobalSetting);


  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, JSON.parse(id)]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== JSON.parse(id)));
    }
  };

  const currency = globalSetting?.default_currency || "$";

  // useEffect(() => {
  //   const result = sliders?.map((el) => {
  //     const newDate = new Date(el?.updatedAt).toLocaleString("en-US", {
  //       timeZone: globalSetting?.default_time_zone,
  //     });
  //     const newObj = {
  //       ...el,
  //       updatedDate: newDate,
  //     };
  //     return newObj;
  //   });
  //   setUpdatedCoupons(result);
  // }, [sliders, globalSetting?.default_time_zone]);

  return (
    <>
      {isCheck.length < 1 && <DeleteModal id={serviceId} title={title} />}

      {isCheck.length < 2 && (
        <MainDrawer>
          <SliderDrawer id={serviceId} />
        </MainDrawer>
      )}

      <TableBody>
        {sliders?.map((slides, i) => {
          console.log("sliders", sliders)
          console.log("slides", slides)
          return (
            <TableRow key={i + 1}>
              <TableCell>
                <CheckBox
                  type="checkbox"
                  name={slides?.title?.en}
                  id={slides.id}
                  handleClick={handleClick}
                  isChecked={isCheck?.includes(slides.id)}
                />
              </TableCell>
              <TableCell>
                {" "}
                <span className="text-sm"> {slides.id}</span>{" "}
              </TableCell>
              {/* <TableCell >
                <div className="w-full md:w-1/2 lg:w-1/3 p-2 ">
                  <img
                    src={slides?.image}
                    alt="Placeholder Image 2"
                    className="rounded-lg shadow-md"
                  />
                </div>
                
              </TableCell> */}
               <TableCell>
              <div className="flex items-center">
                  <img
                    className="hidden p-1 mr-2 md:block bg-gray-50 shadow-none"
                    style={{maxWidth:250}}
                    src={slides?.image}
                    alt="product"
                  />
              </div>
            </TableCell>
              <TableCell>
                {" "}
                <span className="text-sm"> {slides?.heading}</span>{" "}
              </TableCell>
              <TableCell>
                {" "}
                <span className="text-sm"> {slides?.content}</span>{" "}
              </TableCell>
              <TableCell>
                {" "}
                <span className="text-sm"> {slides?.button_label}</span>{" "}
              </TableCell>
             
              {/* {coupon?.calculation_type ? (
              <TableCell>
                {" "}
                <span className="text-sm font-semibold">
                  {" "}
                  {coupon?.calculation_type === "percentage"
                    ? `${coupon?.amount}%`
                    : `${currency}${coupon?.amount}`}
                </span>{" "}
              </TableCell>
            ) : (
              <TableCell>
                {" "}
                <span className="text-sm font-semibold"> </span>{" "}
              </TableCell>
            )} */}



              {/* <TableCell className="align-middle ">
              {dayjs().isAfter(dayjs(coupon.expires_at)) ? (
                <Badge type="danger">Expired</Badge>
              ) : (
                <Badge type="success">Active</Badge>
              )}
            </TableCell> */}

              <TableCell>
                <EditDeleteButton
                  id={slides?.id}
                  isCheck={isCheck}
                  handleUpdate={handleUpdate}
                  handleModalOpen={handleModalOpen}
                  title={showingTranslateValue(slides?.title, lang)}
                  hideDeleteButton={false}
                />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </>
  );
};

export default SliderTable;
