import {
  Button,
  Card,
  CardBody,
  Input,
  Pagination,
  Select,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { FiPlus } from "react-icons/fi";

//internal import

import useAsync from "hooks/useAsync";
import useFilter from "hooks/useFilter";
import MainDrawer from "components/drawer/MainDrawer";
import TableLoading from "components/preloader/TableLoading";
import NotFound from "components/table/NotFound";
import PageTitle from "components/Typography/PageTitle";
import { AdminContext } from "context/AdminContext";
import { SidebarContext } from "context/SidebarContext";
import PermissionTable from "components/permission/PermissionTable";
import PermissionServices from "services/PermissionServices";
import PermissionDrawer from "components/drawer/PermissionDrawer";

const Permission = () => {
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;
  const { toggleDrawer, lang } = useContext(SidebarContext);

  const {data, loading} = useAsync(PermissionServices.getAllPermission);

  const {
    userRef,
    setRole,
    handleChangePage,
    totalResults,
    resultsPerPage,
    dataTable,
    serviceData,
    handleSubmitUser,
  } = useFilter(data?.permissions ? data?.permissions : data);

  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{"Permission"} </PageTitle>
      <MainDrawer>
        <PermissionDrawer />
      </MainDrawer>

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <form
            onSubmit={handleSubmitUser}
            className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
          >
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
            </div>
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
            </div>

            <div className="w-full md:w-56 lg:w-56 xl:w-56">
              <Button onClick={toggleDrawer} className="w-full rounded-md h-12">
                <span className="mr-3">
                  <FiPlus />
                </span>
                {"Add Permission"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {loading ? (
        // <Loading loading={loading} />
        <TableLoading row={12} col={7} width={163} height={20} />
      ) : serviceData?.length !== 0 ? (
        <TableContainer className="mb-8 rounded-b-lg">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>{"Name"}</TableCell>
              </tr>
            </TableHeader>

            <PermissionTable staffs={dataTable} lang={lang} />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onChange={handleChangePage}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Sorry, There are no staff right now." />
      )}
    </>
  );
};

export default Permission;
