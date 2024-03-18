import DrawerButton from "components/form/DrawerButton";
import Error from "components/form/Error";
import InputArea from "components/form/InputArea";
import LabelArea from "components/form/LabelArea";
import SwitchToggle from "components/form/SwitchToggle";
import Title from "components/form/Title";
import useBrandSubmit from "hooks/useBrandSubmit";
import React from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useTranslation } from "react-i18next";
//internal import

const BrandDrawer = ({ id, data, brandList,lang}) => {
  const { t } = useTranslation();

  const {
    checked,
    register,
    onSubmit,
    handleSubmit,
    errors,
    published,
    setPublished,
    setChecked,
    handleSelectLanguage,
    isSubmitting,
  } = useBrandSubmit(id, data);


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


  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={t("UpdateBrand")}
            description={t("UpdateBrandDescription")}
          />
        ) : (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={t("AddBrand")}
            description={t("AddBrandDescription")}
          />
        )}
      </div>

      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 flex-grow scrollbar-hide w-full max-h-full pb-40">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("Name")} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Brand title"
                  name="name"
                  type="text"
                  placeholder={t("Brandtitle")}
                />
                <Error errorName={errors.name} />
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

          <DrawerButton id={id} title="Brand" isSubmitting={isSubmitting} />
        </form>
      </Scrollbars>
    </>
  );
};

export default BrandDrawer;
