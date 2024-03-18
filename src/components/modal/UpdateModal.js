import React, { useState } from "react";
import { Modal, ModalBody, ModalFooter, Button } from "@windmill/react-ui";
import { FiTrash2 } from "react-icons/fi";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import OrderServices from "services/OrderServices";
import { notifyError, notifySuccess } from "utils/toast";
import CheckBox from "components/form/CheckBox";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import UploadAdapter from "services/UploadAdapter";
import { update } from "cloudinary/lib/api";
const CustomUpdateModal = ({ id, previous_order_status,status, title, handleConfirmUpdate, closeModal, templatesList, customerName, customerEmail }) => {
  const location = useLocation();
  const [isCheck, setIsCheck] = useState(true);
  const [readEmailTemplates, setReadEmailTemplates] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState()

  const [isConfirmOpen, setConfirmOpen] = useState(handleConfirmUpdate);

  const handleSelectAll = () => {
    setIsCheck(!isCheck);

  };
  const showEmailTemplates = () => {
    if (isCheck) {
      const StatusId = getStatusId(status);
      setReadEmailTemplates(true)
    } else {
      handleConfirm()
    }
  }
  // Status ID get
  function getStatusId(statusName) {
    const findStatus = templatesList.find(item => item.name === statusName);
    let decodeString = atob(findStatus.body)
    let againdecodeString = atob(decodeString)
    const values = {
      customer_Name: customerName,
      order_Number: id,
      company_Name: 'http://kingsmankids.com/'
    };
    againdecodeString = againdecodeString.replace(/\[(customer_Name|order_Number|company_Name)\]/g, (match, p1) => values[p1]);
    let newString = `<div>to : test@gmail.com</div><div>from : ${customerEmail}</div>` + againdecodeString
    setSelectedTemplates(newString)
    return findStatus ? findStatus.id : null;
  }
  function extractEmails(htmlContent) {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const toEmailMatches = htmlContent.match(/to\s*:\s*([^<]*)/i);
    const toEmails = toEmailMatches ? toEmailMatches[1].match(emailRegex) : [];
    const fromEmailMatches = htmlContent.match(/from\s*:\s*([^<]*)/i);
    const fromEmails = fromEmailMatches ? fromEmailMatches[1].match(emailRegex) : [];
    const uniqueToEmails = toEmails ? [...new Set(toEmails)] : [];
    const uniqueFromEmails = fromEmails ? fromEmails[0] : "";
    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlContent;
    const contentAfterFirstDiv = tempElement.innerHTML.split('</div>')[2];
    return { to: uniqueToEmails, from: uniqueFromEmails, content: contentAfterFirstDiv};
  }


  const handleConfirm = async () => {
    try {
      setConfirmOpen(false);
      // console.log("templatesList ORDER CONFIRm",templatesList)

      if (location.pathname === "/orders") {
        if (id) {
          console.log("updated data", selectedTemplates)
          // const StatusId = getStatusId(status);
          const { to, from,content } = extractEmails(selectedTemplates);

          var encodedString = encodeURIComponent(content);

          let body = {
            order_id: id,
            previous_order_status:previous_order_status,
            current_order_status: status,
            email_body: encodedString,
            from_email: from,
            to_email: to
          }
          console.log("body", body)
          OrderServices.updateOrder(body)
            .then((res) => {
              notifySuccess(res.message);
              closeModal()
            })
            .catch((err) => notifyError(err.message));
        }
      }
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
      closeModal();
      setConfirmOpen(false);
    }
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    closeModal();
  };

  function CustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new UploadAdapter(loader);
    };
  }

  const handleEditorChange = (data) => {
    console.log(data)
    setSelectedTemplates(data)
    // var encodedString = btoa(data);
    // setTemplatesContent(encodedString);
  };


  return (
    <>
      {!readEmailTemplates ? (
        <Modal isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)}>
          <ModalBody className="text-center custom-modal px-8 pt-6 pb-4">
            <span className="flex justify-center text-3xl mb-6 text-red-500">
              {/* <FiTrash2 /> */}
            </span>
            <h2 className="text-xl font-medium mb-1">
              Are You Sure! Want to Update  Record?

              {/* Are You Sure! Want to Update <span className="text-red-500">{""}</span> Record? */}
            </h2>
            <p>
              Do you really want to update this record? You can't undo this action!
            </p>
            <div className="mt-3">
              <span className="mt-1">
                <CheckBox
                  type="checkbox"
                  name="select"
                  id="select"
                  isChecked={isCheck}
                  handleClick={handleSelectAll}
                />
              </span>
              <span className="ml-3"> Custom message!</span>
            </div>
          </ModalBody>
          <ModalFooter className="justify-center">
            <Button
              className="w-full sm:w-auto hover:bg-white hover:border-gray-50"
              layout="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button onClick={showEmailTemplates} className="w-full sm:w-auto">
              Continue
            </Button>
          </ModalFooter>
        </Modal>
      ) : (

        <Modal isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)}>
          <ModalBody className="text-center custom-modal px-8 pt-6 pb-4">
            <span className="flex justify-center text-3xl mb-6 text-red-500">
              Customize Message
            </span>

            <CKEditor
              type=""
              editor={ClassicEditor}
              config={{
                extraPlugins: [CustomUploadAdapterPlugin],
                toolbar: ['heading', '|', 'bold', 'italic', 'blockQuote', 'link', 'numberedList', 'bulletedList', 'imageUpload', 'imageStyle:full',
                  'imageStyle:alignLeft',
                  'imageStyle:alignCenter',
                  'imageStyle:alignRight', 'insertTable',
                  'tableColumn', 'tableRow', 'mergeTableCells', 'mediaEmbed', '|', 'undo', 'redo', 'Subscript'],//'imageUpload','underline', 'strikethrough', 'code', 'subscript', 'superscript'
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

              data={selectedTemplates}
              onChange={(event, editor) => {
                const data = editor.getData();
                handleEditorChange(data);
              }}
            />
            {/* <div dangerouslySetInnerHTML={{ __html:selectedTemplates }} /> */}

          </ModalBody>
          <ModalFooter className="justify-center">
            <Button
              className="w-full sm:w-auto hover:bg-white hover:border-gray-50"
              layout="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirm} className="w-full sm:w-auto">
              Update
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
};

export default CustomUpdateModal;
