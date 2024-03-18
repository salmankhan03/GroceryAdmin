import {
  Card,
  CardBody,
  Input,
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import UploadManyTwo from "components/common/UploadManyTwo";
import CustomerTable from "components/customer/CustomerTable";
import TableLoading from "components/preloader/TableLoading";
import NotFound from "components/table/NotFound";
import PageTitle from "components/Typography/PageTitle";
import { SidebarContext } from "context/SidebarContext";
import useAsync from "hooks/useAsync";
import useFilter from "hooks/useFilter";
import React, { useContext, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import CustomerServices from "services/CustomerServices";

const Customers = () => {
  const { currentPage, limitData, handleChangePage } = useContext(SidebarContext);
  const [isAscendingOrder, setIsAscendingOrder] = useState(false)
  const [allCustomers, setAllCustomers] = useState();

  const { data, loading } = useAsync(() =>
    CustomerServices.getAllCustomers({
      page: currentPage,
      limit: limitData,
      customer: ""
    }));
    useEffect(()=>{
      setAllCustomers(data)
    },[data])
    const {
    userRef,
    totalResults,
    resultsPerPage,
    dataTable,
    serviceData,
    handleSubmitUser,
    filename,
    isDisabled,
    handleSelectFile,
    handleUploadMultiple,
    handleRemoveSelectFile,
  } = useFilter(allCustomers?.list?.data);

  const { t } = useTranslation();
  const handleIDSorting = () => {
    // console.log("HANDLE ID ",allCustomers?.list?.data)
    let sortedData;
    setIsAscendingOrder(!isAscendingOrder);
    sortedData =  [...allCustomers?.list?.data].sort((a, b) => (isAscendingOrder ? a.id - b.id : b.id - a.id));
    console.log(sortedData)
    setAllCustomers(prevData => ({
        ...prevData,
        list: {
          ...prevData.list,
          data: sortedData
        }
      }));

};

  return (
    <>
      <PageTitle>{t("CustomersPage")}</PageTitle>

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <form
            onSubmit={handleSubmitUser}
            className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
          >
            <div className="items-center">
              <UploadManyTwo
                title="Customers"
                exportData={allCustomers?.list?.data}
                filename={filename}
                isDisabled={isDisabled}
                handleSelectFile={handleSelectFile}
                handleUploadMultiple={handleUploadMultiple}
                handleRemoveSelectFile={handleRemoveSelectFile}
              />
            </div>
          </form>
        </CardBody>
      </Card>

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <form
            onSubmit={handleSubmitUser}
            className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
          >
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Input
                ref={userRef}
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                type="search"
                name="search"
                placeholder={t("CustomersPageSearchPlaceholder")}
                onChange={handleSubmitUser}
              />
              <button
                type="submit"
                className="absolute right-0 top-0 mt-5 mr-1"
              ></button>
            </div>
          </form>
        </CardBody>
      </Card>

      {loading ? (
        // <Loading loading={loading} />
        <TableLoading row={12} col={6} width={190} height={20} />
      ) : serviceData?.length !== 0 ? (
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell onClick={handleIDSorting}>{t("CustomersId")}</TableCell>
                <TableCell>{t("CustomersJoiningDate")}</TableCell>
                <TableCell>{t("CustomersName")}</TableCell>
                <TableCell>{t("CustomersEmail")}</TableCell>
                <TableCell>{t("CustomersPhone")}</TableCell>
                <TableCell className="text-right">
                  {t("CustomersActions")}
                </TableCell>
              </tr>
            </TableHeader>
            <CustomerTable customers={serviceData? serviceData : allCustomers?.list?.data} />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={allCustomers?.list?.total}
              resultsPerPage={allCustomers?.list?.per_page}
              onChange={handleChangePage}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Sorry, There are no customers right now." />
      )}
    </>
  );
};

export default Customers;
