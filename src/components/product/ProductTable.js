import {
  Avatar,
  Badge,
  TableBody,
  TableCell,
  TableRow,
} from "@windmill/react-ui";
import MainDrawer from "components/drawer/MainDrawer";
import ProductDrawer from "components/drawer/ProductDrawer";
import CheckBox from "components/form/CheckBox";
import DeleteModal from "components/modal/DeleteModal";
import EditDeleteButton from "components/table/EditDeleteButton";
import ShowHideButton from "components/table/ShowHideButton";
import Tooltip from "components/tooltip/Tooltip";
import useToggleDrawer from "hooks/useToggleDrawer";
import { t } from "i18next";
import { FiZoomIn } from "react-icons/fi";
import { Link } from "react-router-dom";
import { showingTranslateValue } from "utils/translate";

//internal import

const ProductTable = ({ products, isCheck, setIsCheck, currency, lang }) => {
  const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();

  const handleClick = (e) => {
    const { id, checked } = e.target;
    console.log("id", id, checked);

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
          <ProductDrawer currency={currency} id={serviceId} />
        </MainDrawer>
      )}

      <TableBody>
        {products?.map((product, i) =>(
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

            <TableCell>
              <div className="flex items-center">
                {product?.images[0] ? (
                  <Avatar
                    className="hidden p-1 mr-2 md:block bg-gray-50 shadow-none"
                    src={product?.images[0]?.name}
                    alt="product"
                  />
                ) : (
                  <Avatar
                    src={`https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png`}
                    alt="product"
                  />
                )}
                <div>
                  <h2 className="text-sm font-medium">
                    {product?.name.substring(0,28)}
                  </h2>
                </div>
              </div>
            </TableCell>

            {/* <TableCell>
              <span className="text-sm">
                {product?.category}
              </span>
            </TableCell> */}

            <TableCell>
              <span className="text-sm font-semibold">
                {currency}
                {Number(product?.price).toFixed(2)}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm font-semibold">
                {currency}
                {Number(product?.sell_price).toFixed(2)}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm">{product.quantity}</span>
            </TableCell>
            <TableCell>
              {product.quantity > 0 ? (
                <Badge type="success">{t("Selling")}</Badge>
              ) : (
                <Badge type="danger">{t("SoldOut")}</Badge>
              )}
            </TableCell>
            <TableCell>
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
            </TableCell>
            <TableCell className="text-center">
              <ShowHideButton id={product.id} status={product.status} data={product}/>
              {/* {product.status} */}
            </TableCell>
            <TableCell>
              <EditDeleteButton
                id={product.id}
                product={product}
                isCheck={isCheck}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                title={showingTranslateValue(product?.title, lang)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default ProductTable;
