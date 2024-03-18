import ReactTagInput from "@pathofdev/react-tag-input";
import {
  Button,
  Input,
  TableCell,
  TableContainer,
  TableHeader,
  Textarea,
  Table,
} from "@windmill/react-ui";
import Multiselect from "multiselect-react-dropdown";
import React, { useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { MultiSelect } from "react-multi-select-component";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiX, FiPlus } from "react-icons/fi";
import useProductSubmit from "hooks/useProductSubmit";
import UploaderThree from "components/image-uploader/UploaderThree";
import Title from "components/form/Title";
import SwitchToggleForCombination from "components/form/SwitchToggleForCombination";
import ActiveButton from "components/form/ActiveButton";
import LabelArea from "components/form/LabelArea";
import Error from "components/form/Error";
import Uploader from "components/image-uploader/Uploader";
import InputArea from "components/form/InputArea";
import ParentCategory from "components/category/ParentCategory";
import InputValue from "components/form/InputValue";
import InputValueFive from "components/form/InputValueFive";
import AttributeOptionTwo from "components/attribute/AttributeOptionTwo";
import DrawerButton from "components/form/DrawerButton";
import AttributeListTable from "components/attribute/AttributeListTable";
import { showingTranslateValue } from "utils/translate";
import SwitchToggle from "components/form/SwitchToggle";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import UploadAdapter from "services/UploadAdapter";
import CategoryModal from "components/modal/CategoryModal";
import { useSelector } from "react-redux";
import CategoryServices from "services/CategoryServices";
//internal import

