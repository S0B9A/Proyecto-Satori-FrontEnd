import React from 'react';
import PropTypes from 'prop-types';
import { Container } from '@mui/material';
import Header from './Header';
import Main from './Main';  // O 'Container' si prefieres este nombre
import { Footer } from './Footer';

Layout.propTypes = { 
  children: PropTypes.node.isRequired,
};

export function Layout({ children }) {
  return (
    <>
      <Header class="headerNav" >
        <Main pathname="/dashboard" />
      </Header>
      <Container
        maxWidth="xl"
        style={{ paddingTop: '1rem', paddingBottom: '4.5rem' }}
      >
        {children}
      </Container>
      <Footer />
    </>
  );
}