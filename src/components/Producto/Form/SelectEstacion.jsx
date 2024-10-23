import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';

SelectEstacion.propTypes = {
  data: PropTypes.array,
  field: PropTypes.object,
};

export function SelectEstacion({ field, data }) {
  return (
    <>
      <>
        <InputLabel id="estacion">Estacion</InputLabel>
        <Select
          {...field}
          labelId="estacion"
          label="Estacion"
          multiple
          defaultValue={[]}
          value={field.value}
        >
          {data &&
            data.map((estacion) => (
              <MenuItem key={estacion.id} value={estacion.id}>
                {estacion.nombre} - {estacion.id}
              </MenuItem>
            ))}
        </Select>
      </>
    </>
  );
}
