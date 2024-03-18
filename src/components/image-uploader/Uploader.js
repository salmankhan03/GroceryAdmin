import React, { useEffect, useState } from "react";
import { t } from "i18next";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import cloudinary from "cloudinary/lib/cloudinary";
import { FiUploadCloud, FiXCircle } from "react-icons/fi";

//internal import
import useAsync from "hooks/useAsync";
import SettingServices from "services/SettingServices";
import { notifyError, notifySuccess } from "../../utils/toast";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Container from "./Container";
import ProductServices from "services/ProductServices";

cloudinary.config({
  cloud_name: process.env.REACT_APP_CLOUD_NAME,
  api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
  api_secret: process.env.REACT_APP_CLOUDINARY_API_SECRET,
});

const Uploader = ({ setImageUrl, imageUrl, product, folder, method,id, category }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState("");
  const [selectedImages, setSelectedImages] = useState([])
  const [productsDetails, setProductsDetails] = useState()

  const { data: globalSetting } = useAsync(SettingServices.getGlobalSetting);
  // console.log("data", data);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const res = await ProductServices.getProductById(id);
          setProductsDetails(res.data);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchData();
  }, [id]);
  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: "image/*",
    multiple: product === true ? true : false,
    maxSize: 500000,
    maxFiles: product === true ? (globalSetting?.number_of_image_per_product || 10) : 1,
    onDrop: (acceptedFiles) => {
      setFiles(
          acceptedFiles.map((file) =>
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              })
          )
      );
    },
  });

  useEffect(()=>{
    if(product === true) {
      files.map((element, index) => (
          setImageUrl((imgUrl) => [...imgUrl, element])
      ));
    } else {
      if (files.length > 0) {
        setImageUrl(files);
      }
    }
  },[files])


  const thumbs = files.map((file) => (
    <div key={file.name}>
      <div>
        <img
          className="inline-flex border-2 border-gray-100 w-24 max-h-24"
          src={file.preview}
          alt={file.name}
        />
      </div>
    </div>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const handleRemoveImage = async (img) => {
    if(id){
      let index = productsDetails?.images?.findIndex((x)=>x.name === img)
      console.log(index)
      if(index != -1){
        const updatedImageUrl = [...imageUrl];
        updatedImageUrl.splice(index, 1);
        setImageUrl(updatedImageUrl)
        let data = new FormData();
        data.append('category_images', '');  // Add the appropriate value for 'category_images'
        data.append('product_images', `${productsDetails?.images[index].id}`); 
        const res = await SettingServices.removeMultiDeleteMedia(data);
        // setProductsDetails(res.data);
        notifyError(
              res.status_code === 200 ? "Image delete successfully!" : res.result
            );

      }
    }else{
      let index = imageUrl.findIndex((x)=> x === img)
      console.log(index)
      if(index != -1){
        const updatedImageUrl = [...imageUrl];
        updatedImageUrl.splice(index, 1);
        setImageUrl(updatedImageUrl)
      }
    }
  };

  return (
    <div className="w-full text-center">
      <div
        className="border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 pt-5 pb-6"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <span className="mx-auto flex justify-center">
          <FiUploadCloud className="text-3xl text-green-500" />
        </span>
        <p className="text-sm mt-2">{t("DragYourImage")}</p>
        <em className="text-xs text-gray-400">{t("imageFormat")}</em>
      </div>

      <div className="text-green-500">{loading && err}</div>
     
      <aside className="flex flex-row flex-wrap mt-4">
        {product || category ? (
          <DndProvider backend={HTML5Backend}>
            <Container
              setImageUrl={setImageUrl}
              imageUrl={imageUrl}
              handleRemoveImage={handleRemoveImage}
            />
          </DndProvider>
        ) : !product || !category && imageUrl ? (
          <div className="relative">
            {" "}
            <img
              className="inline-flex border rounded-md border-gray-100 dark:border-gray-600 w-24 max-h-24 p-2"
              src={imageUrl}
              alt="product"
            />
            <button
              type="button"
              className="absolute top-0 right-0 text-red-500 focus:outline-none"
              onClick={() => handleRemoveImage(imageUrl)}
            >
              <FiXCircle />
            </button>
          </div>
        ) : (
          thumbs
        )}
      </aside>
    </div>
  );
};

export default Uploader;
