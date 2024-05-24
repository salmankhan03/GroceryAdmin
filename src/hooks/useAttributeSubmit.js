import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

//internal import
import { SidebarContext } from '../context/SidebarContext';
import AttributeServices from '../services/AttributeServices';
import { notifyError, notifySuccess } from '../utils/toast';
import useToggleDrawer from './useToggleDrawer';

const useAttributeSubmit = (id) => {
  const location = useLocation();
  const { isDrawerOpen, closeDrawer, setIsUpdate, lang } =
    useContext(SidebarContext);
  const [variants, setVariants] = useState([]);
  const [language, setLanguage] = useState(lang);
  const [resData, setResData] = useState({});
  const [published, setPublished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setServiceId } = useToggleDrawer();

  let variantArrayOfObject = [];

  for (let i = 0; i < variants?.length; i++) {
    console.log("variants",variants)
    variantArrayOfObject = [
      ...variantArrayOfObject,variants[i],
    ];
  }

  const {
    handleSubmit,
    register,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ title, name, option }) => {
    try {
      setIsSubmitting(true);
      if (!id) {
        if (variants.length === 0) {
          notifyError('Minimum one value is required for add attribute!');
          return;
        }
      }
      console.log(variantArrayOfObject);
      const attributeData = {
        id:id ? id :null,
        title: title,
        name: name,
        variants: variantArrayOfObject,
        option: option,
        status:true,
      };

      console.log("attributeData", attributeData);

      if (id) {
        const res = await AttributeServices.updateAttributes(attributeData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
        setServiceId();
      } else {
        attributeData.variants = attributeData.variants.map(variant => ({name: variant}));
        const res = await AttributeServices.addAttribute(attributeData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
        setServiceId();
      }
    } catch (err) {
      notifyError(err ? err.response.data.message : err.message);
      closeDrawer();
      setIsSubmitting(false);
      setServiceId();
    }
  };

  // child attribute
  const onSubmits = async ({ name }) => {
    console.log(name)
    try {
      setIsSubmitting(true);
      let submitObj= {
        id:id? id :null,
        name: name,
        status: published ? 'show' : 'hide',
        product_attribute_id:JSON.parse(location.pathname.split('/')[2], id)
      }
      if (id) {
        const res = await AttributeServices.addChildAttribute(submitObj);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      } else {

       
        const res = await AttributeServices.addChildAttribute(submitObj);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      }
    } catch (err) {
      notifyError(err ? err.response.data.message : err.message);
      closeDrawer();
      setIsSubmitting(false);
      setServiceId();
    }
  };

  // const handleSelectLanguage = (lang) => {
  //   setLanguage(lang);
  // };

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);
    if (Object.keys(resData).length > 0) {
      setValue('title', resData.title[lang ? lang : 'en']);
      setValue('name', resData.name[lang ? lang : 'en']);
      // console.log('change lang', lang);
    }
  };

  const removeVariant = (indexToRemove) => {
    setVariants([...variants.filter((_, index) => index !== indexToRemove)]);
  };

  const addVariant = (e) => {
    e.preventDefault();
    if (e.target.value !== '') {
      setVariants([...variants, e.target.value]);
      e.target.value = '';
    }
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      setResData({});
      setValue('title');
      setValue('name');
      setValue('option');
      clearErrors('title');
      clearErrors('name');
      clearErrors('option');
      setVariants([]);
      setLanguage(lang);
      setValue('language', language);
      return;
    }

    if (location.pathname === '/attributes' && id) {
      (async () => {
        try {
          const res = await AttributeServices.getAttributeById(id);
          if (res?.status_code === 200) {
            console.log("res",res)
            setResData(res?.attribute);
            setValue('title', res?.attribute?.title);
            setValue('name', res?.attribute?.name);
            setValue('option', res?.attribute?.option);
            setVariants(res?.attribute?.variants)
          }
        } catch (err) {
          notifyError(err ? err?.response?.data?.message : err.message);
        }
      })();
    } else if (
      location.pathname === `/attributes/${location.pathname.split('/')[2]}`
    ) {
      (async () => {
        try {
          console.log("id",id)
          const res = await AttributeServices.getChildAttributeById(id);
          if (res) {
            // console.log('res child', res);
            setValue('name', res?.attributeValue?.name);
            setPublished(res?.attributeValue?.status === 'show' ? true : false);
          }
        } catch (err) {
          notifyError(err ? err?.response?.data?.message : err.message);
        }
      })();
    }
  }, [clearErrors, id, isDrawerOpen, setValue, location, language, lang]);

  return {
    handleSubmit,
    onSubmits,
    onSubmit,
    register,
    errors,
    variants,
    setVariants,
    addVariant,
    removeVariant,
    published,
    setPublished,
    isSubmitting,
    handleSelectLanguage,
  };
};

export default useAttributeSubmit;
