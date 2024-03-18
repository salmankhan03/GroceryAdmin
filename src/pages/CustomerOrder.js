import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  TableContainer,
  Pagination,
  Input,
  Button
} from "@windmill/react-ui";
import { IoBagHandle, IoMailOutline } from "react-icons/io5";
import useAsync from "hooks/useAsync";
import OrderServices from "services/OrderServices";
import useFilter from "hooks/useFilter";
import PageTitle from "components/Typography/PageTitle";
import Loading from "components/preloader/Loading";
import CustomerOrderTable from "components/customer/CustomerOrderTable";
import { useTranslation } from "react-i18next";
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import InputArea from "components/form/InputArea";
import useCustomerSubmit from "hooks/useCustomerSubmit";
import {
  IoChevronDownOutline,
  IoChevronForwardOutline,
} from 'react-icons/io5';
import { update } from "cloudinary/lib/api";
import CustomerServices from "services/CustomerServices";
import { notifyError, notifySuccess } from 'utils/toast';
import CustomerEmailListTable from "components/customer/CustomerEmailListTable";

const InputField = ({ label, value, name, isDisabled, onChange }) => (
  <div className="">
    <label>{label}</label>
    <Input
      value={value}
      type="text" // Adjust type as needed
      placeholder={label}
      onChange={onChange}
      name={name}
      className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
      disabled={isDisabled}
    />
  </div>
);


