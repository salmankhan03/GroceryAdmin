import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SidebarContext } from "context/SidebarContext";
import CategoryServices from "services/CategoryServices";
import { notifyError, notifySuccess } from "utils/toast";

const useCategorySubmit = (id, data) => {
  const { isDrawerOpen, closeDrawer, setIsUpdate, lang } =
    useContext(SidebarContext);
  const [resData, setResData] = useState({});
  const [categories, setCategories] = useState({});
  const [checked, setChecked] = useState("");
  const [imageUrl, setImageUrl] = useState([]);
  const [children, setChildren] = useState([]);
  const [language, setLanguage] = useState(lang);
  const [published, setPublished] = useState(true);
  const [selectCategoryName, setSelectCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();

  // console.log("lang", lang, language);

  const onSubmit = async ({ name, description }) => {
    console.log("checked", checked)
    console.log("selectCategoryName", selectCategoryName)

    try {
      console.log("checked", checked)

      setIsSubmitting(true);
      let formData = new FormData();
      formData.append("id", id ? id: "");
      formData.append("name", name);
      formData.append("description", description ? description :"");
      formData.append("parent_id", checked ? checked : "");
      formData.append("parentName", selectCategoryName ? selectCategoryName : "");
      formData.append("status", published ? "show" : "hide");
      const categoryData = {
        id: id ? id: "",
        name:name,
        description:description ? description :"",
        parent_id: checked ? checked : "",
        parentName: selectCategoryName ? selectCategoryName : "",
        status: published ? "show" : "hide"
      };

      await Promise.all(imageUrl.map(async (image, index) => {
        if(image.preview){
          const response = await fetch(image.preview);
          const blob = await response.blob();

          const file = new File([blob], image.name, { type: blob.type });

          formData.append(`image${index + 1}`, file, file.name);
        }
      }));

      console.log('category submit', categoryData);

      if (id) {
        const res = await CategoryServices.updateCategory(id, formData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
        reset();
      } else {
        const res = await CategoryServices.addCategory(formData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        // closeDrawer();
      }
    } catch (err) {
      setIsSubmitting(false);
      notifyError(err ? err?.response?.data?.message : err?.message);
      closeDrawer();
    }
  };

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);
    if (Object.keys(resData).length > 0) {
      setValue("name", resData.name[lang ? lang : "en"]);
      setValue("description", resData.description[lang ? lang : "en"]);
    }
  };

  useEffect(() => {
    console.log("useEffect CALL",data)
    if (!isDrawerOpen) {
      setResData({});
      setValue("name");
      setValue("parentId");
      setValue("parentName");
      setValue("description");
      setValue("icon");
      setImageUrl([]);
      setPublished(true);
      clearErrors("name");
      clearErrors("parentId");
      clearErrors("parentName");
      clearErrors("description");
      setSelectCategoryName("");
      setLanguage(lang);
      setValue("language", language);

      if (data !== undefined && data[0]?._id !== undefined) {
        setChecked(data[0]._id);
      }
      return;
    }
    if (id) {
      (async () => {
        try {
          const res = await CategoryServices.getCategoryById(id);
          const categoryListres = await CategoryServices.getAllCategories();
          console.log("categoryListres category", categoryListres);
          console.log("res category", res);
          if (categoryListres) {
            setCategories(categoryListres[0])
          }
          if (res) {
            setResData(res.category);
            setValue("name", res.category.name);//[language ? language : "en"]
            setValue(
              "description",
              res.category.description //[language ? language : "en"]
            );
            setValue("language", language);
            setValue("parentId", res.category.parent_id);
            setPublished(res.category.status === "show" ? true : false);
            setValue("parentName", res.parentName);
            setSelectCategoryName(res.parentName);
            setChecked(res.category.parent_id);
            {res.category.category_image.length > 0 && setImageUrl(res.category?.category_image && [res.category?.category_image[0]?.name]);}
          }
        } catch (err) {
          notifyError(err ? err.response.data.message : err.message);
        }
      })();
    }
  }, [id, setValue, isDrawerOpen, language, clearErrors, data, lang]);

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    imageUrl,
    setImageUrl,
    children,
    setChildren,
    published,
    setPublished,
    checked,
    setChecked,
    isSubmitting,
    selectCategoryName,
    setSelectCategoryName,
    handleSelectLanguage,
  };
};

export default useCategorySubmit;
