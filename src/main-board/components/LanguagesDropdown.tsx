import React from "react";
import Select from "react-select";
import { customStyles } from "src/app/constants/customStyles";
import { languageOptions } from "src/app/constants/languageOptions";

const LanguagesDropdown = ({ onSelectChange }: any) => {
  return (
    <Select
      placeholder={`Filter By Category`}
      options={languageOptions}
      styles={customStyles}
      defaultValue={languageOptions[0]}
      onChange={(selectedOption) => onSelectChange(selectedOption)}
    />
  );
};

export default LanguagesDropdown;