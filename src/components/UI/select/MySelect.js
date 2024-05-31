import React, { forwardRef } from "react";
import "./MySelect.css";

const MySelect = forwardRef(({ options, ...props }, ref) => (
  <select ref={ref} className="my-select" {...props}>
    {options.map((option, index) => (
      <option key={option.id || index} value={option.id}>
        {option.name}
      </option>
    ))}
  </select>
));

export default MySelect;
