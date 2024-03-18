import { TableBody, TableCell, TableRow } from "@windmill/react-ui";
import PrintReceipt from "components/form/PrintReceipt";
import SelectStatus from "components/form/SelectStatus";
import Status from "components/table/Status";
import Tooltip from "components/tooltip/Tooltip";
import { useTranslation } from "react-i18next";
import { FiZoomIn } from "react-icons/fi";
import { Link } from "react-router-dom";
import { showDateTimeFormat } from "utils/dateFormate";
import moment from 'moment';

const OrderTable = ({ orders, currency, globalSetting ,handleUpdateStatus }) => {
  // console.log('globalSetting',globalSetting)
  const { t } = useTranslation();
  console.log('orders',orders)

  return (
    <>
      <TableBody className="dark:bg-gray-900">
        {orders?.map((order, i) =>{
          // console.log("shipp",order?.shipping_address?.first_name)
          // console.log("bill",order?.billing_address?.first_name)

          return (
          <TableRow key={i + 1}>
            <TableCell>
              <span className="font-semibold uppercase text-xs">
                {order?.id}
                {/* {order?.invoice} */}
                </span>
            </TableCell>

            <TableCell>
              <span className="text-sm">
                {moment(order?.created_at).format('DD/MM/YYYY')}

            {/* {showDateTimeFormat(
                  order?.updatedDate,
                  globalSetting?.default_date_format,
                  "h:mm A"
                )}       */}       
                </span> 
            </TableCell>

            <TableCell className="text-xs">
              <span className="text-sm">{order?.billing_address?.first_name}</span>{" "}
            </TableCell>

            <TableCell>
              <span className="text-sm font-semibold">
                {order?.paymentMethod}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm font-semibold">
                {currency}
                {parseFloat(order?.total_amount)?.toFixed(2)}
              </span>
            </TableCell>

            <TableCell className="text-xs">
              <Status status={order?.status} />
            </TableCell>

            <TableCell className="text-center">
              <SelectStatus handleUpdateStatus={handleUpdateStatus} id={order.id} order={order} />
            </TableCell>

            <TableCell className="text-right flex justify-end">
              <div className="flex justify-between items-center">
                <PrintReceipt orderId={order.id} />

                <span className="p-2 cursor-pointer text-gray-400 hover:text-green-600">
                  <Link to={`/order/${order.id}`}>
                    <Tooltip
                      id="view"
                      Icon={FiZoomIn}
                      title={t("ViewInvoice")}
                      bgColor="#059669"
                    />
                  </Link>
                </span>
              </div>
            </TableCell>
          </TableRow>
        )})}
      </TableBody>
    </>
  );
};

export default OrderTable;
