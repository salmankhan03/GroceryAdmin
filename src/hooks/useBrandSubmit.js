import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SidebarContext } from "context/SidebarContext";
import { notifyError, notifySuccess } from "utils/toast";
import BrandServices from "services/BrandServices";

const useBrandSubmit = (id, data) => {
  const { isDrawerOpen, closeDrawer, setIsUpdate, lang } =
    useContext(SidebarContext);
  const [resData, setResData] = useState({});
  const [checked, setChecked] = useState("");
  const [language, setLanguage] = useState(lang);
  const [published, setPublished] = useState(true);
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
    try {
      setIsSubmitting(true);
      const brandData = {
        id: id ? id: '',
        name:name,
        is_active: published ? 1 : 0
      };


      if (id) {
        const res = await BrandServices.addUpdateBrand(brandData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
        reset();
      } else {
        const res = await BrandServices.addUpdateBrand(brandData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
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
    if (!isDrawerOpen) {
      setResData({});
      setValue("name");
      setPublished(true);
      clearErrors("name");
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
          const res = await BrandServices.getBrandById(id);
     
          if (res) {
            setResData(res.data);
            setValue("name", res.data.name);//[language ? language : "en"]
            setPublished(res.data.is_active === 1 ? true : false);
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
    published,
    setPublished,
    checked,
    setChecked,
    isSubmitting,
    handleSelectLanguage,
  };
};

export default useBrandSubmit;
