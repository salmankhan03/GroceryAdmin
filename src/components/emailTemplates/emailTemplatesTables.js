import {
    TableBody,
    TableCell,
    TableRow,
  } from "@windmill/react-ui";
import EmailTemplateDrawer from "components/drawer/EmailTemplateDrawer";
  import MainDrawer from "components/drawer/MainDrawer";
  import CheckBox from "components/form/CheckBox";
  import DeleteModal from "components/modal/DeleteModal";
  import EditDeleteButton from "components/table/EditDeleteButton";
  import ShowHideButton from "components/table/ShowHideButton";
  import useToggleDrawer from "hooks/useToggleDrawer";
  import { showingTranslateValue } from "utils/translate";
  
  //internal import
  
  const EmailTemplateTable = ({ brands, isCheck, setIsCheck, lang }) => {
    const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();
    console.log("Brands ===> ", brands)
  
    const handleClick = (e) => {
      const { id, checked } = e.target;
      // console.log("id", id, checked);
  
      setIsCheck([...isCheck, JSON.parse(id)]);
      if (!checked) {
        setIsCheck(isCheck.filter((item) => item !== JSON.parse(id)));
      }
    };
  
    return (
      <>
        {isCheck?.length < 1 && <DeleteModal id={serviceId} title={title} />}
  
        {isCheck?.length < 2 && (
          <MainDrawer>
              <EmailTemplateDrawer id={serviceId} data={brands} brandList={brands} lang={lang} />
          </MainDrawer>
        )}
        <TableBody>
          {brands?.map((product, i) => (
            <TableRow key={i + 1}>
              <TableCell>
                <CheckBox
                  type="checkbox"
                  name={product?.name}
                  id={product.id}
                  handleClick={handleClick}
                  isChecked={isCheck?.includes(product.id)}
                />
              </TableCell>
              <TableCell className="font-semibold uppercase text-xs">
                {product?.id}
              </TableCell>
              <TableCell className="font-semibold uppercase text-xs">
                <h2 className="text-sm font-medium">
                  {product?.name.substring(0, 28)}
                </h2>
              </TableCell>
              <TableCell>
              {/* {product.id !== 11 ? ( */}
                <EditDeleteButton
                  id={product.id}
                  product={product}
                  isCheck={isCheck}
                  handleUpdate={handleUpdate}
                  handleModalOpen={handleModalOpen}
                  title={showingTranslateValue(product?.title, lang)}
                />
              {/* ):null} */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </>
    );
  };
  
  export default EmailTemplateTable;
  