import {
  Avatar,
  Badge,
  TableBody,
  TableCell,
  TableRow,
} from "@windmill/react-ui";
import BrandDrawer from "components/drawer/BrandDrawer";
import MainDrawer from "components/drawer/MainDrawer";
import CheckBox from "components/form/CheckBox";
import DeleteModal from "components/modal/DeleteModal";
import EditDeleteButton from "components/table/EditDeleteButton";
import ShowHideButton from "components/table/ShowHideButton";
import useToggleDrawer from "hooks/useToggleDrawer";
import { showingTranslateValue } from "utils/translate";

//internal import

const BrandTable = ({ brands, isCheck, setIsCheck, lang }) => {
  const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();
  // console.log("Brands ===> ", brands)

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
            <BrandDrawer id={serviceId} data={brands} brandList={brands} lang={lang} />
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
                {product?.name?.substring(0, 28)}
              </h2>
            </TableCell>

            {/* <TableCell className="text-sm">
            {product?.description}
            </TableCell> */}
            <TableCell className="text-center">
              <ShowHideButton
                id={product?.id}
                product
                status={product?.is_active}
                data={product}
              />
            </TableCell>
            {/* <TableCell >
              <Link
                to={`/product/${product.id}`}
                className="flex justify-center text-gray-400 hover:text-green-600"
              >
                <Tooltip
                  id="view"
                  Icon={FiZoomIn}
                  title={t("DetailsTbl")}
                  bgColor="#10B981"
                />
              </Link>
            </TableCell> */}
            <TableCell>
            {product.id !== 11 ? (
              <EditDeleteButton
                id={product.id}
                product={product}
                isCheck={isCheck}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                title={showingTranslateValue(product?.title, lang)}
              />
            ):null}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default BrandTable;
