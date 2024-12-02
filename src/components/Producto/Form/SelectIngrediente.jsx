import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';

SelectIngrediente.propTypes = {
  data: PropTypes.array,
  field: PropTypes.object,
};

export function SelectIngrediente({ field, data }) {
  return (
    <>
      <>
        <InputLabel id="ingrediente">Ingrediente</InputLabel>
        <Select
          {...field}
          labelId="ingrediente"
          label="Ingrediente"
          multiple
          defaultValue={[]}
          value={field.value}
        >
          {data &&
            data.map((ingrediente) => (
              <MenuItem key={ingrediente.id} value={ingrediente.id}>
                {ingrediente.nombre} - {ingrediente.id}
              </MenuItem>
            ))}
        </Select>
      </>
    </>
  );
}
