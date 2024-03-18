import React from "react";
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
import useAsync from "hooks/useAsync";
import { SidebarContext } from "context/SidebarContext";
import useToggleDrawer from "hooks/useToggleDrawer";
import useFilter from "hooks/useFilter";
import DeleteModal from "components/modal/DeleteModal";
import BulkActionDrawer from "components/drawer/BulkActionDrawer";
import PageTitle from "components/Typography/PageTitle";
import MainDrawer from "components/drawer/MainDrawer";
import UploadManyTwo from "components/common/UploadManyTwo";
import TableLoading from "components/preloader/TableLoading";
import CheckBox from "components/form/CheckBox";
import NotFound from "components/table/NotFound";
import BrandServices from "services/BrandServices";
import BrandTable from "components/brand/BrandTable";
import BrandDrawer from "components/drawer/BrandDrawer";
const Brand = () => {
    // const [currentPage, setCurrentPage] = useState(1)
    // const [limit, setLimit] = useState(20)

    const { toggleDrawer, lang, currentPage, limitData,handleChangePage } = useContext(SidebarContext);
    const [sortOrder, setSortOrder] = useState('default');  
    const [isAscendingOrder, setIsAscendingOrder] = useState(false)
    const [allBrannds, setAllBrannds] = useState();

    const { data, loading } = useAsync(() =>
        BrandServices.getAllBrands({
            page: currentPage,
            limit: limitData,
        })
    );
    const { handleDeleteMany, allId, handleUpdateMany, serviceId } = useToggleDrawer();

    const { t } = useTranslation();
    const {
        handleSubmitBrands,
        brandRef,
        // totalResults,
        resultsPerPage,
        dataTable,
        serviceData,
        filename,
        isDisabled,
        handleSelectFile,
        handleUploadMultiple,
        handleRemoveSelectFile,
    } = useFilter(allBrannds?.list?.data);

    // react hooks
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState([]);

    useEffect(()=>{
        setAllBrannds(data)
      },[data])

    const handleSelectAll = () => {
        setIsCheckAll(!isCheckAll);
        setIsCheck(allBrannds?.list?.data?.map((li) => li.id));
        if (isCheckAll) {
            setIsCheck([]);
        }
    };
    const handleIDSorting = () => {
        let sortedData;
        setIsAscendingOrder(!isAscendingOrder);
        sortedData =  [...allBrannds?.list?.data].sort((a, b) => (isAscendingOrder ? a.id - b.id : b.id - a.id));
        setAllBrannds(prevData => ({
            ...prevData,
            list: {
              ...prevData.list,
              data: sortedData
            }
          }));
    
    };
    const handleNameSorting = () => {
        let sortedData;
        if (sortOrder === 'default') {
          sortedData = [...allBrannds?.list?.data].sort((a, b) => a.name.localeCompare(b.name));
          setSortOrder('AtoZ');
        } else if (sortOrder === 'AtoZ') {
          sortedData = [...allBrannds?.list?.data].sort((a, b) => b.name.localeCompare(a.name));
          setSortOrder('ZtoA');
        } else {
          sortedData = allBrannds?.list?.data;
          setSortOrder('default');
        }
        setAllBrannds(prevData => ({
            ...prevData,
            list: {
              ...prevData.list,
              data: sortedData
            }
          }));
        console.log(sortedData)
      };
    return (
        <>
            <PageTitle>Brand</PageTitle>
            <DeleteModal ids={allId} setIsCheck={setIsCheck} />
            <BulkActionDrawer ids={allId} title="Brand" lang={lang} data={allBrannds?.list?.data} isCheck={isCheck} />
            <MainDrawer>
                <BrandDrawer id={serviceId} data={data} brandList={allBrannds?.list?.data} lang={lang} />
            </MainDrawer>
            <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
                <CardBody className="">
                    <form onSubmit={handleSubmitBrands} className="py-3  grid gap-4 lg:gap-6 xl:gap-6  xl:flex">
                        <div className="flex justify-start w-1/2 xl:w-1/2 md:w-full">
                            <UploadManyTwo
                                title="Brands"
                                exportData={allBrannds?.list?.data}
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

                                    {t("AddBrand")}
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardBody>
            </Card>
            <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 rounded-t-lg rounded-0 mb-4">
                <CardBody>
                    <form
                        onSubmit={handleSubmitBrands}
                        className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
                    >
                        <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                            <Input
                                ref={brandRef}
                                type="search"
                                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                                placeholder={t("SearchBrand")}
                                onChange={handleSubmitBrands}
                            />
                        </div>
                    </form>
                </CardBody>
            </Card>
            {loading ? (
                <TableLoading row={12} col={6} width={190} height={20} />
            ) : allBrannds?.list?.data?.length !== 0 ? (
                <>
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
                                    <TableCell onClick={handleNameSorting}>{t("CatTbName")}</TableCell>
                                    {/* <TableCell>{t("CatTbDescription")}</TableCell> */}
                                    <TableCell className="text-center">{t("catPublishedTbl")}</TableCell>
                                    {/* <TableCell className="text-right">{t("DetailsTbl")}</TableCell> */}
                                    <TableCell className="text-right">{t("catActionsTbl")}</TableCell>
                                </tr>
                            </TableHeader>

                            <BrandTable
                                lang={lang}
                                isCheck={isCheck}
                                brands={serviceData ? serviceData: allBrannds?.list?.data}
                                setIsCheck={setIsCheck}
                            />
                        </Table>

                        <TableFooter>
                            <Pagination
                                totalResults={allBrannds?.list?.total}
                                resultsPerPage={limitData}
                                onChange={handleChangePage}
                                label="Table navigation"
                            />
                        </TableFooter>
                    </TableContainer>
                </>
            ) : (
                <NotFound title="Sorry, There are no Brands right now." />
            )}

        </>
    )
}
export default Brand;
