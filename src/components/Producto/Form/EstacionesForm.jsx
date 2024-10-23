import React from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import Tooltip from '@mui/material/Tooltip';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { SelectEstacion } from './SelectEstacion';

EstacionesForm.propTypes = {
  data: PropTypes.array,
  control: PropTypes.object,
  index: PropTypes.number,
  onRemove: PropTypes.func,
  disableRemoveButton: PropTypes.bool,
  field: PropTypes.object,
};

export function EstacionesForm({
  data,
  control,
  index,
  onRemove,
  disableRemoveButton,
  // eslint-disable-next-line no-unused-vars
  field,
}) {
  return (
    <section key={index}>
      <Grid size={12} md={12}>
        <List>
          <ListItem>
            <ListItemIcon>
              <Tooltip title={`estacion ${index + 1}`}>
                <IconButton>
                  <DirectionsRunIcon />
                </IconButton>
              </Tooltip>
            </ListItemIcon>
            <ListItemText>
              <Controller
                key={index}
                name={`estaciones.${index}.id`}
                control={control}
                render={({ field }) => (
                  <SelectEstacion field={field} data={data} />
                )}
              />
              
            </ListItemText>
            <ListItemIcon>
              <Tooltip title={`Eliminar estacion ${index + 1}`}>
                <span>
                  <IconButton
                    key={index}
                    edge="end"
                    disabled={disableRemoveButton}
                    onClick={() => onRemove(index)}
                    aria-label="Eliminar"
                  >
                    <DeleteIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </ListItemIcon>
          </ListItem>
        </List>
      </Grid>
    </section>
  );
}
