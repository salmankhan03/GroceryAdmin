import { TableBody, TableCell, TableRow } from "@windmill/react-ui";
import AttributeChildDrawer from "components/drawer/AttributeChildDrawer";
import MainDrawer from "components/drawer/MainDrawer";
import CheckBox from "components/form/CheckBox";
import DeleteModal from "components/modal/DeleteModal";
import EditDeleteButton from "components/table/EditDeleteButton";
import ShowHideButton from "components/table/ShowHideButton";
import useToggleDrawer from "hooks/useToggleDrawer";
import React from "react";
import { showingTranslateValue } from "utils/translate";

const ChildAttributeTable = ({
  att,
  childAttributes,
  isCheck,
  setIsCheck,
  lang,
  loading,
}) => {
  console.log(lang);
  console.log("att", att);
  console.log("childAttributes", childAttributes);


  const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();

  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, JSON.parse(id)]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== JSON.parse(id)));
    }
  };


  return (
    <>
      {isCheck.length < 1 && <DeleteModal id={serviceId} title={title} />}

      {isCheck.length < 2 && (
        <MainDrawer>
          <AttributeChildDrawer id={serviceId} />
        </MainDrawer>
      )}

      <TableBody>
        {childAttributes?.map((attribute, index) => (
          <TableRow key={index + 1}>
            <TableCell>
              <CheckBox
                type="checkbox"
                name="child-attribute"
                id={attribute.id}
                handleClick={handleClick}
                isChecked={isCheck?.includes(attribute.id)}
              />
            </TableCell>
            <TableCell className="font-semibold uppercase text-xs">
              {attribute?.id}
            </TableCell>

            <TableCell className="font-medium text-sm">
              {attribute?.name}
            </TableCell>

            {/* <TableCell className="font-medium text-sm">{attribute?.type}</TableCell> */}

            <TableCell className="text-center">
              <ShowHideButton id={attribute.id} status={attribute.status} />
            </TableCell>

            <TableCell>
              <EditDeleteButton
                id={attribute.id}
                isCheck={isCheck}
                setIsCheck={setIsCheck}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                title={attribute.name}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default ChildAttributeTable;