const CustomerOrder = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { userData, register, handleSubmit, onSubmit, errors, selectedProvince, setSelectedProvince, handleProvince } = useCustomerSubmit(id);
  const [customerData, setCustomerData] = useState()
  const [expandedBasicSections, setExpandedBasicSections] = useState(true);
  const [expandedSections, setExpandedSections] = useState(false);
  const [expandedShippingSections, setExpandedShippingSections] = useState([]);
  const [activeTab, setActiveTab] = useState('cus_profile'); // State to manage active tab
  const [customerSendEmailList,setCustomerSendEmailList] = useState([])
  const [billingFormErrors, setBillingFormErrors] = useState({});
  const [shippingFormErrors, setShippingFormErrors] = useState({});
  const [billingFormData, setBillingFormData] = useState({
    first_name: '',
    last_name: '',
    country: 'CA',
    street_address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
  });
  const [shippingFormData, setShippingFormData] = useState({
    first_name: '',
    last_name: '',
    country: 'CA',
    street_address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
  });
  // const customerEmailList = [
  //   {
  //     "id": 56,
  //     "user_id": 35,
  //     "created_at": "2024-02-27T12:44:06.000000Z",
  //     "templates": "%3Cdiv%3Eto%20%3A%20test%40gmail.com%3C%2Fdiv%3E%3Cdiv%3Efrom%20%3A%2010%3C%2Fdiv%3E%3Ch1%3EOrder%20Confirmed%3C%2Fh1%3E%3Cp%3EDear%20Mr.kapadiya%2C%3C%2Fp%3E%3Cp%3EWe%20regret%20to%20inform%20you%20that%20your%20order%20%2318%20has%20been%20Confirmed.%20We%20apologize%20for%20any%20inconvenience%20this%20may%20have%20caused.%3C%2Fp%3E%3Cp%3EIf%20you%20have%20any%20questions%20or%20concerns%2C%20please%20feel%20free%20to%20contact%20our%20customer%20support%20team.%3C%2Fp%3E%3Cp%3EThank%20you%20for%20your%20understanding.%3C%2Fp%3E%3Cp%3ESincerely%2C%20http%3A%2F%2Fkingsmankids.com%2F%3C%2Fp%3E",
  //     "status": "Pending"

  //   },
  //   {
  //     "id": 57,
  //     "user_id": 1,
  //     "created_at": "2024-02-27T12:44:06.000000Z",
  //     "templates": "%3Cdiv%3Eto%20%3A%20test%40gmail.com%3C%2Fdiv%3E%3Cdiv%3Efrom%20%3A%2010%3C%2Fdiv%3E%3Ch1%3EOrder%20Confirmed%3C%2Fh1%3E%3Cp%3EDear%20Mr.kapadiya%2C%3C%2Fp%3E%3Cp%3EWe%20regret%20to%20inform%20you%20that%20your%20order%20%2318%20has%20been%20Confirmed.%20We%20apologize%20for%20any%20inconvenience%20this%20may%20have%20caused.%3C%2Fp%3E%3Cp%3EIf%20you%20have%20any%20questions%20or%20concerns%2C%20please%20feel%20free%20to%20contact%20our%20customer%20support%20team.%3C%2Fp%3E%3Cp%3EThank%20you%20for%20your%20understanding.%3C%2Fp%3E%3Cp%3ESincerely%2C%20http%3A%2F%2Fkingsmankids.com%2F%3C%2Fp%3E",
  //     "status": "Pending"


  //   }
  // ]
  const { data, loading, error } = useAsync(() =>
    OrderServices.getOrderCustomer(id)
  );
  const { handleChangePage, totalResults, resultsPerPage, dataTable } =
    useFilter(data?.list);
  useEffect(() => {
    setCustomerData(userData)
  }, [userData])

  useEffect(() => {
    if(activeTab === "cus_emails"){
      getCustomerEmailList()
    }
  }, [activeTab])

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const handleInputChange = (sections, field, value, index) => {
    let formattedValue = value;
    if (field === 'contact_no') {
      formattedValue = value.slice(0, 10);
    }

    if (field === 'zipcode') {
      formattedValue = value.slice(0, 6);
    }
    if (sections === "basic_details") {
      setCustomerData({
        ...customerData,
        [field]: formattedValue,
      });
    } else if (sections === "billing_details") {
      setCustomerData({
        ...customerData,
        billing_address: {
          ...customerData.billing_address,
          [field]: formattedValue,
        },
      });
    } else if (sections === "shipping_address") {
      // setCustomerData({
      //   ...customerData,
      //   shipping_address[index]: {
      //     ...customerData.shipping_address,
      //     [field]: formattedValue,
      //   },
      // });
    }

    console.log(customerData,)
    // if (setFormErrors === "billingform Error") {
    //   setBillingFormErrors({
    //     ...billingFormErrors,
    //     [field]: '',
    //   })
    // } else {
    //   setShippingFormErrors({
    //     ...shippingFormErrors,
    //     [field]: '',
    //   })
    //   if (field === "state") {
    //     console.log("call")
    //     // manageConditionWiseTax()
    //   }
    // }
  };
  const basicDeatilsToggleSection = () => {
    setExpandedBasicSections(!expandedBasicSections)
  };
  const toggleSection = () => {
    setExpandedSections(!expandedSections)
  };
  const shippingToggleSection = (index) => {
    setExpandedShippingSections(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
    // setExpandedShippingSections(!expandedSections)

  };
  const updateCustomer = async () => {
    const res = await CustomerServices.updateCustomer(customerData?.id, customerData);
    if (res?.status_code === 200) {
      notifySuccess("Customer Update Successfully");
    }
  }
 async function getCustomerEmailList(){
    console.log("customerData",customerData?.id)
    const res = await CustomerServices.getSentEmailListByCustomer(customerData?.id, 1,100);
    console.log("res ==>",res)
    if (res?.status_code === 200) {      
      setCustomerSendEmailList(res?.data?.data)
    }
  }

  console.log("Customer Order", customerData)
  return (
    <>
      <div className="tab-buttons" style={{ width: '100%' }}>
        <button style={{ border: 'none' }} className={activeTab === 'cus_profile' ? 'active' : ''} onClick={() => handleTabChange('cus_profile')}>Customer Profile</button>
        <button className={activeTab === 'cus_order' ? 'active' : ''} onClick={() => handleTabChange('cus_order')}>Customer Order List</button>
        <button className={activeTab === 'cus_emails' ? 'active' : ''} onClick={() => handleTabChange('cus_emails')}>Customer Email List</button>
      </div>

      <div className="tab-content mb-10">
        {activeTab === 'cus_profile' &&
          <div className="mt-5">
            <div className="flex items-center justify-between">
              <PageTitle>{"Customer Profile"}</PageTitle>
              <div className="w-full md:w-48 lg:w-48 xl:w-48">
                <Button
                  className="w-full rounded-md h-12"
                  onClick={updateCustomer}
                >
                  {"Update Profile"}
                </Button>
              </div>
            </div>

            <div>

              <div>
                <div className="mt-5">
                  <div className="collapse-cards" onClick={() => basicDeatilsToggleSection()}>
                    <h2 className="cards-title">Customer Basic Details</h2>
                    <span className="mr-5">
                      {expandedBasicSections ? <IoChevronDownOutline /> : <IoChevronForwardOutline />}
                    </span>
                  </div>
                  {expandedBasicSections && (
                    <div className="card-contents">
                      <form onSubmit={""} >
                        <div className="grid gap-4 lg:gap-6 xl:gap-6 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 py-2">
                          <InputField
                            label="Customer First Name"
                            value={customerData?.first_name}
                            name="first_name"
                            onChange={(e) => handleInputChange('basic_details', 'first_name', e.target.value,)}
                          />
                          <InputField
                            label="Customer Last Name"
                            value={customerData?.last_name}
                            name="last_name"
                            onChange={(e) => handleInputChange('basic_details', 'last_name', e.target.value,)}
                          />
                          <InputField
                            label="Customer Phone Number"
                            value={customerData?.contact_no}
                            name="contact_no"
                            onChange={(e) => handleInputChange('basic_details', 'contact_no', e.target.value,)}
                          />
                          <InputField
                            label="Customer Email"
                            value={customerData?.email}
                            name="email"
                            isDisabled={true}
                            onChange={(e) => handleInputChange('basic_details', 'email', e.target.value,)}
                          />
                          <InputField
                            label="Street Address"
                            value={customerData?.street_address}
                            name="street_address"
                            onChange={(e) => handleInputChange('basic_details', 'street_address', e.target.value,)}
                          />
                          <InputField
                            label="Town / City"
                            value={customerData?.city}
                            name="city"
                            onChange={(e) => handleInputChange('basic_details', 'city', e.target.value,)}
                          />
                          {/* Reusable region dropdown component */}
                          <div className="">
                            <label>Province</label>
                            <RegionDropdown
                              className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                              defaultOptionLabel="Select state"
                              country="CA"
                              countryValueType="short"
                              value={customerData?.state}
                              onChange={(e) => handleInputChange('basic_details', 'state', e,)}

                            />
                          </div>
                          <InputField
                            label="Postal Code"
                            value={customerData?.zipcode}
                            name="zipcode"
                            onChange={(e) => handleInputChange('basic_details', 'zipcode', e.target.value,)}
                          />
                        </div>
                      </form>
                    </div>
                  )}
                </div>
                {customerData?.billing_address && (
                  <div className="mt-5">
                    <div className="collapse-cards" onClick={() => toggleSection()}>
                      <h2 className="cards-title">Billing Details</h2>
                      <span className="mr-5">
                        {expandedSections ? <IoChevronDownOutline /> : <IoChevronForwardOutline />}
                      </span>
                    </div>
                    {expandedSections && (
                      <div className="card-contents">
                        <form onSubmit={""} >
                          <div className="grid gap-4 lg:gap-6 xl:gap-6 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 py-2">
                            <InputField
                              label="First Name"
                              value={customerData?.billing_address?.first_name}
                              name="first_name"
                              isDisabled={true}
                              onChange={(e) => handleInputChange('billing_details', 'first_name', e.target.value,)}


                            />
                            <InputField
                              label="Last Name"
                              value={customerData?.billing_address?.last_name}
                              name="last_name"
                              isDisabled={true}
                              onChange={(e) => handleInputChange('billing_details', 'last_name', e.target.value,)}
                            />
                            <InputField
                              label="Phone Number"
                              value={customerData?.billing_address?.contact_no}
                              name="contact_no"
                              isDisabled={true}
                              onChange={(e) => handleInputChange('billing_details', 'contact_no', e.target.value,)}
                            />
                            <InputField
                              label="Email"
                              value={customerData?.billing_address?.email}
                              name="email"
                              isDisabled={true}
                              onChange={(e) => handleInputChange('billing_details', 'email', e.target.value,)}
                            />
                            <InputField
                              label="Street Address"
                              value={customerData?.billing_address?.street_address}
                              name="street_address"
                              isDisabled={true}
                              onChange={(e) => handleInputChange('billing_details', 'street_address', e.target.value,)}
                            />
                            <InputField
                              label="Town / City"
                              value={customerData?.billing_address?.city}
                              name="city"
                              isDisabled={true}
                              onChange={(e) => handleInputChange('billing_details', 'city', e.target.value,)}
                            />
                            {/* Reusable region dropdown component */}
                            <div className="">
                              <label>Province</label>
                              <RegionDropdown
                                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                                defaultOptionLabel="Select state"
                                country="CA"
                                countryValueType="short"
                                value={customerData?.billing_address?.state}
                                onChange={(e) => handleInputChange('billing_details', 'state', e,)}
                                disabled={true}
                              />
                            </div>
                            <InputField
                              label="Postal Code"
                              value={customerData?.billing_address?.zipcode}
                              name="postal_code"
                              isDisabled={true}
                              onChange={(e) => handleInputChange('billing_details', 'zipcode', e.target.value,)}
                            />
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                )}
                {customerData?.shipping_address?.map((data, index) => {
                  return (
                    <div className="mt-5">
                      <div className="collapse-cards" onClick={() => shippingToggleSection(index)}>
                        <h2 className="cards-title">Shipping Details {index + 1}</h2>
                        <span className="mr-5">
                          {expandedShippingSections[index] ? <IoChevronDownOutline /> : <IoChevronForwardOutline />}
                        </span>
                      </div>

                      {expandedShippingSections[index] && (
                        <div className="card-contents">
                          <form onSubmit={""} key={index} className="mt-3">
                            <div className="grid gap-4 lg:gap-6 xl:gap-6 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 py-2">
                              <InputField
                                label="First Name"
                                value={data?.first_name}
                                name="first_name"
                                isDisabled={true}
                                onChange={(e) => handleInputChange('shipping_address', 'first_name', e.target.value, index,)}
                              />
                              <InputField
                                label="Last Name"
                                value={data?.last_name}
                                name="last_name"
                                isDisabled={true}
                              />
                              <InputField
                                label="Phone Number"
                                value={data?.contact_no}
                                name="contact_no"
                                isDisabled={true}
                              />
                              <InputField
                                label="Email"
                                value={data?.email}
                                name="email"
                                isDisabled={true}
                              />
                              <InputField
                                label="Street Address"
                                value={data?.street_address}
                                name="street_address"
                                isDisabled={true}
                              />
                              <InputField
                                label="Town / City"
                                value={data?.city}
                                name="city"
                                isDisabled={true}
                              />

                              <div className="">
                                <label>Province</label>
                                <RegionDropdown
                                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                                  defaultOptionLabel="Select state"
                                  country="CA"
                                  countryValueType="short"
                                  value={data?.state}
                                  disabled={true}
                                />
                              </div>
                              <InputField
                                label="Postal Code"
                                value={data?.zipcode}
                                name="postal_code"
                                isDisabled={true}
                              />
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        }
        {activeTab === 'cus_order' &&
          <div>
            <PageTitle>{t("CustomerOrderList")}</PageTitle>
            {loading && <Loading loading={loading} />}
            {!error && !loading && dataTable.length === 0 && (
              <div className="w-full bg-white rounded-md dark:bg-gray-800">
                <div className="p-8 text-center">
                  <span className="flex justify-center my-30 text-red-500 font-semibold text-6xl">
                    <IoBagHandle />
                  </span>
                  <h2 className="font-medium text-base mt-4 text-gray-600">
                    {t("CustomerOrderEmpty")}
                  </h2>
                </div>
              </div>
            )}

            {data?.list?.length > 0 && !error && !loading ? (
              <TableContainer className="mb-8">
                <Table>
                  <TableHeader>
                    <tr>
                      <TableCell> {t("CustomerOrderId")} </TableCell>
                      <TableCell>{t("CustomerOrderTime")}</TableCell>
                      <TableCell>{t("CustomerShippingAddress")}</TableCell>
                      <TableCell>{t("Phone")} </TableCell>
                      <TableCell>{t("CustomerOrderMethod")} </TableCell>
                      <TableCell className="text-center">
                        {" "}
                        {t("CustomerOrderStatus")}{" "}
                      </TableCell>
                      <TableCell>{t("Amount")}</TableCell>

                    </tr>
                  </TableHeader>
                  <CustomerOrderTable orders={dataTable} />
                </Table>
                <TableFooter>
                  <Pagination
                    totalResults={totalResults}
                    resultsPerPage={resultsPerPage}
                    onChange={handleChangePage}
                    label="Table navigation"
                  />
                </TableFooter>
              </TableContainer>
            ) : null}
          </div>
        }
        {activeTab === 'cus_emails' &&
          <div>
            <PageTitle>{"Customer Email List"}</PageTitle>
            {loading && <Loading loading={loading} />}
            {!error && !loading && customerSendEmailList.length === 0 && (
              <div className="w-full bg-white rounded-md dark:bg-gray-800">
                <div className="p-8 text-center">
                  <span className="flex justify-center my-30 text-red-500 font-semibold text-6xl">
                    <IoMailOutline />
                  </span>
                  <h2 className="font-medium text-base mt-4 text-gray-600">
                    {"This Customer have no mail send"}
                  </h2>
                </div>
              </div>
            )}

            {customerSendEmailList?.length > 0 && !error && !loading ? (
              <TableContainer className="mb-8">
                <Table>
                  <TableHeader>
                    <tr>
                      <TableCell> {"Customer Id"} </TableCell>
                      <TableCell> {t("CustomerOrderId")} </TableCell>
                      <TableCell>{"Status"}</TableCell>
                      <TableCell>{"Sending Email"}</TableCell>
                      {/* <TableCell>{"Date"}</TableCell> */}

                      {/* <TableCell>{t("Phone")} </TableCell>
                      <TableCell>{t("CustomerOrderMethod")} </TableCell>
                      <TableCell className="text-center">
                        {" "}
                        {t("CustomerOrderStatus")}{" "}
                      </TableCell>
                      <TableCell>{t("Amount")}</TableCell> */}

                    </tr>
                  </TableHeader>
                  <CustomerEmailListTable data={customerSendEmailList} />
                </Table>
                <TableFooter>
                  <Pagination
                    totalResults={totalResults}
                    resultsPerPage={resultsPerPage}
                    onChange={handleChangePage}
                    label="Table navigation"
                  />
                </TableFooter>
              </TableContainer>
            ) : null}
          </div>
        }
      </div>

    </>
  );
};

export default CustomerOrder;
