import {
  Button,
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
import { useContext, useState } from "react";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";

import { useTranslation } from "react-i18next";
import { SidebarContext } from "context/SidebarContext";
import CouponServices from "services/CouponServices";
import useAsync from "hooks/useAsync";
import useToggleDrawer from "hooks/useToggleDrawer";
import useFilter from "hooks/useFilter";
import PageTitle from "components/Typography/PageTitle";
import DeleteModal from "components/modal/DeleteModal";
import BulkActionDrawer from "components/drawer/BulkActionDrawer";
import MainDrawer from "components/drawer/MainDrawer";
import TableLoading from "components/preloader/TableLoading";
import CheckBox from "components/form/CheckBox";
import NotFound from "components/table/NotFound";
import  UploadManyTwo  from 'components/common/UploadManyTwo';
import SliderTable from "components/slider/SliderTable";
import SliderServices from "services/SliderServices";
import SliderDrawer from "components/drawer/SliderDrawer";

const Sliders = () => {
  const { toggleDrawer, lang } = useContext(SidebarContext);
  const { data , loading } = useAsync(SliderServices.getSliders);
  const data1 = data?.list
  console.log('data-----------------------------?',data1)
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const { allId, serviceId, handleDeleteMany, handleUpdateMany } = useToggleDrawer();

  const {
    handleSubmitSlider,
    sliderRef,
    dataTable,
    serviceData,
    totalResults,
    resultsPerPage,
    handleChangePage,
    handleSelectFile,
    filename,
    isDisabled,
    handleUploadMultiple,
    handleRemoveSelectFile,
  } = useFilter(data1);

  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(data1?.map((li) => li.id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{"Slider"}</PageTitle>
      <DeleteModal ids={allId} setIsCheck={setIsCheck} title="Selected Coupon" />
      <BulkActionDrawer ids={allId} title="Slider" />

      <MainDrawer>
        <SliderDrawer id={serviceId} />
      </MainDrawer>

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <form onSubmit={handleSubmitSlider} className="py-3 grid gap-4 lg:gap-6 xl:gap-6  xl:flex">
            <div className="flex justify-start xl:w-1/2  md:w-full">
              <UploadManyTwo
                title="Slider"
                exportData={data1}
                filename={filename}
                isDisabled={isDisabled}
                handleSelectFile={handleSelectFile}
                handleUploadMultiple={handleUploadMultiple}
                handleRemoveSelectFile={handleRemoveSelectFile}
              />
            </div>

            <div className="lg:flex  md:flex xl:justify-end xl:w-1/2  md:w-full md:justify-start flex-grow-0">
              <div className="w-full md:w-40 lg:w-40 xl:w-40 mr-3 mb-3 lg:mb-0">
                <Button
                  disabled={isCheck.length < 1}
                  onClick={() => handleUpdateMany(isCheck)}
                  className="w-full rounded-md h-12 btn-gray text-gray-600"
                >
                  <span className="mr-2">
                    <FiEdit />
                  </span>
                  {t("BulkAction")}
                </Button>
              </div>

              <div className="w-full md:w-32 lg:w-32 xl:w-32 mr-3 mb-3 lg:mb-0">
                <Button
                  disabled={isCheck.length < 1}
                  onClick={() => handleDeleteMany(isCheck)}
                  className="w-full rounded-md h-12 bg-red-500 btn-red"
                >
                  <span className="mr-2">
                    <FiTrash2 />
                  </span>

                  {t("Delete")}
                </Button>
              </div>

              <div className="w-full md:w-48 lg:w-48 xl:w-48">
                <Button onClick={toggleDrawer} className="w-full rounded-md h-12">
                  <span className="mr-2">
                    <FiPlus />
                  </span>
                  {"Add Slider"}
                </Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <form
            onSubmit={handleSubmitSlider}
            className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
          >
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Input
                ref={sliderRef}
                type="search"
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                placeholder={t("SearchCoupon")}
                onChange={handleSubmitSlider}
              />
            </div>
          </form>
        </CardBody>
      </Card>

      {loading ? (
        // <Loading loading={loading} />
        <TableLoading row={12} col={8} width={140} height={20} />
      ) : serviceData?.length !== 0 ? (
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>
                  <CheckBox
                    type="checkbox"
                    name="selectAll"
                    id="selectAll"
                    handleClick={handleSelectAll}
                    isChecked={isCheckAll}
                  />
                </TableCell>
                {/*<TableCell>{t("CoupTblCampaignsName")}</TableCell>*/}
                <TableCell>{"id"}</TableCell>
                <TableCell>{"Slide"}</TableCell>
                <TableCell>{"Heading"}</TableCell>
                <TableCell>{"Content"}</TableCell>
                <TableCell>{"Button Label"}</TableCell>


                <TableCell className="text-right">{t("CoupTblActions")}</TableCell>
              </tr>
            </TableHeader>
            <SliderTable lang={lang} isCheck={isCheck} sliders={dataTable} setIsCheck={setIsCheck} />
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
        <NotFound title="Sorry, There are no coupons right now." />
      )}
    </>
  );
};

export default Sliders;
