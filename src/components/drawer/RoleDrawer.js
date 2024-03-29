import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Card, CardBody, Input } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import useRoleSubmit from "hooks/useRoleSubmit";
import Title from "components/form/Title";
import LabelArea from "components/form/LabelArea";
import InputArea from "components/form/InputArea";
import Error from "components/form/Error";
import DrawerButton from "components/form/DrawerButton";


const RoleDrawer = ({ id }) => {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    handleSelectLanguage,
  } = useRoleSubmit(id);
  const { t } = useTranslation();

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={t("Update Role")}
            description={"Updated your role necessary information from here"}
          />
        ) : (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={"Add Role"}
            description={t("Add your role necessary information from here")}
          />
        )}
      </div>
      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <Card className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-full">
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full pb-40">

                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Name" />
                  <div className="col-span-8 sm:col-span-4">
                    <InputArea
                      register={register}
                      label="Name"
                      name="name"
                      type="text"
                      placeholder="Role name"
                    />
                    <Error errorName={errors.name} />
                  </div>
                </div>
              </div>

              <DrawerButton id={id} title="role" />
            </form>
          </CardBody>
        </Card>
      </Scrollbars>
    </>
  );
};

export default RoleDrawer;
