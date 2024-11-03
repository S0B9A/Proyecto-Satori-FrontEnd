import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';

SelectCombos.propTypes = {
  data: PropTypes.array,
  field: PropTypes.object,
};

export function SelectCombos({ field, data }) {
  return (
    <>
      <>
        <InputLabel id="combo">Combo</InputLabel>
        <Select
          {...field}
          labelId="combo"
          label="combo"
          multiple
          defaultValue={[]}
          value={field.value}
        >
          {data &&
            data.map((combo) => (
              <MenuItem key={combo.id} value={combo.id}>
                {combo.nombre} - {combo.id}
              </MenuItem>
            ))}
        </Select>
      </>
    </>
  );
}
