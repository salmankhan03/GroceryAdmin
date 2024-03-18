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
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";

//internal import

import useAsync from "hooks/useAsync";
import { SidebarContext } from "context/SidebarContext";
import CategoryServices from "services/CategoryServices";
import useToggleDrawer from "hooks/useToggleDrawer";
import useFilter from "hooks/useFilter";
import DeleteModal from "components/modal/DeleteModal";
import BulkActionDrawer from "components/drawer/BulkActionDrawer";
import PageTitle from "components/Typography/PageTitle";
import MainDrawer from "components/drawer/MainDrawer";
import CategoryDrawer from "components/drawer/CategoryDrawer";
import UploadManyTwo from "components/common/UploadManyTwo";
import SwitchToggleChildCat from "components/form/SwitchToggleChildCat";
import TableLoading from "components/preloader/TableLoading";
import CheckBox from "components/form/CheckBox";
import CategoryTable from "components/category/CategoryTable";
import NotFound from "components/table/NotFound";

const Category = () => {
  const { toggleDrawer, lang } = useContext(SidebarContext);

  const { data, loading } = useAsync(CategoryServices.getAllCategory);
  const { data: getAllCategories } = useAsync(CategoryServices.getAllCategories);

  const { handleDeleteMany, allId, handleUpdateMany, serviceId } = useToggleDrawer();

  const { t } = useTranslation();

  const {
    handleSubmitCategory,
    categoryRef,
    totalResults,
    resultsPerPage,
    dataTable,
    serviceData,
    filterCategory,
    handleChangePage,
    filename,
    isDisabled,
    handleSelectFile,
    handleUploadMultiple,
    handleRemoveSelectFile,
  } = useFilter(getAllCategories?.tree?.data);

  // react hooks
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [showChild, setShowChild] = useState(false);
  const [isAscendingOrder, setIsAscendingOrder] = useState(false)
  const [sortOrder, setSortOrder] = useState('default');
  const [getAllCategorie, setGetAllCategorie] = useState();
  useEffect(()=>{
    setGetAllCategorie(getAllCategories)
  },[getAllCategories])

  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(data?.list?.map((li) => li.id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };
  const handleIDSorting = () => {
    let sortedData;
    setIsAscendingOrder(!isAscendingOrder);
    sortedData =  [...getAllCategorie?.tree?.data].sort((a, b) => (isAscendingOrder ? a.id - b.id : b.id - a.id));
    setGetAllCategorie((prev) => ({
      ...prev,
      tree: {
        ...prev.tree,
        data: sortedData
      }
    }));

};
const handleNameSorting = () => {
  let sortedData;
  if (sortOrder === 'default') {
    sortedData =  [...getAllCategorie?.tree?.data].sort((a, b) => a.name.localeCompare(b.name));
    setSortOrder('AtoZ');
  } else if (sortOrder === 'AtoZ') {
    sortedData =  [...getAllCategorie?.tree?.data].sort((a, b) => b.name.localeCompare(a.name));
    setSortOrder('ZtoA');
  } else {
    sortedData = getAllCategorie?.tree?.data;
    setSortOrder('default');
  }
  setGetAllCategorie((prev) => ({
    ...prev,
    tree: {
      ...prev.tree,
      data: sortedData
    }
  }));
};

  return (
    <>
     <PageTitle>{t("Category")}</PageTitle>
      <DeleteModal ids={allId} setIsCheck={setIsCheck} />

      <BulkActionDrawer ids={allId} title="Categories" lang={lang} data={getAllCategorie} isCheck={isCheck} />

      <MainDrawer>
        <CategoryDrawer id={serviceId} data={data} categoriesList={getAllCategorie?.tree?.data} lang={lang} />
      </MainDrawer> 
    
      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody className="">
          {/* <div className="flex md:flex-row flex-col gap-3 justify-end items-end"> */}
          <form onSubmit={handleSubmitCategory} className="py-3  grid gap-4 lg:gap-6 xl:gap-6  xl:flex">
            {/* </div> */}
            <div className="flex justify-start w-1/2 xl:w-1/2 md:w-full">
              <UploadManyTwo
                title="Categories"
                exportData={getAllCategorie}
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
                  className="w-full rounded-md h-12 text-gray-600 btn-gray"
                >
                  <span className="mr-2">
                    <FiEdit />
                  </span>

                  {t("BulkAction")}
                </Button>
              </div>
              <div className="w-full md:w-32 lg:w-32 xl:w-32  mr-3 mb-3 lg:mb-0">
                <Button
                  disabled={isCheck.length < 1}
                  onClick={() => handleDeleteMany(isCheck)}
                  className="w-full rounded-md h-12 bg-red-500 disabled  btn-red"
                >
                  <span className="mr-2">
                    <FiTrash2 />
                  </span>

                  {t("Delete")}
                </Button>
              </div>
              <div className="w-full md:w-48 lg:w-48 xl:w-48">
                <Button onClick={toggleDrawer} className="rounded-md h-12 w-full">
                  <span className="mr-2">
                    <FiPlus />
                  </span>

                  {t("AddCategory")}
                </Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 rounded-t-lg rounded-0 mb-4">
        <CardBody>
          <form
            onSubmit={handleSubmitCategory}
            className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
          >
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Input
                ref={categoryRef}
                type="search"
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                placeholder={t("SearchCategory")}
                onChange={handleSubmitCategory}
              />
            </div>
          </form>
        </CardBody>
      </Card>

      <SwitchToggleChildCat
        title=" "
        handleProcess={setShowChild}
        processOption={showChild}
        name={showChild}
      />
      {loading ? (
        <TableLoading row={12} col={6} width={190} height={20} />
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

                <TableCell onClick={handleIDSorting}>{t("catIdTbl")}</TableCell>
                <TableCell>{t("catIconTbl")}</TableCell>
                <TableCell onClick={handleNameSorting}>{t("CatTbName")}</TableCell>
                <TableCell>{t("CatTbDescription")}</TableCell>
                <TableCell className="text-center">{t("catPublishedTbl")}</TableCell>
                <TableCell className="text-right">{t("catActionsTbl")}</TableCell>
              </tr>
            </TableHeader>

            <CategoryTable
              data={filterCategory ? filterCategory : getAllCategorie?.tree?.data}
              lang={lang}
              isCheck={isCheck}
              categories={dataTable}
              setIsCheck={setIsCheck}
              showChild={showChild}
              categoriesList={filterCategory ? filterCategory : getAllCategorie?.tree?.data}
            />
          </Table>

          <TableFooter>
            <Pagination
              totalResults={getAllCategorie?.tree?.total}
              resultsPerPage={getAllCategorie?.tree?.per_page}
              onChange={handleChangePage}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Sorry, There are no categories right now." />
      )}
    </>
  );
};

export default Category;
