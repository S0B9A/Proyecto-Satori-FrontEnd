import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';

SelectEstancion.propTypes = {
  data: PropTypes.array,
  field: PropTypes.object,
};
export function SelectEstancion({ field, data }) {
  return (
    <>
      <>
        <InputLabel id="estacion">Estancion</InputLabel>
        <Select
          {...field}
          labelId="estacion"
          label="estacion"
          defaultValue=""
          value={field.value}
        >
          {data &&
            data.map((estacion) => (
              <MenuItem key={estacion.id} value={estacion.id}>
                {estacion.nombre}
              </MenuItem>
            ))}
        </Select>
      </>
    </>
  );
}
