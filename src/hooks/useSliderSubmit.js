import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { SidebarContext } from 'context/SidebarContext';
import { notifyError, notifySuccess } from 'utils/toast';
import SliderServices from 'services/SliderServices';

const useSliderSubmit = (id) => {
  const { isDrawerOpen, closeDrawer, setIsUpdate, lang } =
    useContext(SidebarContext);
  const [imageUrl, setImageUrl] = useState('');
  const [language, setLanguage] = useState(lang);
  const [resData, setResData] = useState({});
  const [published, setPublished] = useState(false);
  const [discountType, setDiscountType] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const settings = useSelector((state) => state.setting);
  const { settingItem } = settings;

  const globalSetting = settingItem.find(
    (value) => value.name === 'globalSetting'
  );
  const currency = globalSetting?.default_currency || '$';

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log('Slider data', data)
    console.log("imageUrl",imageUrl)
    try {
      setIsSubmitting(true);
      let formData = new FormData();

      // formData.append("id", id ? id : '');
      formData.append(`id`, id ? id : '')
      formData.append(`heading`, data?.title);
      formData.append(`content`, data?.content);
      formData.append(`contentPosition`, data?.option);
      formData.append(`buttonLabel`, data?.buttonLabel);
      formData.append(`buttonUrl`, data?.buttonUrl);
   
      await Promise.all(imageUrl.map(async (image, index) => {
        if (image.preview) {
          const response = await fetch(image.preview);
          const blob = await response.blob();
          const file = new File([blob], image.name, { type: blob.type });
          formData.append(`image`, file, file.name);
        }

      }));


      console.log("formData", formData)
      if (id) {
        const res = await SliderServices.addSliders(formData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      } else {
        const res = await SliderServices.addSliders(formData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      }
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err.message);
      setIsSubmitting(false);
      closeDrawer();
    }
  };

  const handleSelectLanguage = (lang) => {
    console.log('lang======================', lang)
    setLanguage(lang);
    if (Object.keys(resData).length > 0) {
      setValue('title', resData.title[lang ? lang : 'en']);
    }
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      setResData({});
      setValue('title');
      setValue('content');
      setValue('option');
      setValue('buttonLabel');
      setValue('buttonUrl');

      setImageUrl('');
      clearErrors('title');
      clearErrors('content');
      clearErrors('option');
      clearErrors('buttonLabel');
      clearErrors('buttonUrl');
      setLanguage(lang);
      setValue('language', language);
      return;
    }

    if (id) {
      (async () => {
        try {
          const res = await SliderServices.getSliderById(id);
          if (res) {
            console.log('res coupon', res);
            setResData(res.data);
            // setImageUrl(res?.data?.image)
            setValue('title', res?.data.heading);
            setValue('content', res?.data?.content);
            setValue('option', res?.data?.content_position);
            setValue('buttonLabel', res.data.button_label);
            setValue('buttonUrl', res.data.button_url);
            const { image: imagesData } = res.data || {}; // Destructure directly from res.data
            if (imagesData) {
              const imageNames = Array.isArray(imagesData) ? imagesData : [imagesData]; // Ensure it's an array
              setImageUrl(imageNames); // Set the image URLs
            }
            // setPublished(res.status === 'show' ? true : false);

            // setImageUrl(res.logo);
          }
        } catch (err) {
          notifyError(err ? err?.response?.data?.message : err.message);
        }
      })();
    }
  }, [id, setValue, isDrawerOpen, clearErrors, language, lang]);

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    setImageUrl,
    imageUrl,
    published,
    setPublished,
    currency,
    discountType,
    isSubmitting,
    setDiscountType,
    handleSelectLanguage,
  };
};

export default useSliderSubmit;
