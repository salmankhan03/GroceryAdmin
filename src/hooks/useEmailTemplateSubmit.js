import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SidebarContext } from "context/SidebarContext";
import { notifyError, notifySuccess } from "utils/toast";
import StaticPageServices from "services/StaticPageServices";
import EmailTemplateServices from "services/EmailTemplateServices";

const useEmailTemplatePageSubmit = (id, data) => {
  const { isDrawerOpen, closeDrawer, setIsUpdate, lang } =
    useContext(SidebarContext);
  const [resData, setResData] = useState({});
  const [checked, setChecked] = useState("");
  const [language, setLanguage] = useState(lang);
  const [published, setPublished] = useState(true);
  const [templatesContent, setTemplatesContent] = useState();
  const [defaultContent, setDefaultContent] = useState()
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
      // console.log(atob(templatesContent))
      // console.log(atob(defaultContent))
      setIsSubmitting(true);
      var encodedString = btoa(templatesContent);

      const templatesData = {
        id: id ? id: '',
        name:name,
        body: encodedString,
        from_email:"",
        to_email:''
      };

      if (id) {
        const res = await EmailTemplateServices.addUpdateEmailTemplates(templatesData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
        reset();
      } else {
        const res = await EmailTemplateServices.addUpdateEmailTemplates(templatesData);
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

  const handleEditorChange = (data) => {
    var encodedString = btoa(data);
    setTemplatesContent(encodedString);
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
          const res = await EmailTemplateServices.getTemplatesById(id);
          console.log(res)
          if (res) {
            console.log(res.data)
            var decodeString = atob(res?.data?.body)
            console.log("decodeString",decodeString);
            setResData(res.data);
            setValue("name", res.data.name);//[language ? language : "en"]
            setDefaultContent(decodeString)
            // setTemplatesContent(decodeString)
          }
        } catch (err) {
          notifyError(err ? err.response.data.message : err.message);
        }
      })();
    }
  }, [id, setValue, isDrawerOpen, language, clearErrors, data, lang]);

  return {
    register,
    defaultContent, 
    setDefaultContent,
    templatesContent,
    setTemplatesContent,
    handleSubmit,
    onSubmit,
    handleEditorChange,
    errors,
    published,
    setPublished,
    checked,
    setChecked,
    isSubmitting,
    handleSelectLanguage,
  };
};

export default useEmailTemplatePageSubmit;
