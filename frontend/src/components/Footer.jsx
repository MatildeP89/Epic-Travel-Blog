import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import '../App.css'; 

const Footer = () => {
  return (
    <footer className="mt-5 py-2 footer">
      <Container>
        <Row>
          {/* Sezione Chi Siamo */}
          <Col md={6}>
            <h5>🌍 Who are we? </h5>
            <p>
              Welcome to <strong> Epi Travel </strong>, the travel blog for explorers like you.
              Find out more about itineraries, travel advice and much more! Here on Epi Travel you can find inspiration for your next trip, wherever it will take you!
            </p>
          </Col>

                    {/* Social Media */}
          <Col md={6}>
            <h5>📲 Follow us</h5>
            <p></p>
            <a href="https://instagram.com" className="text-light me-3">📷 Instagram</a>
            <a href="https://facebook.com" className="text-light me-3">📖 Facebook</a>
            <a href="https://youtube.com" className="text-light">🎥 YouTube</a>
          </Col>
        </Row>

        {/* Copyright */}
        <Row className="mt-4">
          <Col className="text-center">
            <p className="m-0">© 2025 Epi Travel Blog - All rights reserved. </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;