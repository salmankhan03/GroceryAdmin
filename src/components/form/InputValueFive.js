import { Input } from '@windmill/react-ui';

const InputValueFive = ({
  register,
  required,
  maxValue,
  minValue,
  defaultValue,
  name,
  label,
  type,
  placeholder,

}) => {
  const value = {
    valueAsNumber: true,
    required: required ? false : `${label} is required!`,
    max: {
      value: maxValue,
      message: `Maximum value ${maxValue}!`,
    },
    min: {
      value: minValue,
      message: `Minimum value ${minValue}!`,
    },
    pattern: {
      value: /^[0-9]*$/,
      message: `Invalid ${label}!`,
    },
    // onBlur: (e) => handleTotalVolume(e.target.value, 'stock'),
  };

  const handleBlur = (e) => {
    const inputValue = e.target.value;
    const nonNegativeValue = inputValue < 0 ? 0 : inputValue;

    e.target.value = nonNegativeValue;

    value.onBlur && value.onBlur(e);
  };

  return (
    <>
      <div className={`flex flex-row`}>
        <Input
          {...register(`${name}`, value)}
          defaultValue={defaultValue}
          type={type}
          placeholder={placeholder}
          name={name}
          onBlur={handleBlur}
          className="bg-gray-50 mr-2 rounded  w-full h-12 p-2 text-sm border border-gray-300 focus:bg-white focus:border-gray-300 focus:outline-none"
        />
      </div>
    </>
  );
};

export default InputValueFive;
