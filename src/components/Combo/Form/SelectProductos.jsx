import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';

SelectProductos.propTypes = {
  data: PropTypes.array,
  field: PropTypes.object,
};

export function SelectProductos({ field, data }) {
  return (
    <>
      <>
        <InputLabel id="producto">Producto</InputLabel>
        <Select
          {...field}
          labelId="producto"
          label="Producto"
          multiple
          defaultValue={[]}
          value={field.value}
        >
          {data &&
            data.map((producto) => (
              <MenuItem key={producto.id} value={producto.id}>
                {producto.nombre} - {producto.id}
              </MenuItem>
            ))}
        </Select>
      </>
    </>
  );
}
