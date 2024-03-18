import { Avatar, TableBody, TableCell, TableRow } from "@windmill/react-ui";
import React from "react";
import useToggleDrawer from "hooks/useToggleDrawer";
import StaffDrawer from "components/drawer/RoleDrawer";
import DeleteModal from "components/modal/DeleteModal";
import EditDeleteButton from "components/table/EditDeleteButton";
import MainDrawer from "components/drawer/MainDrawer";
import { showingTranslateValue } from "utils/translate";
import useFilter from "hooks/useFilter";

const RoleTable = ({ staffs, lang }) => {
  const {
    title,
    serviceId,
    handleModalOpen,
    handleUpdate,
    isSubmitting,
    handleResetPassword,
  } = useToggleDrawer();

  const { globalSetting } = useFilter();

  return (
    <>
      <DeleteModal id={serviceId} title={title} />

      <MainDrawer>
        <StaffDrawer id={serviceId} />
      </MainDrawer>

      <TableBody>
        {staffs?.map((staff) => (
          <TableRow key={staff.id}>
            <TableCell>
                <div className="flex items-center">
                  <h2 className="text-sm font-medium">
                    {staff?.name}
                  </h2>
                </div>
            </TableCell>

            <TableCell>
              <EditDeleteButton
                id={staff.id}
                staff={staff}
                isSubmitting={isSubmitting}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                handleResetPassword={handleResetPassword}
                title={showingTranslateValue(staff?.name, lang)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default RoleTable;
