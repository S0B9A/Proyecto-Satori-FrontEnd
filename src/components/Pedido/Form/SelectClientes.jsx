import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';

SelectClientes.propTypes = {
  data: PropTypes.array,
  field: PropTypes.object,
};
export function SelectClientes({ field, data }) {
  return (
    <>
      <>
        <InputLabel id="cliente">cliente</InputLabel>
        <Select
          {...field}
          labelId="cliente"
          label="cliente"
          defaultValue=""
          value={field.value}
        >
          {data &&
            data.map((cliente) => (
              <MenuItem key={cliente.id} value={cliente.id}>
                {cliente.nombre} {cliente.email}    
              </MenuItem>
            ))}
        </Select>
      </>
    </>
  );
}
