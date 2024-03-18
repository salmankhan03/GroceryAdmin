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
import EmailTemplateServices from "services/EmailTemplateServices";
import EmailTemplateTable from "components/emailTemplates/emailTemplatesTables";
import EmailTemplateDrawer from "components/drawer/EmailTemplateDrawer";


const EmailTemplate = () => {
    const { toggleDrawer, lang, currentPage, limitData } = useContext(SidebarContext);

    const { data, loading } = useAsync(() =>
        EmailTemplateServices.getAllTemplates({
            page: currentPage,
            limit: limitData,
        })
    );
    console.log("static DATA List", data)
    const { handleDeleteMany, allId, handleUpdateMany, serviceId } = useToggleDrawer();

    const { t } = useTranslation();
    const {
        handleSubmitBrands,
        brandRef,
        // totalResults,
        resultsPerPage,
        dataTable,
        serviceData,
        handleChangePage,
        filename,
        isDisabled,
        handleSelectFile,
        handleUploadMultiple,
        handleRemoveSelectFile,
    } = useFilter(data?.list?.data);

    // react hooks
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState([]);



    const handleSelectAll = () => {
        setIsCheckAll(!isCheckAll);
        setIsCheck(data?.list?.data?.map((li) => li.id));
        if (isCheckAll) {
            setIsCheck([]);
        }
    };
  return (
    <>
      <PageTitle>Email Template</PageTitle>
      <DeleteModal ids={allId} setIsCheck={setIsCheck} />
            <BulkActionDrawer ids={allId} title="Brand" lang={lang} data={data?.list?.data} isCheck={isCheck} />
            <MainDrawer>
                <EmailTemplateDrawer id={serviceId} data={data} brandList={data?.list?.data} lang={lang} />
            </MainDrawer>
            <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
                <CardBody className="">
                    <form onSubmit={handleSubmitBrands} className="py-3  grid gap-4 lg:gap-6 xl:gap-6  xl:flex">
                        <div className="flex justify-start w-1/2 xl:w-1/2 md:w-full">
                            <UploadManyTwo
                                title="Brands"
                                exportData={data?.list?.data}
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

                                    {"Add Email Template"}
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
                            />
                        </div>
                    </form>
                </CardBody>
            </Card>
            {loading ? (
                <TableLoading row={12} col={6} width={190} height={20} />
            ) : data?.list?.data?.length !== 0 ? (
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

                                    <TableCell>{t("catIdTbl")}</TableCell>
                                    <TableCell>{t("CatTbName")}</TableCell>
                                    <TableCell className="text-right">{t("catActionsTbl")}</TableCell>
                                </tr>
                            </TableHeader>

                            <EmailTemplateTable
                                lang={lang}
                                isCheck={isCheck}
                                brands={data?.list?.data}
                                setIsCheck={setIsCheck}
                            />
                        </Table>

                        <TableFooter>
                            <Pagination
                                totalResults={data?.list?.last_page}
                                resultsPerPage={resultsPerPage}
                                onChange={handleChangePage}
                                label="Table navigation"
                            />
                        </TableFooter>
                    </TableContainer>
                </>
            ) : (
                <NotFound title="Sorry, There are no Templates right now." />
            )}
    </>
  );
};
export default EmailTemplate;
