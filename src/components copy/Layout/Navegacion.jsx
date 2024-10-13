import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';

export const NAVIGATION = [
  {
    kind: 'header',
    title: 'Opciones para disfrutar nuestra comida',
  },
  {
    segment: 'Productos',
    title: 'Productos',
    icon: <DashboardIcon />,
  },
  {
    segment: 'orders',
    title: 'Ordenes',
    icon: <ShoppingCartIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    segment: 'reports',
    title: 'Registro de pedidos',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'sales',
        title: 'Historial de pedidos',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'traffic',
        title: 'Pedidos en preparacion',
        icon: <DescriptionIcon />,
      },
      
    ],
  },
  {
    segment: 'integrations',
    title: 'Opciones',
    icon: <LayersIcon />,
  },
];
