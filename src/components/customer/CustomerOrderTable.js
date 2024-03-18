import React from "react";
import { TableCell, TableBody, TableRow } from "@windmill/react-ui";
import Status from "components/table/Status";
import SelectStatus from "components/form/SelectStatus";
import useFilter from "hooks/useFilter";
import { showDateFormat } from "utils/dateFormate";
import moment from 'moment';

// import Status from '../table/Status';
// import SelectStatus from '../form/SelectStatus';

const CustomerOrderTable = ({ orders }) => {
  const { globalSetting } = useFilter();
  return (
    <>
      <TableBody>
        {orders?.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              <span className="font-semibold uppercase text-xs">
                {order?.id}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm">
                {/* {dayjs(order.createdAt).format("MMM D, YYYY")} */}
                {moment(order?.createdAt).format('DD/MM/YYYY')}      
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm">{order?.shipping_address?.state}</span>
            </TableCell>
            <TableCell>
              {" "}
              <span className="text-sm">{order.shipping_address?.contact_no}</span>{" "}
            </TableCell>
            <TableCell>
              <span className="text-sm font-semibold">
                {"COD"}
              </span>
            </TableCell>
            <TableCell className="text-center">
              <Status status={order.status} />
            </TableCell>
            <TableCell>
              {" "}
              <span className="text-sm font-semibold">
                ${parseFloat(order.total_amount).toFixed(2)}
              </span>{" "}
            </TableCell>
            {/* <TableCell className="text-right">
              <SelectStatus id={order.id} />
            </TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default CustomerOrderTable;
