import { Avatar, TableBody, TableCell, TableRow } from "@windmill/react-ui";
import { Link } from "react-router-dom";

//internal import
import { IoRemoveSharp } from "react-icons/io5";
import useToggleDrawer from "hooks/useToggleDrawer";
import DeleteModal from "components/modal/DeleteModal";
import MainDrawer from "components/drawer/MainDrawer";
import CategoryDrawer from "components/drawer/CategoryDrawer";
import CheckBox from "components/form/CheckBox";
import ShowHideButton from "components/table/ShowHideButton";
import EditDeleteButton from "components/table/EditDeleteButton";
import { showingTranslateValue } from "utils/translate";

const CategoryTable = ({
  data,
  lang,
  isCheck,
  categories,
  setIsCheck,
  useParamId,
  showChild,
  categoriesList
}) => {
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
      {isCheck?.length < 1 && (
        <DeleteModal useParamId={useParamId} id={serviceId} title={title} />
      )}

      <MainDrawer>
        <CategoryDrawer id={serviceId} data={data?.list} categoriesList={data} lang={lang} />
      </MainDrawer>

      <TableBody>
        {categoriesList?.map((category) =>(
          <TableRow key={category.id}>
            <TableCell>
              <CheckBox
                type="checkbox"
                name="category"
                id={category?.id}
                handleClick={handleClick}
                isChecked={isCheck?.includes(category?.id)}
              />
            </TableCell>

            <TableCell className="font-semibold uppercase text-xs">
            {category?.id}
              {/* {category?.id?.substring(20, 24)} */}
            </TableCell>
            <TableCell>
              {category?.category_image.length > 0? (
                <Avatar
                  className="hidden mr-3 md:block bg-gray-50 p-1"
                  src={category?.category_image[0]?.name}
                  alt={category?.parent}
                />
              ) : (
                <Avatar
                  src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                  alt="product"
                  className="hidden p-1 mr-2 md:block bg-gray-50 shadow-none"
                />
              )}
            </TableCell>
            
            <TableCell className="font-medium text-sm ">
              {category?.children?.length > 0 ? (
                <Link
                  to={`/categories/${category?.id}`}
                  className="text-blue-700"
                >
                  {category?.name}

                  <>
                    {showChild && (
                      <>
                        {" "}
                        <div className="pl-2 ">
                          {category?.children?.map((child) => (
                            <div key={child.id}>
                              {/* <Link
                                to={`/categories/${child?.id}`}
                                className="text-blue-700"
                              > */}
                                <div className="flex text-xs items-center  text-blue-800">
                                  <span className=" text-xs text-gray-500 pr-1">
                                    <IoRemoveSharp />
                                  </span>
                                  <span className="text-gray-500">
                                    {child.name}
                                  </span>
                                </div>
                              {/* </Link> */}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                </Link>
              ) : (
                <span>{category?.name}</span>
              )}
            </TableCell>
            <TableCell className="text-sm">
            {category?.description}
            </TableCell>

            <TableCell className="text-center">
              <ShowHideButton
                id={category?.id}
                category
                status={category?.status}
                data={category}
              />
            </TableCell>
            <TableCell>
              <EditDeleteButton
                id={category?.id}
                parent={category}
                isCheck={isCheck}
                children={category?.children}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                title={showingTranslateValue(category?.name, lang)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default CategoryTable;
