import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from 'react-router-dom'; // Import NavLink
import logo from "../../images/VerdantLogo.jpg"; // Adjust the path as needed
import "./Navbar.css"; // Import the CSS file

const NavBar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand
          href="/"
          rel="noopener noreferrer"
        >
          <img
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="Verdant Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link
              href="/"
              rel="noopener noreferrer"
            >
              Home
            </Nav.Link>
            {/* <Nav.Link
              href="https://pine.backoffice.dutchie.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Backoffice
            </Nav.Link>
            <Nav.Link
              href="https://pine.pos.dutchie.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Register
            </Nav.Link>
            <Nav.Link
              href="https://www.verdantcreations.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shop Verdant
            </Nav.Link> */}
            {/* Use NavLink for the Ordering page */}
            <Nav.Link href="/ordering" className={({ isActive }) => (isActive ? 'active' : '')}>
              Ordering
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
