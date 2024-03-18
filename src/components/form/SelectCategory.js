import { Select } from "@windmill/react-ui";
import React from "react";
import { useTranslation } from "react-i18next";

//internal import

import useAsync from "hooks/useAsync";
import CategoryServices from "services/CategoryServices";
import { showingTranslateValue } from "utils/translate";

const SelectCategory = ({ setCategory, lang }) => {
  const { data } = useAsync(CategoryServices.getAllCategories);
  console.log('data category',data)
  const { t } = useTranslation();
  return (
    <>
      <Select
        onChange={(e) => setCategory(e.target.value)}
        className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
      >
        <option value="" defaultValue >
          {"All Category"}
        </option>
        {data?.tree?.data?.map((cat) => (
          <option key={cat.id} value={cat?.id}>
            {cat?.name}
          </option>
        ))}
      </Select>
    </>
  );
};

export default SelectCategory;
