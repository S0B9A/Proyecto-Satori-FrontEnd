import React from "react";
import PropTypes from "prop-types";
import { Container } from "@mui/material";
import Header from "./Header";
import { Footer } from "./Footer";
import { Toaster } from 'react-hot-toast';

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export function Layout({ children }) {
  return (
    <>
      <Header class="headerNav">
      <Toaster position="top-center" />
        {children}
        <Footer />
      </Header>

      <Container
        maxWidth="xl"
        style={{ paddingTop: "1rem", paddingBottom: "4.5rem" }}
      ></Container>
      
    </>
    
  );
}
