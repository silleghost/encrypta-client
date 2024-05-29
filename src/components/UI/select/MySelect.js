import React, { forwardRef } from "react";
import "./MySelect.css";

const MySelect = forwardRef(({ options, ...props }, ref) => (
  <select ref={ref} className="my-select" {...props}>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
));

export default MySelect;
