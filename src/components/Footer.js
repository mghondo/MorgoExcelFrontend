import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: '#3d6428',
      color: 'white',
      position: 'relative',
      bottom: 0,
      width: '100%',
      height: '60px',
      lineHeight: '60px'
    }}>
      <Container>
        <Row>
          <Col className="text-center">
            &copy; {currentYear} Morgan Hondros. All rights reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
