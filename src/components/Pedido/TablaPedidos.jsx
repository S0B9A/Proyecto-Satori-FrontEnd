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
import MenuServices from '../../Services/MenuServices';
import PedidoServices from '../../Services/PedidoServices';
import Pusher from "pusher-js"; // Importamos la librería de Pusher
import { toast } from "react-hot-toast";

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
        id: 'estado',
        numeric: false,
        disablePadding: true,
        label: 'Estado',
    },
    {
        id: 'metodo_entrega',
        numeric: false,
        disablePadding: false,
        label: 'Metodo entrega',
    },
    {
        id: 'fecha',
        numeric: false,
        disablePadding: false,
        label: 'Fecha',
    },
    {
        id: 'id_cliente',
        numeric: false,
        disablePadding: false,
        label: 'Cliente',
    },
];

// Encabezado tabla
function TablaPedidosHead(props) {
    const { order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell>
                    <Tooltip title="Crear">
                        <IconButton component={Link} to="">
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
TablaPedidosHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

// Barra de opciones
function TablaPedidosToolbar(props) {
    const { numSelected, idSelected } = props;
    const navigate = useNavigate();

    const update = () => {
        if (idSelected) {
            navigate(`/pedido/update/${idSelected}`);
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
                    Mantenimiento de Pedidos
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
TablaPedidosToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    idSelected: PropTypes.number.isRequired,
};

// Componente tabla
export default function TablaMenus() {
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
        // Obtener los pedidos desde el API
        PedidoServices.getPedidos()
            .then((response) => {
                setData(response.data || []); // Asignar array vacío si no hay datos
                setError(response.error);
                setLoaded(true);
            })
            .catch((error) => {
                setError('Error al cargar los productos');
                setLoaded(false);
            });

        // Configuración de Pusher para recibir actualizaciones en tiempo real
        const pusher = new Pusher("6044eb48c974063b6561", {
            cluster: "us2",
        });

        const channel = pusher.subscribe('pedido-channel');
        channel.bind('estado-actualizado', (data) => {
            console.log("Pedido actualizado: ", data);
            toast.success(`Pedido actualizado: #${data.pedido.id} - ${data.pedido.estado}`);
            
            // Actualizamos la lista de pedidos cuando se recibe una actualización
            setData((prevData) => {
                // Asegúrate de que el ID de `data.pedido` coincida con los ID en `prevData`
                return prevData.map((pedido) => 
                    pedido.id === data.pedido.id ? { ...pedido, ...data.pedido } : pedido
                );
            });
        });

        // Limpiar la suscripción al canal cuando el componente se desmonte
        return () => {
            pusher.unsubscribe('pedido-channel');
        };
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

    const handleDenseChange = (event) => {
        setDense(event.target.checked);
    };

    // Filtrar elementos seleccionados
    const isSelected = (name) => selected.indexOf(name) !== -1;

    return (
        <>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TablaPedidosToolbar numSelected={selected.length} idSelected={selected[0] || 0} />
                <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                        <TablaPedidosHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={data.length}
                            numSelected={selected.length}
                        />
                        <TableBody>
                            {stableSort(data, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    const isItemSelected = isSelected(row.id);
                                    return (
                                        <TableRow
                                            hover
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
                                                    onClick={(event) => handleClick(event, row.id)}
                                                />
                                            </TableCell>
                                            <TableCell>{row.estado}</TableCell>
                                            <TableCell>{row.metodo_entrega}</TableCell>
                                            <TableCell>{row.fecha}</TableCell>
                                            <TableCell>{row.id_cliente}</TableCell>
                                        </TableRow>
                                    );
                                })}
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
        </>
    );
}
