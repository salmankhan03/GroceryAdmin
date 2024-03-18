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
  
  const OrdersLogs = () => {
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
        <PageTitle>{"Order Logs"}</PageTitle>
      </>
    );
  };
  
  export default OrdersLogs;
  