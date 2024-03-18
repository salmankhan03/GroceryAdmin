import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";

import { AdminContext } from "context/AdminContext";
import { SidebarContext } from "context/SidebarContext";
import RoleServices from "services/RoleServices";
import { notifyError, notifySuccess } from "utils/toast";

const useRoleSubmit = (id) => {
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;
  const { isDrawerOpen, closeDrawer, setIsUpdate, lang } =
    useContext(SidebarContext);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    dayjs(new Date()).format("YYYY-MM-DD")
  );
  const [language, setLanguage] = useState(lang);
  const [resData, setResData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const location = useLocation();

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      let formData = new FormData();
      formData.append("id", id ? id: "");
      formData.append("name", data.name);


      if (id) {
        // console.log('id is ',id)
        const res = await RoleServices.addRole(formData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      } else {
        const res = await RoleServices.addRole( formData );
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      }
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
      setIsSubmitting(false);
      closeDrawer();
    }
  };

  const getStaffData = async () => {
    try {
      const res = await RoleServices.getRoleById(id);

      console.log('res-----------------', res.role)
      if (res) {
        setResData(res);
        setValue("name", res.role.name);
      }
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
    }
  };

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);

    if (Object.keys(resData).length > 0) {
      setValue("name", resData.name[lang ? lang : "en"]);
    }
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      setResData({});
      setValue("name");
      clearErrors("name");
      return;
    }
    if (id) {
      getStaffData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setValue, isDrawerOpen, clearErrors]);

  return {
    register,
    handleSubmit,
    onSubmit,
    language,
    errors,
    setImageUrl,
    imageUrl,
    selectedDate,
    setSelectedDate,
    isSubmitting,
    handleSelectLanguage,
  };
};

export default useRoleSubmit;
