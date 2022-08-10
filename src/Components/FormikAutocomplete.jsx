import { Autocomplete, fieldToTextField, TextField } from "@mui/material";
import React from "react";

const FormikAutocomplete = ({ textFieldProps, ...props }) => {
  const {
    form: { setTouched, setFieldValue },
  } = props;
  const { error, helperText, ...field } = fieldToTextField(props);
  const { name } = field;

  return (
    <Autocomplete
      {...props}
      {...field}
      onChange={(_, value) => setFieldValue(name, value)}
      onBlur={() => setTouched({ [name]: true })}
      renderInput={(props) => <TextField {...props} {...textFieldProps} helperText={helperText} error={error} />}
    />
  );
};

export default FormikAutocomplete;
