import DrawerButton from "components/form/DrawerButton";
import Error from "components/form/Error";
import InputArea from "components/form/InputArea";
import LabelArea from "components/form/LabelArea";
import SwitchToggle from "components/form/SwitchToggle";
import Title from "components/form/Title";
import useBrandSubmit from "hooks/useBrandSubmit";
import useStaticPageSubmit from "hooks/useStaticPageSubmit";
import React from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useTranslation } from "react-i18next";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import UploadAdapter from "services/UploadAdapter";



const StaticPageDrawer = ({ id, data, brandList, lang }) => {

  const { t } = useTranslation();

  const {
    checked,
    register,
    defaultContent, 
    setDefaultContent,
    templatesContent,
    setTemplatesContent,
    onSubmit,
    handleEditorChange,
    handleSubmit,
    errors,
    published,
    setPublished,
    setChecked,
    handleSelectLanguage,
    isSubmitting,
  } = useStaticPageSubmit(id, data);

  

  const STYLE = `
  .rc-tree-child-tree {
    display: hidden;
  }
  .node-motion {
    transition: all .3s;
    overflow-y: hidden;
  }
`;

  const motion = {
    motionName: "node-motion",
    motionAppear: false,
    onAppearStart: (node) => {
      return { height: 0 };
    },
    onAppearActive: (node) => ({ height: node.scrollHeight }),
    onLeaveStart: (node) => ({ height: node.offsetHeight }),
    onLeaveActive: () => ({ height: 0 }),
  };


  function CustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new UploadAdapter(loader);
    };
  }
  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={"Update Template"}
            description={t("UpdateBrandDescription")}
          />
        ) : (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={"Add Templates"}
            description={t("AddBrandDescription")}
          />
        )}
      </div>

      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 flex-grow scrollbar-hide w-full max-h-full pb-40">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("Name")} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Templates title"
                  name="name"
                  type="text"
                  placeholder={"templates Name"}
                />
                <Error errorName={errors.name} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={"Templates Content"} />
              <div className="col-span-8 sm:col-span-4">
                <CKEditor
                  type=""
                  editor={ClassicEditor}
                  config={{
                    extraPlugins: [CustomUploadAdapterPlugin],
                    // plugins:[Image],
                    // image: {
                    //   toolbar: ['imageStyle:full', 'imageStyle:side', '|', 'imageTextAlternative'],
                    //   upload: { types: ['jpeg', 'png','pdf', 'docx'] },
                    // },              
                    toolbar: ['heading', '|','bold', 'italic', 'blockQuote', 'link', 'numberedList', 'bulletedList', 'imageUpload',  'imageStyle:full',
                    'imageStyle:alignLeft',
                    'imageStyle:alignCenter',
                    'imageStyle:alignRight','insertTable',
                      'tableColumn', 'tableRow', 'mergeTableCells', 'mediaEmbed', '|', 'undo', 'redo' ,'Subscript'],//'imageUpload','underline', 'strikethrough', 'code', 'subscript', 'superscript'
                      heading: {
                        options: [
                            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                            { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                            { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                            { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
                        ]
                    },
                  }}

                  data={defaultContent ? defaultContent : "<p> HELLO </p>"}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    handleEditorChange(data);
                  }}
                />
              </div>
            </div>
          </div>

          <DrawerButton id={id} title="Templates" isSubmitting={isSubmitting} />
        </form>
      </Scrollbars>
    </>
  );
};

export default StaticPageDrawer;
