import combinate from "combinate";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import swal from "sweetalert";

//internal import
import useAsync from "./useAsync";
import { SidebarContext } from "context/SidebarContext";
import AttributeServices from "services/AttributeServices";
import ProductServices from "services/ProductServices";
import { notifyError, notifySuccess } from "utils/toast";
import SettingServices from "services/SettingServices";
import { showingTranslateValue } from "utils/translate";
import BrandServices from "services/BrandServices";

const useProductSubmit = (id) => {
  const location = useLocation();
  const { isDrawerOpen, closeDrawer, setIsUpdate, lang, currentPage, limitData } =
    useContext(SidebarContext);

  const { data: attribue } = useAsync(() => AttributeServices.getAllAttributes());
  const { data: globalSetting } = useAsync(SettingServices.getGlobalSetting);
  const { data: getAllBrands, } = useAsync(() => BrandServices?.getAllBrands({
    page: currentPage,
    limit: limitData
  }));

  // react ref
  const resetRef = useRef([]);
  const resetRefTwo = useRef("");

  // react hook
  const [imageUrl, setImageUrl] = useState([]);
  const [tag, setTag] = useState([]);
  const [values, setValues] = useState({});
  let [variants, setVariants] = useState([]);
  const [variant, setVariant] = useState([]);
  const [totalStock, setTotalStock] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const [originalPrice, setOriginalPrice] = useState(0);
  const [sell_price, setSell_price] = useState(0);
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [isBasicComplete, setIsBasicComplete] = useState(false);
  const [tapValue, setTapValue] = useState("Basic Info");
  const [isCombination, setIsCombination] = useState(false);
  const [attTitle, setAttTitle] = useState([]);
  const [variantTitle, setVariantTitle] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [productId, setProductId] = useState("");
  const [updatedId, setUpdatedId] = useState(id);
  const [imgId, setImgId] = useState("");
  const [isBulkUpdate, setIsBulkUpdate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [defaultCategory, setDefaultCategory] = useState([]);
  const [resData, setResData] = useState({});
  const [language, setLanguage] = useState(lang);
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slug, setSlug] = useState("");
  const [published, setPublished] = useState(true);
  const [addTax, setAddTax] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState(false);

  const [description, setDescription] = useState()
  const [defaultContent, setDefaultContent] = useState()
  const [prev_Ratings, setPrev_Ratings] = useState(0);
  const [prev_Featured, setPrev_Featured] = useState(0);


  const [searchTerm, setSearchTerm] = useState({
    brandName: '',
    brand_Id: null,
  });
  const [selectedBrand, setSelectedBrand] = useState();
  const [filteredBrandOptions, setFilteredBrandOptions] = useState();

  const handleBrandSearch = (e) => {
    const term = e.target.value;

    setSearchTerm((prevSearchTerm) => ({
      ...prevSearchTerm,
      brandName: term,
      brand_Id: null,
    }));
    const filtered = getAllBrands?.list?.data?.filter((item) =>
      item.name?.toLowerCase().includes(term?.toLowerCase())
    );
    setFilteredBrandOptions(filtered);
  };
  const handleBrandsSelected = (data) => {
    setSearchTerm({
      brandName: data?.name,
      brand_Id: data?.id,
    });
  };
  const handleEditorChange = (data) => {
    console.log(data)
    var encodedString = encodeURIComponent(data);
    // var encodedString = btoa(data);
    setDescription(encodedString);
  };



  // console.log("lang", lang);

  // console.log(
  //   "defaultCategory",
  //   defaultCategory,
  //   "selectedCategory",
  //   selectedCategory
  // );

  // handle click
  const onCloseModal = () => setOpenModal(false);
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();


  const onSubmit = async (data) => {
    // console.log('data is data',data)
    try {
      setIsSubmitting(true);
      if (!imageUrl) return notifyError("Image is required!");

      if (data.originalPrice < data.sell_price) {
        setIsSubmitting(false);
        return notifyError(
          "SalePrice must be less then or equal of product price!"
        );
      }
      if (!defaultCategory[0]) {
        setIsSubmitting(false);
        return notifyError("Default Category is required!");
      }
      const updatedVariants = await Promise.all(variants?.map((v, i) => {
        const newObj = {
          ...v,
          sell_price: Number(v?.sell_price || 0),
          originalPrice: Number(v?.originalPrice || 0),
          discount: Number(v?.discount || 0),
          quantity: Number(v?.quantity || 0),
        };
        return newObj;
        // return JSON.stringify(newObj);
      }));
      const variantsSting = JSON.stringify(updatedVariants);
      console.log("updatedVariants ==>", variantsSting)
      setIsBasicComplete(true);
      setSell_price(data.sell_price);
      setQuantity(data.quantity);
      setBarcode(data.barcode);
      setSku(data.sku);
      setOriginalPrice(data.originalPrice);

      let updatedSellPrice = Number(data.sell_price)
      let formData = new FormData();

      formData.append("id", productId ? productId : "");
      formData.append("name", data?.title);
      formData.append("price", Number(data.originalPrice) || 0);
      formData.append("sell_price", Number(data.sell_price) || 0);
      formData.append("bar_code", data.barcode || "");
      formData.append("brand", searchTerm?.brandName);
      formData.append("brand_id", searchTerm.brand_Id ? searchTerm.brand_Id : '');
      formData.append("description", description);
      formData.append("slug", data.slug ? data.slug : data.title.toLowerCase().replace(/[^A-Z0-9]+/gi, "-"));
      formData.append("quantity", data.quantity);
      formData.append("tags", tag?.map(tag => `${tag}`).join(','));
      formData.append("sku", data.sku || "");
      formData.append("category_id", selectedCategory[0].id);
      formData.append("status", published ? "show" : "hide");
      formData.append("is_combination", updatedVariants?.length > 0 ? 1 : 0);
      formData.append("variants", isCombination ? variantsSting : []);
      formData.append("is_tax_apply", addTax === true ? 1 : 0);
      formData.append("visitors_counter", data?.visitors_counter);
      formData.append("variants_array", JSON.stringify(variantTitle));
      formData.append("ratings", data?.ratings);
      formData.append("sell_price_is_change", Number(sell_price) === updatedSellPrice ? 0 :1 );
      formData.append("ratings_is_change", data?.ratings ===  prev_Ratings ? "0" :"1" );       
      formData.append("is_featured", featuredProducts ? 1:0);
      formData.append("is_featured_is_change",prev_Featured === featuredProducts ? 0 : 1)

      await Promise.all(imageUrl.map(async (image, index) => {
        if (image.preview) {

          try {
            const response = await fetch(image.preview);

            if (!response.ok) {
              throw new Error(`Failed to fetch image: ${image.preview}`);
            }

            const blob = await response.blob();

            const file = new File([blob], image.path, { type: blob.type });
            formData.append(`files${index + 1}`, file, file.name);
          } catch (error) {
            console.error('Error fetching image:', error);
          }
        }
      }));


      const imageCount = imageUrl.length;
      // const productData = {
      //   ...Array.from({ length: imageCount }, (_, index) => ({
      //     [`file${index + 1}`]: imageUrl[index]
      //   })).reduce((acc, val) => ({ ...acc, ...val }), {}),
      //   id: productId ? productId : "",
      //   name: data?.title,
      //   price: Number(data.originalPrice) || 0,
      //   bar_code: data.barcode || "",
      //   brand: searchTerm?.brandName,
      //   brand_id: searchTerm.brand_Id ? searchTerm.brand_Id : null,
      //   description: data.description,
      //   slug: data.slug ? data.slug : data.title.toLowerCase().replace(/[^A-Z0-9]+/gi, "-"),
      //   quantity: variants?.length < 1 ? data.stock : Number(totalStock),
      //   tags: tag?.map(tag => `${tag}`).join(','),
      //   sku: data.sku || "",
      //   category_id: selectedCategory[0].id,
      //   status: published ? "show" : "hide",
      //   // category: defaultCategory[0].id,
      //   isCombination: updatedVariants?.length > 0 ? isCombination : false,
      //   variants: isCombination ? updatedVariants : [],
      //   is_tax_apply: addTax === true ? 1 : 0
      // };

      // return setIsSubmitting(false);

      if (updatedId) {
        const res = await ProductServices.updateProduct(updatedId, formData);
        if (res) {

          if (isCombination) {
            setIsUpdate(true);
            notifySuccess(res?.message);
            setIsBasicComplete(true);
            setIsSubmitting(false);
            handleProductTap("Combination", true);
          } else {
            setIsUpdate(true);
            notifySuccess(res.message);
            setIsSubmitting(false);
          }
        }

        if (
          tapValue === "Combination" ||
          (tapValue !== "Combination" && !isCombination)
        ) {
          closeDrawer();
        }
      } else {
        const res = await ProductServices.addProduct(formData);
        // console.log("res is ", res);
        if (isCombination) {
          setUpdatedId(res.id);
          setValue("title", res.title[language ? language : "en"]);
          setValue("description", res.description[language ? language : "en"]);
          setValue("slug", res.slug);
          setValue("show", res.show);
          setValue("barcode", res.bar_code);
          setValue("quantity", res.quantity);
          setTag(JSON.parse(res.tag));
          setImageUrl(res?.images);
          setVariants(res.variants);
          setValue("productId", res.productId);
          setProductId(res.productId);
          setOriginalPrice(res?.prices);
          setSell_price(res?.sell_price);
          setBarcode(res.bar_code);
          setSku(res.sku);
          setPublished(res?.status)
          setAddTax(res?.is_tax_apply)
          setFeaturedProducts(res?.is_featured)
          const result = res.variants.map(
            ({
              originalPrice,
              sell_price,
              discount,
              quantity,
              barcode,
              sku,
              productId,
              image,
              ...rest
            }) => rest
          );

          setVariant(result);
          setIsUpdate(true);
          setIsBasicComplete(true);
          setIsSubmitting(false);
          handleProductTap("Combination", true);
          notifySuccess("Product Added Successfully!");
        } else {
          setIsUpdate(true);
          notifySuccess("Product Added Successfully!");
        }

        if (
          tapValue === "Combination" ||
          (tapValue !== "Combination" && !isCombination)
        ) {
          setIsSubmitting(false);
          closeDrawer();
        }
      }
    } catch (err) {
      console.log("err", err);
      setIsSubmitting(false);
      notifyError(err ? err?.response?.data?.message : err.message);
      closeDrawer();
    }
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      setSlug("");
      setLanguage(lang);
      setValue("language", language);
      handleProductTap("Basic Info", true);
      setResData({});
      setValue("sku");
      setValue("title");
      setDefaultContent();
      setDescription();
      setValue("slug");
      setValue("description");
      setValue("quantity");
      setValue("quantity");
      setValue("originalPrice");
      setValue("sell_price");
      setValue("barcode");
      setValue("productId");
      setValue("visitors_counter")
      setValue("ratings")
      setPublished(true);
      setAddTax(true);
      setFeaturedProducts(false)

      setProductId("");
      // setValue('show');
      setImageUrl([]);
      setTag([]);
      setVariants([]);
      setVariant([]);
      setValues({});
      setTotalStock(0);
      setSelectedCategory([]);
      setDefaultCategory([]);
      setSearchTerm({
        brandName: '',
        brand_Id: null,
      });
      if (location.pathname === "/products") {
        resetRefTwo?.current?.resetSelectedValues();
      }

      clearErrors("sku");
      clearErrors("title");
      clearErrors("slug");
      clearErrors("description");
      clearErrors("quantity");
      clearErrors("quantity");
      setValue("quantity", 0);
      setValue("costPrice", 0);
      setValue("sell_price", 0);
      setValue("originalPrice", 0);
      clearErrors("show");
      clearErrors("barcode");
      setIsCombination(false);
      setIsBasicComplete(false);
      setIsSubmitting(false);
      setAttributes([]);

      setUpdatedId();
      return;
    } else {
      handleProductTap("Basic Info", true);
    }

    if (id) {
      setIsBasicComplete(true);
      (async () => {
        try {
          const res = await ProductServices.getProductById(id);

          // console.log("res", res.data);

          if (res) {
            var decodeString = decodeURIComponent(res?.data?.description)

            var decodeStringValue = (decodeString === "null") ? "" : decodeString;

            // console.log("decodeString",decodeString);
            setResData(res.data);
            setSlug(res.data.slug);
            setUpdatedId(res.data.id);
            setValue("title", res.data.name);
            setValue("description", res.data.description);
            setValue("slug", res.data.slug);
            setValue("show", res.data.show);
            setValue("sku", res.data.sku);
            setValue("barcode", res.data.bar_code);
            setValue("quantity", res.data.quantity);
            setValue("productId", res.data.productId);
            setValue("sell_price", res?.data?.sell_price);
            setValue("originalPrice", res?.data?.price);
            setValue("quantity", res.data.quantity);
            setValue("visitors_counter", res?.data?.visitors_counter);
            setValue("ratings", res?.data?.ratings);
            const tagsArray = res?.data?.tags?.split(',');
            setTag(tagsArray ? tagsArray : []);
            setProductId(res.data.id);
            setPublished(res.data.status === "show" ? true : false);
            setAddTax(res.data?.is_tax_apply === 1 ? true : false)
            setFeaturedProducts(res.data?.is_featured)
            setPrev_Featured(res.data?.is_featured)
            setDefaultContent(decodeStringValue)
            setPrev_Ratings(res.data?.ratings)
            setSearchTerm((prevData) => ({
              ...prevData,
              brandName: res.data.brand,
              brand_Id: res.data.brand_id,
            }));
            let categorySelected = {
              id: res?.data?.category?.id,
              name: res?.data?.category?.name
            }
            setSelectedCategory([categorySelected]);
            setDefaultCategory([categorySelected]);
            setBarcode(res.data.bar_code);
            setSku(res.data.sku);
            setOriginalPrice(res?.data?.price)
            setSell_price(res?.data?.sell_price)
            const imagesData = res.data?.images;
            if (imagesData) {
              const imageNames = imagesData.map(image => image.name);
              setImageUrl(imageNames);
            }
            //   console.log("variants 2", res?.data.variants)
            //  console.log(JSON.parse(res?.data?.variants))
            //  let stringifyVarinats = JSON.parse(res?.data?.variants)
            // let stringifyVarinats= [];
            // for (let index = 0; index < res?.data?.variants.length; index++) {
            //   const element = res?.data?.variants[index];
            //   // console.log(element)
            //   stringifyVarinats.push(element)
            // }
            // console.log("stringifyVarinats",stringifyVarinats)
            setVariants(res?.data?.variants ? JSON.parse(res?.data?.variants) : []);
            setIsCombination(res?.data?.variants ? 1 : 0);
            setQuantity(res?.data.quantity);
            setTotalStock(res.quantity);
          }
        } catch (err) {
          notifyError(err ? err?.response?.data?.message : err.message);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    id,
    setValue,
    isDrawerOpen,
    location.pathname,
    clearErrors,
    language,
    lang,
  ]);


  useEffect(() => {
    console.log("attribue", attribue)
    console.log("variants", variants)
    console.log("attribue",)
    const result = attribue?.list?.data
      ?.filter((att) => att.option !== "Checkbox")
      .map((v) => {
        return {
          label: v?.title,
          value: v?.title,
        };
      }) ?? [];

    setAttTitle(result);
    const res = Object?.keys(Object.assign({}, ...variants));
    const varTitle = attribue?.list?.data?.filter((att) => res.includes(JSON.stringify(att.id)));

    // if (variants?.length > 0) {
    //   const totalStock = variants?.reduce((pre, acc) => pre + acc.quantity, 0);
    //   setTotalStock(Number(totalStock));
    // }
    console.log("varTitle", varTitle)
    setVariantTitle(varTitle);
  }, [attribue, variants]);
  //for adding attribute values
  const handleAddAtt = async (v, el) => {
    const result = attribue?.list?.data?.filter((att) => {
      const attribueTItle = att?.title;
      return v.some((item) => item.label === attribueTItle);
    });
    console.log("result", result)
    for (let index = 0; index < result.length; index++) {
      let options;
      const attributeOptions = await AttributeServices.getAttributeIdByOptions(result[index]?.id)
        .then((resp) => {
          console.log(resp)
          if (resp?.status_code === 200) {
            options = resp?.list?.data
          }

        })
        .catch((err) => {
          console.log(err)
        })
      console.log("attributeOptions", options)
      result[index]['variants'] = options
    }
    console.log("updated result", result)

    const attributeArray = result.map((value) => {
      const attributeTitle = value?.title
      return {
        ...value,
        label: attributeTitle,
        value: attributeTitle,
      };
    });
    console.log("attributeArray", attributeArray)
    setAttributes(attributeArray);
  };

  //generate all combination combination
  const handleGenerateCombination = () => {
    console.log("values", values)
    let data = values
    for (const key in data) {
      if (data.hasOwnProperty(key) && Array.isArray(data[key]) && data[key].length > 0) {
        data[key][0] = JSON.stringify(data[key][0]);
      }
    }
    console.log("data", data)
    console.log("stringifiedElements",)
    if (Object.keys(data).length === 0) {
      return notifyError("Please select a variant first!");
    }
    console.log("variants 597", variants)
    let CustomVariants = variants == undefined ? [] : variants
    console.log("CustomVariants", CustomVariants)
    const result = Array.isArray(CustomVariants) ?
      CustomVariants.filter(
        ({
          originalPrice,
          discount,
          sell_price,
          quantity,
          barcode,
          sku,
          productId,
          image,
          ...rest
        }) => JSON.stringify({ ...rest }) !== "{}"

      ) : [];

    console.log("result", result);
    setVariants(result);

    console.log("data", data)

    const combo = combinate(data);


    combo.map((com, i) => {
      if (JSON.stringify(variant).includes(JSON.stringify(com))) {
        return setVariant((pre) => [...pre, com]);
      } else {
        const newCom = {
          ...com,

          originalPrice: originalPrice || 0,
          sell_price: sell_price || 0,
          quantity: Number(quantity),
          discount: Number(originalPrice - sell_price),
          productId: productId && productId + "-" + (variants.length + i),
          barcode: barcode,
          sku: sku,
          image: imageUrl[0] || "",
        };
        console.log("variants 4", newCom)
        setVariants((pre) => [...pre, newCom]);
        return setVariant((pre) => [...pre, com]);
      }
    });

    setValues({});

    // resetRef?.current?.map((v, i) =>
    //   resetRef?.current[i]?.resetSelectedValues()
    // );
  };

  //for clear selected combination
  const handleClearVariant = () => {
    setVariants([]);
    setVariant([]);
    setValues({});
    resetRef?.current?.map(
      async (v, i) => await resetRef?.current[i]?.resetSelectedValues()
    );

    // console.log('value', selectedList, removedItem, resetRef.current);
  };

  //for edit combination values
  const handleEditVariant = (variant) => {
    setTapValue("Combine");
  };

  //for remove combination values
  const handleRemoveVariant = (vari, ext) => {
    // console.log("handleRemoveVariant", vari, ext);
    swal({
      title: `Are you sure to delete this ${ext ? "Extra" : "combination"}!`,
      text: `(If Okay, It will be delete this ${ext ? "Extra" : "combination"
        })`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const result = variants.filter((v) => v !== vari);
        setVariants(result);
        // console.log("result", result);
        const {
          originalPrice,
          sell_price,
          discount,
          quantity,
          barcode,
          sku,
          productId,
          image,
          ...rest
        } = vari;
        const res = variant.filter(
          (obj) => JSON.stringify(obj) !== JSON.stringify(rest)
        );
        setVariant(res);
        setIsBulkUpdate(true);
        // setTimeout(() => setIsBulkUpdate(false), 500);
        const timeOutId = setTimeout(() => setIsBulkUpdate(false), 500);
        return clearTimeout(timeOutId);
      }
    });
  };

  // handle notification for combination and extras
  const handleIsCombination = () => {
    if ((isCombination && variantTitle.length) > 0) {
      swal({
        title: "Are you sure to remove combination from this product!",
        text: "(It will be delete all your combination and extras)",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((value) => {
        // console.log(value);
        if (value) {
          setIsCombination(!isCombination);
          setTapValue("Basic Info");
          setVariants([]);
          setVariant([]);
        }
      });
    } else {
      setIsCombination(!isCombination);
      setTapValue("Basic Info");
    }
  };

  //for select bulk action images
  const handleSelectImage = (img) => {
    if (openModal) {
      variants[imgId].image = img;
      setOpenModal(false);
    }
  };

  //for select individual combination image
  const handleSelectInlineImage = (id) => {
    setImgId(id);
    setOpenModal(!openModal);
  };

  //this for variant/combination list
  const handleSkuBarcode = (value, name, id) => {
    variants[id][name] = value;
  };

  const handleProductTap = (e, value, name) => {
    // console.log(e);

    if (value) {
      if (!value)
        return notifyError(
          `${"Please save product before adding combinations!"}`
        );
    } else {
      if (!isBasicComplete)
        return notifyError(
          `${"Please save product before adding combinations!"}`
        );
    }
    setTapValue(e);
  };

  //this one for combination list
  const handleQuantityPrice = (value, name, id, variant) => {
    // console.log("handleQuantityPrice", name, "value", value);
    if (name === "sell_price" && Number(variant.originalPrice) < Number(value)) {
      // variants[id][name] = Number(variant.originalPrice);
      notifyError("SalePrice must be less then or equal of product price!");
      setValue("price", variant.originalPrice);
      setIsBulkUpdate(true);
      const timeOutId = setTimeout(() => setIsBulkUpdate(false), 100);
      return () => clearTimeout(timeOutId);
    }
    setVariants((pre) =>
      pre.map((com, i) => {
        if (i === id) {
          const updatedCom = {
            ...com,
            [name]: Math.round(value),
          };

          return updatedCom;
        }
        return com;
      })
    );

    const totalStock = variants.reduce(
      (pre, acc) => pre + Number(acc.quantity),
      0
    );
    setTotalStock(Number(totalStock));
  };

  //for change language in product drawer
  const handleSelectLanguage = (lang) => {
    setLanguage(lang);
    if (Object.keys(resData).length > 0) {
      setValue("title", resData.title[lang ? lang : "en"]);
      setValue("description", resData.description[lang ? lang : "en"]);
    }
  };

  //for handle product slug
  const handleProductSlug = (value) => {
    setValue("slug", value.toLowerCase().replace(/[^A-Z0-9]+/gi, "-"));
    setSlug(value.toLowerCase().replace(/[^A-Z0-9]+/gi, "-"));
  };

  return {
    filteredBrandOptions,
    setFilteredBrandOptions,
    searchTerm,
    setSearchTerm,
    selectedBrand,
    setSelectedBrand,
    tag,
    setTag,
    values,
    language,
    register,
    onSubmit,
    errors,
    slug,
    openModal,
    attribue,
    setValues,
    variants,
    imageUrl,
    setImageUrl,
    handleSubmit,
    isCombination,
    variantTitle,
    attributes,
    attTitle,
    handleAddAtt,
    productId,
    onCloseModal,
    isBulkUpdate,
    globalSetting,
    isSubmitting,
    tapValue,
    setTapValue,
    resetRefTwo,
    handleSkuBarcode,
    handleProductTap,
    selectedCategory,
    setSelectedCategory,
    setDefaultCategory,
    defaultCategory,
    handleProductSlug,
    published,
    setPublished,
    description,
    setDescription,
    addTax,
    setAddTax,
    featuredProducts,
    setFeaturedProducts,
    defaultContent,
    setDefaultContent,
    handleEditorChange,
    handleSelectLanguage,
    handleIsCombination,
    handleEditVariant,
    handleRemoveVariant,
    handleClearVariant,
    handleQuantityPrice,
    handleSelectImage,
    handleSelectInlineImage,
    handleGenerateCombination,
    handleBrandSearch,
    handleBrandsSelected
  };
};

export default useProductSubmit;