const ProductDrawer = ({ id, handleUpdateStatus }) => {
  const { t } = useTranslation();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const oldCategoryData = useSelector(state => state?.addTocategory?.category);

  const {
    defaultContent,
    setDefaultContent,
    brands,
    filteredBrandOptions,
    setFilteredBrandOptions,
    searchTerm,
    setSearchTerm,
    selectedBrand,
    setSelectedBrand,
    tag,
    setTag,
    values,
    language,
    register,
    onSubmit,
    errors,
    slug,
    openModal,
    attribue,
    setValues,
    variants,
    imageUrl,
    setImageUrl,
    handleSubmit,
    isCombination,
    variantTitle,
    attributes,
    attTitle,
    handleAddAtt,
    // productId,
    onCloseModal,
    isBulkUpdate,
    globalSetting,
    isSubmitting,
    tapValue,
    setTapValue,
    resetRefTwo,
    handleSkuBarcode,
    handleProductTap,
    selectedCategory,
    setSelectedCategory,
    setDefaultCategory,
    defaultCategory,
    handleProductSlug,
    published,
    setPublished,
    description,
    setDescription,
    addTax,
    setAddTax,
    handleEditorChange,
    handleSelectLanguage,
    handleIsCombination,
    handleEditVariant,
    handleRemoveVariant,
    handleClearVariant,
    handleQuantityPrice,
    handleSelectImage,
    handleSelectInlineImage,
    handleGenerateCombination,
    handleBrandSearch,
    handleBrandsSelected
  } = useProductSubmit(id);

  const currency = globalSetting?.default_currency || "$";



  // const handleSearch = (e) => {
  //   console.log(brandOptions)
  //   const term = e.target.value;
  //   setSearchTerm(term);
  //   const filtered = brandOptions?.filter((item) =>
  //     item.name?.toLowerCase().includes(term?.toLowerCase())
  //   );
  //   setFilteredBrandOptions(filtered);
  // };
  function CustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new UploadAdapter(loader);
    };
  }
  function showCategoryModal() {
    setIsUpdateModalOpen(true);
  }
  const closeModalFunc = async (data) => {
    setIsUpdateModalOpen(false)
    if (data) {
      function filterUniqueChildren(categories, oldData) {
        
        for (let index = 0; index < categories.length; index++) {
          if (categories[index].children.length > 0) {
            filterUniqueChildren(categories[index]?.children, oldData[index].children);
          } else {
            if (JSON.stringify(categories[index]) !== JSON.stringify(oldData[index])) {
              console.log("unique Data found", categories[index]);
              setSelectedCategory((pre) => [
                ...pre,
                {
                  "id": categories[index]?.id,
                  "name": categories[index]?.name
                }
              ]);
              setDefaultCategory(() => [
                {
                  id: categories[index]?.id,
                  name: categories[index]?.name,
                },
              ]);
              return categories[index]
            }
          }

        }
      }

      let getAllCategories = await CategoryServices.getAllCategories();
      let uniqueChildrenCategories = await filterUniqueChildren(getAllCategories?.tree?.data, oldCategoryData);

      console.log(uniqueChildrenCategories);

    }
  }

  return (
    <>
      <Modal
        open={openModal}
        onClose={onCloseModal}
        center
        closeIcon={
          <div className="absolute top-0 right-0 text-red-500 focus:outline-none active:outline-none text-xl border-0">
            <FiX className="text-3xl" />
          </div>
        }
      >
        <div className="cursor-pointer">
          <UploaderThree
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            handleSelectImage={handleSelectImage}
          />
        </div>
      </Modal>
      {isUpdateModalOpen ? (
        <CategoryModal
          handleConfirmUpdate={isUpdateModalOpen}
          closeModal={closeModalFunc}
        />
      ) : null}
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">

        {id ? (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={t("UpdateProduct")}
            description={t("UpdateProductDescription")}
          />
        ) : (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={t("DrawerAddProduct")}
            description={t("AddProductDescription")}
          />
        )}
      </div>

      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-700">
        <SwitchToggleForCombination
          product
          handleProcess={handleIsCombination}
          processOption={isCombination}
        />

        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <ActiveButton
              tapValue={tapValue}
              activeValue="Basic Info"
              handleProductTap={handleProductTap}
            />
          </li>

          {isCombination && (
            <li className="mr-2">
              <ActiveButton
                tapValue={tapValue}
                activeValue="Combination"
                handleProductTap={handleProductTap}
              />
            </li>
          )}
        </ul>
      </div>

      <Scrollbars className="track-horizontal thumb-horizontal w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="block" id="block">
          {tapValue === "Basic Info" && (
            <div className="px-6 pt-8 flex-grow w-full h-full max-h-full pb-40 md:pb-32 lg:pb-32 xl:pb-32">
              {/* <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProductID")} />
                <div className="col-span-8 sm:col-span-4">{productId}</div>
              </div> */}
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProductTitleName")} />
                <div className="col-span-8 sm:col-span-4">
                  <Input
                    {...register(`title`, {
                      required: "TItle is required!",
                    })}
                    className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                    name="title"
                    type="text"
                    placeholder={t("ProductTitleName")}
                    onBlur={(e) => handleProductSlug(e.target.value)}
                  />
                  <Error errorName={errors.title} />
                </div>
              </div>
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProductDescription")} />
                <div className="col-span-8 sm:col-span-4">
                  <CKEditor
                    type=""
                    editor={ClassicEditor}
                    config={{
                      extraPlugins: [CustomUploadAdapterPlugin],            
                      toolbar: ['heading', '|', 'bold', 'italic', 'blockQuote', 'link', 'numberedList', 'bulletedList', 'imageUpload', 'imageStyle:full',
                        'imageStyle:alignLeft',
                        'imageStyle:alignCenter',
                        'imageStyle:alignRight', 'insertTable',
                        'tableColumn', 'tableRow', 'mergeTableCells', 'mediaEmbed', '|', 'undo', 'redo', 'Subscript'],//'imageUpload','underline', 'strikethrough', 'code', 'subscript', 'superscript'
                      heading: {
                        options: [
                          { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                          { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                          { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                          { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                          { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                          { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                          { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
                        ]
                      },
                    }}

                    data={defaultContent ? defaultContent : ""}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      handleEditorChange(data);
                    }}
                    style={{ height: '500px' }} 
                  />
                  <Error errorName={errors.description} />
                </div>
              </div>
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProductImage")} />
                <div className="col-span-8 sm:col-span-4">
                  <Uploader
                    product
                    folder="product"
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                    method={id ? "update" : "add"}
                    id={id ? id : ""}
                  />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProductSKU")} />
                <div className="col-span-8 sm:col-span-4">
                  <InputArea
                    register={register}
                    required="false"
                    label={t("ProductSKU")}
                    name="sku"
                    type="text"
                    placeholder={t("ProductSKU")}
                  />
                  <Error errorName={errors.sku} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProductBarcode")} />
                <div className="col-span-8 sm:col-span-4">
                  <InputArea
                    register={register}
                    required="false"
                    label={t("ProductBarcode")}
                    name="barcode"
                    type="text"
                    placeholder={t("ProductBarcode")}
                  />
                  <Error errorName={errors.barcode} />
                </div>
              </div>
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Brand" />
                <div className="col-span-8 sm:col-span-4">
                  <input
                    type="text"
                    placeholder="Search Brands... "
                    value={searchTerm.brandName}
                    onChange={handleBrandSearch}
                    className="border react-tag-input__input  h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white  "
                    style={{ border: "1px solid #ccc" }}
                  />
                  <ul>
                    {filteredBrandOptions?.map((item, index) => (
                      <li key={index} onClick={() => handleBrandsSelected(item)} style={{ padding: 5 }}>
                        {item.name}
                      </li>
                    ))}
                  </ul>
                  <Error errorName={errors.barcode} />
                </div>
              </div>

              {/* <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("Category")} />
                <div className="col-span-8 sm:col-span-4">
                  <ParentCategory
                    lang={language}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    setDefaultCategory={setDefaultCategory}
                  />
                </div>
              </div> */}
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("Category")} />
                <div className="col-span-8 sm:col-span-4 grid grid-cols-2 gap-3">
                  <div>
                    <ParentCategory
                      lang={language}
                      selectedCategory={selectedCategory}
                      setSelectedCategory={setSelectedCategory}
                      setDefaultCategory={setDefaultCategory}
                    />
                  </div>
                  <div>
                    <Button onClick={showCategoryModal} className="rounded-md h-12 w-full">
                      <span className="mr-2">
                        <FiPlus />
                      </span>

                      {t("AddCategory")}
                    </Button>
                  </div>
                </div>
              </div>


              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6" style={{ display: 'none' }}>
                <LabelArea label={t("DefaultCategory")} />
                <div className="col-span-8 sm:col-span-4">
                  <Multiselect
                    displayValue="name"
                    isObject={true}
                    singleSelect={true}
                    ref={resetRefTwo}
                    hidePlaceholder={true}
                    onKeyPressFn={function noRefCheck() { }}
                    onRemove={function noRefCheck() { }}
                    onSearch={function noRefCheck() { }}
                    onSelect={(v) => setDefaultCategory(v)}
                    selectedValues={defaultCategory}
                    options={selectedCategory}
                    placeholder={"Default Category"}
                  ></Multiselect>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Product Price" />
                <div className="col-span-8 sm:col-span-4">
                  <InputValue
                    register={register}
                    maxValue={2000}
                    minValue={1}
                    label="Original Price"
                    name="originalPrice"
                    type="number"
                    placeholder="OriginalPrice"
                    defaultValue={0.0}
                    required="false"
                    product
                    currency={currency}
                  />
                  <Error errorName={errors.originalPrice} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("SalePrice")} />
                <div className="col-span-8 sm:col-span-4">
                  <InputValue
                    product
                    register={register}
                    minValue={0}
                    defaultValue={0.0}
                    required="false"
                    label="Sale price"
                    name="price"
                    type="number"
                    placeholder="Sale price"
                    currency={currency}
                  />
                  <Error errorName={errors.price} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 relative">
                <LabelArea label={t("ProductQuantity")} />
                <div className="col-span-8 sm:col-span-4">
                  <InputValueFive
                    register={register}
                    minValue={0}
                    defaultValue={0}
                    label="Quantity"
                    name="stock"
                    type="number"
                    placeholder={t("ProductQuantity")}
                  />
                  <Error errorName={errors.quantity} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProductSlug")} />
                <div className="col-span-8 sm:col-span-4">
                  <Input
                    {...register(`slug`, {
                      required: "slug is required!",
                    })}
                    className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                    name="slug"
                    type="text"
                    defaultValue={slug}
                    placeholder={t("ProductSlug")}
                    onBlur={(e) => handleProductSlug(e.target.value)}
                  />
                  <Error errorName={errors.slug} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProductTag")} />
                <div className="col-span-8 sm:col-span-4">
                  <ReactTagInput
                    placeholder={t("ProductTagPlaseholder")}
                    tags={tag}
                    onChange={(newTags) => setTag(newTags)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Visitor Counter" />
                <div className="col-span-8 sm:col-span-4">
                <Input
                    {...register(`visitors_counter`, {
                      required: "Visitor Count is required!",
                    })}
                    className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                    name="visitors_counter"
                    type="number"
                    placeholder={"Visitor Count is required!"}
                    // onBlur={(e) => handleProductSlug(e.target.value)}
                  />
                  <Error errorName={errors.visitors_counter} />
                </div>
              </div>
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("Published")} />
                <div className="col-span-8 sm:col-span-4">
                  <SwitchToggle
                    handleProcess={setPublished}
                    processOption={published}
                  />
                </div>
              </div>
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("Apply Tax")} />
                <div className="col-span-8 sm:col-span-4">
                  <SwitchToggle
                    handleProcess={setAddTax}
                    processOption={addTax}
                  />
                </div>
              </div>
            </div>
          )}

          {tapValue === "Combination" &&
            isCombination &&
            (attribue.length < 1 ? (
              <div
                className="bg-teal-100 border border-teal-600 rounded-md text-teal-900 px-4 py-3 m-4"
                role="alert"
              >
                <div className="flex">
                  <div className="py-1">
                    <svg
                      className="fill-current h-6 w-6 text-teal-500 mr-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm">
                      {t("AddCombinationsDiscription")}{" "}
                      <Link to="/attributes" className="font-bold">
                        {t("AttributesFeatures")}
                      </Link>
                      {t("AddCombinationsDiscriptionTwo")}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6">
                {/* <h4 className="mb-4 font-semibold text-lg">Variants</h4> */}
                <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-3 md:gap-3 xl:gap-3 lg:gap-2 mb-3">
                  <MultiSelect
                    options={attTitle}
                    value={attributes}
                    onChange={(v) => handleAddAtt(v)}
                    labelledBy="Select"
                  />

                  {attributes?.map((attribute, i) => (
                    <div key={attribute._id}>
                      <div className="flex w-full h-10 justify-between font-sans rounded-tl rounded-tr bg-gray-200 px-4 py-3 text-left text-sm font-normal text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                        {"Select"}
                        {showingTranslateValue(attribute?.title, language)}
                      </div>

                      <AttributeOptionTwo
                        id={i + 1}
                        values={values}
                        lang={language}
                        attributes={attribute}
                        setValues={setValues}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mb-6">
                  {attributes?.length > 0 && (
                    <Button
                      onClick={handleGenerateCombination}
                      type="button"
                      className="mx-2"
                    >
                      <span className="text-xs">{t("GenerateVariants")}</span>
                    </Button>
                  )}

                  {variantTitle.length > 0 && (
                    <Button onClick={handleClearVariant} className="mx-2">
                      <span className="text-xs">{t("ClearVariants")}</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}

          {isCombination ? (
            <DrawerButton
              id={id}
              save
              title="Product"
              isSubmitting={isSubmitting}
              handleProductTap={handleProductTap}
            />
          ) : (
            <DrawerButton id={id} title="Product" isSubmitting={isSubmitting} />
          )}

          {tapValue === "Combination" && (
            <DrawerButton id={id} title="Product" isSubmitting={isSubmitting} />
          )}
        </form>

        {tapValue === "Combination" &&
          isCombination &&
          variantTitle.length > 0 && (
            <div className="px-6">
              {/* {variants?.length >= 0 && ( */}
              {isCombination && (
                <TableContainer className="md:mb-32 mb-40 rounded-b-lg">
                  <Table>
                    <TableHeader>
                      <tr>
                        <TableCell>{t("Image")}</TableCell>
                        <TableCell>{t("Combination")}</TableCell>
                        <TableCell>{t("Sku")}</TableCell>
                        <TableCell>{t("Barcode")}</TableCell>
                        <TableCell>{t("Price")}</TableCell>
                        <TableCell>{t("SalePrice")}</TableCell>
                        <TableCell>{t("QuantityTbl")}</TableCell>
                        <TableCell className="text-right">
                          {t("Action")}
                        </TableCell>
                      </tr>
                    </TableHeader>

                    <AttributeListTable
                      lang={language}
                      variants={variants}
                      setTapValue={setTapValue}
                      variantTitle={variantTitle}
                      isBulkUpdate={isBulkUpdate}
                      handleSkuBarcode={handleSkuBarcode}
                      handleEditVariant={handleEditVariant}
                      handleRemoveVariant={handleRemoveVariant}
                      handleQuantityPrice={handleQuantityPrice}
                      handleSelectInlineImage={handleSelectInlineImage}
                    />
                  </Table>
                </TableContainer>
              )}
            </div>
          )}
      </Scrollbars>
    </>
  );
};

export default React.memo(ProductDrawer);
