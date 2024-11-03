/* eslint-disable no-unused-vars */
import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { useEffect, useState } from 'react';
import ProductoService from '../../Services/ProductoServices';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CombosServices from '../../Services/CombosServices';

// Ordenar descendente
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

// Comparar para ordenar
function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Ordenar
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

// Encabezados de la tabla
const headCells = [
    {
        id: 'nombre',
        numeric: false,
        disablePadding: true,
        label: 'Nombre',
    },
    {
        id: 'descripcion',
        numeric: false,
        disablePadding: false,
        label: 'Descripcion',
    },
    {
        id: 'precio',
        numeric: false,
        disablePadding: false,
        label: 'Precio',
    },
];

// Encabezado tabla
function TablaCombosHead(props) {
    const { order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell>
                    <Tooltip title="Crear">
                        <IconButton component={Link} to="/combo/Crear/">
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

// Propiedades Encabezado tabla
TablaCombosHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

// Barra de opciones
function TablaCombosToolbar(props) {
    const { numSelected, idSelected } = props;
    const navigate = useNavigate();

    const update = () => {
        if (idSelected) {
            navigate(`/combo/update/${idSelected}`);
        }
    };

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} seleccionado
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Mantenimiento de Combos
                </Typography>
            )}

            {numSelected > 0 ? (
                <>
                    <Tooltip title="Borrar">
                        <IconButton>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Actualizar">
                        <IconButton onClick={update}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                </>
            ) : (
                <Tooltip title="Filtrar lista">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
}

// Propiedades Barra de opciones
TablaCombosToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    idSelected: PropTypes.number.isRequired,
};

// Componente tabla
export default function TablaProductos() {
    // Datos a cargar en la tabla
    const [data, setData] = useState([]);
    const [error, setError] = useState('');
    const [loaded, setLoaded] = useState(false);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('nombre');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Obtener lista del API
    useEffect(() => {
        CombosServices.getCombos()
            .then((response) => {
                setData(response.data || []); // Asignar array vacío si no hay datos
                setError(response.error);
                setLoaded(true);
            })
            .catch((error) => {
                setError('Error al cargar los productos');
                setLoaded(false);
            });
    }, []);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleClick = (event, name) => {
        const newSelected = selected.indexOf(name) === 0 ? [] : [name];
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    if (!loaded) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            {data && data.length > 0 && (
                <Box sx={{ width: '100%' }}>
                    <Paper sx={{ width: '100%', mb: 2 }}>
                        <TablaCombosToolbar
                            numSelected={selected.length}
                            idSelected={Number(selected[0]) || 0}
                        />
                        <TableContainer>
                            <Table
                                sx={{ minWidth: 750 }}
                                aria-labelledby="tableTitle"
                                size={dense ? 'small' : 'medium'}
                            >
                                <TablaCombosHead
                                    numSelected={selected.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={handleRequestSort}
                                    rowCount={data.length}
                                />
                                <TableBody>
                                    {stableSort(data, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            const isItemSelected = isSelected(row.id);
                                            const labelId = `enhanced-table-checkbox-${index}`;

                                            return (
                                                <TableRow
                                                    hover
                                                    onClick={(event) => handleClick(event, row.id)}
                                                    role="checkbox"
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={row.id}
                                                    selected={isItemSelected}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            color="primary"
                                                            checked={isItemSelected}
                                                            inputProps={{
                                                                'aria-labelledby': labelId,
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell component="th" id={labelId} scope="row" padding="none">
                                                        {row.nombre}
                                                    </TableCell>
                                                    <TableCell>{row.descripcion}</TableCell>
                                                    <TableCell>{row.precio}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </Box>
            )}
        </>
    );
}
