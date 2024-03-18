import React from "react";
import { TableCell, TableBody, TableRow } from "@windmill/react-ui";
import Status from "components/table/Status";
import SelectStatus from "components/form/SelectStatus";
import useFilter from "hooks/useFilter";
import { showDateFormat } from "utils/dateFormate";
import moment from 'moment';

// import Status from '../table/Status';
// import SelectStatus from '../form/SelectStatus';

const CustomerEmailListTable = (data) => {
  console.log("ORDERS", data)
  const { globalSetting } = useFilter();
  return (
    <>

      <TableBody>
        {data?.data?.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              <span className="font-semibold uppercase text-xs">
                {order?.id}
              </span>
            </TableCell>
            <TableCell>
              <span className="font-semibold uppercase text-xs">
                {order?.order_id}
              </span>
            </TableCell>

            <TableCell className="text-center">
              <Status status={order.current_order_status} />
            </TableCell>
            <TableCell style={{ width: '100%', wordWrap: 'break-word', overflowWrap: 'break-word', overflowX: 'auto',whiteSpace:'break-spaces'}}>
              <div style={{ width: '100%', overflowWrap: 'break-word' }}>
                <div dangerouslySetInnerHTML={{ __html: decodeURIComponent(order?.email_body) }} />
              </div>
            </TableCell>

            {/* <TableCell style={{ width: '100%', wordWrap: 'break-word' }}>
              <div dangerouslySetInnerHTML={{ __html: decodeURIComponent(order?.templates) }} />;
            </TableCell> */}
            {/* <TableCell>
              <span>{moment(order?.created_at).format('DD/MM/YYYY')}</span>
            </TableCell> */}

          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default CustomerEmailListTable;
