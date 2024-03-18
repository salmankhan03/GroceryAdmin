import {
  Button,
  Card,
  CardBody,
  Input,
  Label,
  Pagination,
  Select,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import { useContext, useEffect, useState } from "react";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import exportFromJSON from "export-from-json";

//internal import
import useAsync from "hooks/useAsync";
import useFilter from "hooks/useFilter";
import OrderServices from "services/OrderServices";
import NotFound from "components/table/NotFound";
import PageTitle from "components/Typography/PageTitle";
import { SidebarContext } from "context/SidebarContext";
import OrderTable from "components/order/OrderTable";
import TableLoading from "components/preloader/TableLoading";
import { notifyError } from "utils/toast";
import spinnerLoadingImage from "assets/img/spinner.gif";
import CustomUpdateModal from "components/modal/UpdateModal";
import EmailTemplateServices from "services/EmailTemplateServices";

const Orders = () => {
  const {
    time,
    setTime,
    currentPage,
    searchText,
    searchRef,
    status,
    setStatus,
    handleChangePage,
    handleSubmitForAll,
    resultsPerPage,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    lang,
    limitData
  } = useContext(SidebarContext);
  const [id, SetId] = useState()
  const [updatedStatus, SetUpdatedStatus] = useState()
  const [previousStatus,SetPreviousStatus]= useState()
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const { t } = useTranslation();
  const [loadingExport, setLoadingExport] = useState(false);
  const [emailTemplateList, SetEmailTemplateList] = useState()
  const [customer, setCustomer] = useState()
  const [customerEmail, setCustomerEmail] = useState()


  useEffect(() => {
    getAllTemplatesList()
  }, [])

  const { data, loading } = useAsync(() =>
    OrderServices.getAllOrders({
      customerName: searchText,
      status,
      page: currentPage,
      limit: resultsPerPage,
      day: time,
      startDate,
      endDate,
    })
  );


  const { dataTable, serviceData, globalSetting } = useFilter(data?.list?.data);

  const getAllTemplatesList = async () => {
    let EmailTemplateListData = await EmailTemplateServices.getAllTemplates({
      page: currentPage,
      limit: limitData,
    })
    console.log(EmailTemplateListData)

    if (EmailTemplateListData?.status_code === 200)
      SetEmailTemplateList(EmailTemplateListData.list.data)

  }
  const handleDownloadOrders = async () => {
    try {
      setLoadingExport(true);
      const res = await OrderServices.getAllOrders({
        customerName: "",
        status: null,
        page: null,
        limit: null,
        day: null,
        startDate: null,
        endDate: null,
      });

      console.log("handleDownloadOrders", res);
      const exportData = res?.orders?.map((order) => {
        return {
          _id: order._id,
          invoice: order.invoice,
          subTotal: order.subTotal,
          shippingCost: order.shippingCost,
          discount: order?.discount,
          total: order.total,
          paymentMethod: order.paymentMethod,
          status: order.status,
          user_info: order?.user_info?.name,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        };
      });

      exportFromJSON({
        data: exportData,
        fileName: "orders",
        exportType: exportFromJSON.types.csv,
      });
      setLoadingExport(false);
    } catch (err) {
      setLoadingExport(false);
      console.log("err on orders download", err);
      notifyError(err ? err?.response?.data?.message : err.message);
    }
  };
  // console.log("data in orders page", data);
  const updateStatus = (id, status) => {
    SetId(id)
    console.log(id, data)
    const selectedOrder = dataTable.find(order => order?.id === id);
    console.log("selectedOrder",selectedOrder)
    SetPreviousStatus(selectedOrder?.status)
    setCustomer(selectedOrder?.billing_address?.first_name)
    setCustomerEmail(selectedOrder?.billing_address?.email)
    SetUpdatedStatus(status)
    setIsUpdateModalOpen(true);
  };
  const closeModalFunc = () => {
    setIsUpdateModalOpen(false)
  }

  return (
    <>
      <PageTitle>{t("Orders")}</PageTitle>
      {isUpdateModalOpen && (
        <CustomUpdateModal
          id={id}
          previous_order_status={previousStatus}
          status={updatedStatus}
          title={updatedStatus}
          handleConfirmUpdate={isUpdateModalOpen}
          closeModal={closeModalFunc}
          templatesList={emailTemplateList}
          customerName={customer}
          customerEmail={customerEmail}
        />
      )}

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <form onSubmit={handleSubmitForAll}>
            <div className="grid gap-4 lg:gap-6 xl:gap-6 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 py-2">
              <div>
                <Input
                  ref={searchRef}
                  type="search"
                  name="search"
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                  placeholder="Search by Customer Name"
                  onChange={handleSubmitForAll}
                />
              </div>

              <div>
                <Select
                  onChange={(e) => setStatus(e.target.value)}
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                >
                  <option value="Status" defaultValue hidden>
                    {t("Status")}
                  </option>
                  <option value="Delivered">{t("PageOrderDelivered")}</option>
                  <option value="Pending">{t("PageOrderPending")}</option>
                  <option value="Processing">{t("PageOrderProcessing")}</option>
                  <option value="Cancel">{t("OrderCancel")}</option>
                </Select>
              </div>

              <div>
                <Select
                  onChange={(e) => setTime(e.target.value)}
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                >
                  <option value="Order limits" defaultValue hidden>
                    {t("Orderlimits")}
                  </option>
                  <option value="5">{t("DaysOrders5")}</option>
                  <option value="7">{t("DaysOrders7")}</option>
                  <option value="15">{t("DaysOrders15")}</option>
                  <option value="30">{t("DaysOrders30")}</option>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 lg:gap-6 xl:gap-6 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 py-2">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  name="startDate"
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  name="startDate"
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div>
                <Label style={{ visibility: "hidden" }}>{t("Download")}</Label>
                {loadingExport ? (
                  <Button disabled={true} type="button" className="h-12 w-full">
                    <img
                      src={spinnerLoadingImage}
                      alt="Loading"
                      width={20}
                      height={10}
                    />{" "}
                    <span className="font-serif ml-2 font-light">
                      Processing
                    </span>
                  </Button>
                ) : (
                  <button
                    onClick={handleDownloadOrders}
                    disabled={data?.orders?.length <= 0 || loadingExport}
                    type="button"
                    className={`${(data?.orders?.length <= 0 || loadingExport) &&
                      "opacity-50 cursor-not-allowed bg-red-300"
                      } flex items-center justify-center text-sm leading-5 h-12 w-full text-center transition-colors duration-150 font-medium focus:outline-none px-6 py-2 rounded-md text-white bg-green-500 border border-transparent active:bg-green-600 hover:bg-green-600 focus:ring focus:ring-purple-300`}
                  >
                    Download All Orders
                    <span className="ml-2 text-base">
                      <IoCloudDownloadOutline />
                    </span>
                  </button>
                )}
              </div>
            </div>
          </form>
        </CardBody>
      </Card>

      {loading ? (
        <TableLoading row={12} col={7} width={160} height={20} />
      ) : serviceData?.length !== 0 ? (
        <TableContainer className="mb-8 dark:bg-gray-900">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>{t("InvoiceNo")}</TableCell>
                <TableCell>{t("TimeTbl")}</TableCell>
                <TableCell>{t("CustomerName")}</TableCell>
                <TableCell>{t("MethodTbl")}</TableCell>
                <TableCell>{t("AmountTbl")}</TableCell>
                <TableCell>{t("OderStatusTbl")}</TableCell>
                <TableCell>{t("ActionTbl")}</TableCell>
                <TableCell className="text-right">{t("InvoiceTbl")}</TableCell>
              </tr>
            </TableHeader>

            <OrderTable
              lang={lang}
              orders={dataTable}
              globalSetting={globalSetting}
              currency={globalSetting?.default_currency || "$"}
              handleUpdateStatus={updateStatus}
            />
          </Table>

          <TableFooter>
            <Pagination
              totalResults={data?.list?.total}
              resultsPerPage={data?.list?.per_page}
              onChange={handleChangePage}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Sorry, There are no orders right now." />
      )}
    </>
  );
};

export default Orders;
