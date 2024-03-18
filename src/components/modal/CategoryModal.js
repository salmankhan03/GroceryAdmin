import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader, ModalFooter, Button, Input } from "@windmill/react-ui";
import DrawerButton from "components/form/DrawerButton";
import Error from "components/form/Error";
import InputArea from "components/form/InputArea";
import LabelArea from "components/form/LabelArea";
import SwitchToggle from "components/form/SwitchToggle";
import TextAreaCom from "components/form/TextAreaCom";
import Title from "components/form/Title";
import Uploader from "components/image-uploader/Uploader";
import useCategorySubmit from "hooks/useCategorySubmit";
import Tree from "rc-tree";
import Scrollbars from "react-custom-scrollbars-2";
import { useTranslation } from "react-i18next";
//internal import
import CategoryServices from "services/CategoryServices";
import { notifyError } from "utils/toast";
import "./categoryModal.css"
import spinnerLoadingImage from "assets/img/spinner.gif";
import useAsync from "hooks/useAsync";
import { useDispatch } from "react-redux";
import {addCatergory} from "../../redux/Actions/CategoryActions"

const CategoryModal = ({ handleConfirmUpdate, closeModal }) => {
    const dispatch = useDispatch();
    const { data, loading } = useAsync(CategoryServices.getAllCategory);
    const { data: getAllCategorie } = useAsync(CategoryServices.getAllCategories);

    const [isConfirmOpen, setConfirmOpen] = useState(handleConfirmUpdate);
    dispatch(addCatergory(getAllCategorie?.tree?.data));
    let id = undefined
    const { t } = useTranslation();
    const {
        addedCategoryName,
        checked,
        register,
        onSubmit,
        handleSubmit,
        errors,
        imageUrl,
        setImageUrl,
        published,
        setPublished,
        setChecked,
        selectCategoryName,
        setSelectCategoryName,
        handleSelectLanguage,
        isSubmitting,
    } = useCategorySubmit(id, data);

  

    const STYLE = `
      .rc-tree-child-tree {
        display: hidden;
      }
      .node-motion {
        transition: all .3s;
        overflow-y: hidden;
      }
    `;

    const motion = {
        motionName: "node-motion",
        motionAppear: false,
        onAppearStart: (node) => {
            return { height: 0 };
        },
        onAppearActive: (node) => ({ height: node.scrollHeight }),
        onLeaveStart: (node) => ({ height: node.offsetHeight }),
        onLeaveActive: () => ({ height: 0 }),
    };

    const renderCategories = (categories) => {
        let myCategories = [];
        if (categories) {
            for (let category of categories) {
                myCategories.push({
                    title: category.name,
                    key: category.id,
                    children:
                        category.children?.length > 0 && renderCategories(category.children),
                });
            }
        }
        return myCategories;
    };

    const findObject = (obj, target) => {
        return obj.id === target
            ? obj
            : obj?.children?.reduce(
                (acc, obj) => acc ?? findObject(obj, target),
                undefined
            );
    };

    const findObjectById = (data, targetId) => {
        for (const item of data) {
            if (item.id === targetId) {
                return item;
            }
            if (item.children) {
                const nestedResult = findObjectById(item.children, targetId);
                if (nestedResult) {
                    return nestedResult;
                }
            }
        }
        return null;
    };
    const handleSelect = async (key) => {
        // console.log('key', key, 'id', id);
        if (key === undefined) return;
        if (id) {
            const parentCategoryId = await CategoryServices.getCategoryById(key);

            if (id === key) {
                return notifyError("This can't be select as a parent category!");
            } else if (id === parentCategoryId.parent_id) {
                return notifyError("This can't be select as a parent category!");
            } else {
                if (key === undefined) return;
                setChecked(key);

                const obj = findObjectById(getAllCategorie?.tree?.data, key);;
                const result = findObject(obj, key);

                setSelectCategoryName(result?.name);
            }
        } else {
            if (key === undefined) return;
            setChecked(key);

            const foundObject = findObjectById(getAllCategorie?.tree?.data, key);
            const result = findObject(foundObject, key);

            setSelectCategoryName(result?.name);
        }
    };
    const handleCancel = () => {
        setConfirmOpen(false);
        closeModal();
    };
    useEffect(()=>{
        if(isSubmitting === true){
            setTimeout(() => {
                setConfirmOpen(false);
                closeModal(1);
              }, 2500);   
        }
    },[isSubmitting])

    return (
        <Modal isOpen={isConfirmOpen} className="customModalOpen">
            <ModalHeader className="stickyModalHeader">
                <div className="p-3 text-center">Add Category</div>
            </ModalHeader>

            <ModalBody className="pt-6 pb-4">
                    <div className="">

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="modalBodyHeight p-3 px-8 flex-grow scrollbar-hide w-full max-h-full">
                                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                    <LabelArea label={t("Name")} />
                                    <div className="col-span-8 sm:col-span-4">
                                        <InputArea
                                            register={register}
                                            label="Category title"
                                            name="name"
                                            type="text"
                                            placeholder={t("ParentCategoryPlaceholder")}
                                        />
                                        <Error errorName={errors.name} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                    <LabelArea label={t("Description")} />
                                    <div className="col-span-8 sm:col-span-4">
                                        <TextAreaCom
                                            required
                                            register={register}
                                            label="Description"
                                            name="description"
                                            type="text"
                                            placeholder="Category Description"
                                        />
                                        <Error errorName={errors.description} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                    <LabelArea label={t("ParentCategory")} />
                                    <div className="col-span-8 sm:col-span-4 relative">
                                        <Input
                                            readOnly
                                            {...register(`parent`, {
                                                required: false,
                                            })}
                                            name="parent"
                                            value={selectCategoryName ? selectCategoryName : ""}
                                            placeholder={t("ParentCategory")}
                                            type="text"
                                            className="border h-12 w-full text-sm focus:outline-none block bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                                        />

                                        <div className="draggable-demo capitalize">
                                            <style dangerouslySetInnerHTML={{ __html: STYLE }} />
                                            <Tree
                                                expandAction="click"
                                                treeData={renderCategories(getAllCategorie?.tree?.data)}
                                                selectedKeys={[checked]}
                                                onSelect={(v) => handleSelect(v[0])}
                                                motion={motion}
                                                animation="slide-up"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                    <LabelArea label={t("CategoryIcon")} />
                                    <div className="col-span-8 sm:col-span-4">
                                        <Uploader
                                            imageUrl={imageUrl}
                                            setImageUrl={setImageUrl}
                                            folder="category"
                                            category
                                            id={id ? id : ""}
                                        />
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
                            </div>
                            <div
                                className="grid gap-4 lg:gap-6 px-8 pb-2 xl:gap-6 md:flex xl:flex bg-gray-50 border-t border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                style={{ right: -50 }}
                            >
                                <div className="pt-3 flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                                    <Button
                                        onClick={handleCancel}
                                        className="h-12 bg-white w-full text-red-500 hover:bg-red-50 hover:border-red-100 hover:text-red-600 dark:bg-gray-700 dark:border-gray-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-red-700"
                                        layout="outline"
                                    >
                                        {t("CancelBtn")}
                                    </Button>
                                </div>

                                <div className="pt-3 flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                                    {isSubmitting ? (
                                        <Button disabled={true} type="button" className="w-full h-12">
                                            <img src={spinnerLoadingImage} alt="Loading" width={20} height={10} />{" "}
                                            <span className="font-serif ml-2 font-light">Processing</span>
                                        </Button>
                                    ) : (
                                        <Button type="submit" className="w-full h-12" s>
                                            {id ? (
                                                <span>
                                                    {"Update Category"}
                                                </span>
                                            ) : (
                                                <span>Add Category</span>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>

                        </form>
                    </div>


                

            </ModalBody>

        </Modal>
    );
};

export default CategoryModal;
