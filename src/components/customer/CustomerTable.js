import { TableBody, TableCell, TableRow } from "@windmill/react-ui";
import CustomerDrawer from "components/drawer/CustomerDrawer";
import MainDrawer from "components/drawer/MainDrawer";
import DeleteModal from "components/modal/DeleteModal";
import EditDeleteButton from "components/table/EditDeleteButton";
import Tooltip from "components/tooltip/Tooltip";
import * as dayjs from "dayjs";
import useToggleDrawer from "hooks/useToggleDrawer";
import { t } from "i18next";
import React from "react";
import { FiZoomIn } from "react-icons/fi";
import { Link } from "react-router-dom";
import moment from 'moment';
// internal imports

const CustomerTable = ({ customers }) => {
  const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();

  return (
    <>
      <DeleteModal id={serviceId} title={title} />

      <MainDrawer>
        <CustomerDrawer id={serviceId} />
      </MainDrawer>

      <TableBody>
        {customers?.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <span className="font-semibold uppercase text-xs">
                {" "}
                {user?.id}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm">
                {moment(user.createdAt).format("DD/MM/YYYY")}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm">{user.first_name}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm">{user.email}</span>{" "}
            </TableCell>
            <TableCell>
              <span className="text-sm font-medium">{user.contact_no}</span>
            </TableCell>

            <TableCell>
              <div className="flex justify-end text-right">
                <div className="p-2 cursor-pointer text-gray-400 hover:text-green-600">
                  {" "}
                  <Link to={`/customer-order/${user.id}`}>
                    <Tooltip
                      id="view"
                      Icon={FiZoomIn}
                      title={t("ViewOrder")}
                      bgColor="#34D399"
                    />
                  </Link>
                </div>

                <EditDeleteButton
                  title={user.first_name}
                  id={user.id}
                  handleUpdate={handleUpdate}
                  handleModalOpen={handleModalOpen}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default CustomerTable;
