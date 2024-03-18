import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { SidebarContext } from 'context/SidebarContext';
import CustomerServices from 'services/CustomerServices';
import { notifyError, notifySuccess } from 'utils/toast';

const useCustomerSubmit = (id) => {
  const [imageUrl, setImageUrl] = useState('');
  const [selectedProvince, setSelectedProvince]= useState()
  const { closeDrawer, setIsUpdate } = useContext(SidebarContext);
  const [userData,setUserData]= useState()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const customerData = {
        id: id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        contact_no: data.phone,
        // address: data.address,
        city:data.city,
        state: selectedProvince,
        zipcode:data.zipcode
        

      };

      if (id) {
        // notifyError("Admin can't update the user details only customers can update there info ");
        const res = await CustomerServices.updateCustomer(id, customerData);
        // console.log("res",res)
        setIsUpdate(true);
        notifySuccess("Customer Update Successfully");
        closeDrawer();
      }
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err.message);
      closeDrawer();
    }
  };
  const handleProvince = (e) =>{
      setSelectedProvince(e)
  }

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const res = await CustomerServices.getCustomerById(id);
          if (res.status_code === 200) {
            // console.log(res.user)
            setValue('first_name', res.user[0].first_name);
            setValue('last_name', res.user[0].last_name);
            setValue('phone', res.user[0].contact_no);
            setValue('email', res.user[0].email);
            // setValue('address', res.user.address);
            setValue('city', res.user[0].city);
            // setValue('province', res.user.address);
            setSelectedProvince(res.user[0].state)
            setValue('zipcode', res.user[0].zipcode);
            setUserData(res.user[0])

          }
        } catch (err) {
          notifyError(err ? err?.response?.data?.message : err.message);
        }
      })();
    }
  }, [id, setValue]);

  return {
    userData,
    register,
    handleSubmit,
    onSubmit,
    errors,
    setImageUrl,
    imageUrl,
    selectedProvince, 
    setSelectedProvince,
    handleProvince
  };
};

export default useCustomerSubmit;
