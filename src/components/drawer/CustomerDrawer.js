import DrawerButton from "components/form/DrawerButton";
import Error from "components/form/Error";
import InputArea from "components/form/InputArea";
import LabelArea from "components/form/LabelArea";
import Title from "components/form/Title";
import useCustomerSubmit from "hooks/useCustomerSubmit";
import React from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

const CustomerDrawer = ({ id }) => {
  const { register, handleSubmit, onSubmit, errors,selectedProvince, setSelectedProvince,handleProvince } = useCustomerSubmit(id);

  // console.log('##CustomerDrawer',selectedProvince)
  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            title={"Update Customer"}
            description={"Update your Customer necessary information from here"}
          />
        ) : (
          <Title
            title={"Add Customer"}
            description={"Add your Customer necessary information from here"}
          />
        )}
      </div>

      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full pb-40">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={"Name"} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Name"
                  name="first_name"
                  type="text"
                  placeholder={"Name"}
                />
                <Error errorName={errors.first_name} />
              </div>
            </div>
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={"Last Name"} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="last Name"
                  name="last_name"
                  type="text"
                  placeholder={"last Name"}
                />
                <Error errorName={errors.last_name} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={"Email"} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Email"
                  name="email"
                  type="email"
                  placeholder={"Email"}
                  disabled={true}
                />
                <Error errorName={errors.email} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={"Phone"} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  required
                  register={register}
                  label="Phone"
                  name="phone"
                  type="number"
                  placeholder={"Phone"}
                />
                <Error errorName={errors.phone} />
              </div>
            </div>

            {/* <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={"Address"} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  required
                  register={register}
                  label="Address"
                  name="address"
                  type="text"
                  placeholder={"Address"}
                />
                <Error errorName={errors.address} />
              </div>
            </div> */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={"City"} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  required
                  register={register}
                  label="City"
                  name="city"
                  type="text"
                  placeholder={"City"}
                />
                <Error errorName={errors.city} />
              </div>
            </div>
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={"Province"} />
              <div className="col-span-8 sm:col-span-4">
                <RegionDropdown
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  defaultOptionLabel={'Select state'}
                  // className={`country-Dropdown gray-bg ${billingFormErrors.state ? 'validation-error-border' : ''}`}
                  country={'CA'}
                  countryValueType={'short'}
                  value={selectedProvince}                  
                  onChange={(e) => handleProvince(e)}
                  // isdisabled={isChecked}
                />
                <Error errorName={errors.province} />
              </div>
            </div>
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={"Postal Code"} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  required
                  register={register}
                  label="Postal Code"
                  name="zipcode"
                  type="number"
                  placeholder={"Postal Code"}
                />
                <Error errorName={errors.zipcode} />
              </div>
            </div>
          </div>

          <DrawerButton id={id} title="Customer" />
        </form>
      </Scrollbars>
    </>
  );
};

export default CustomerDrawer;
