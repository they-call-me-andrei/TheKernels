import React, { useState } from 'react';
import { Container, Button, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [numBags, setNumBags] = useState(0);

  const handleStart = () => {
    setShowModal(true);
  };

  const handleConfirmBags = () => {
    setShowModal(false);
    navigate('/scale', { state: { numBags } });
  };

  return (
    <Container className="text-center my-5">
      <img src='../images/mega_image_logo.png' alt="Mega Image Logo" className="mb-4" style={{ width: '200px' }} />
      <h1>Bine ați venit la Cântarul Inteligent</h1>
      <Button style={{ marginTop: "20px", backgroundColor: "#FF0000", borderColor: "#FF0000" }} variant="primary" size="lg" onClick={handleStart}>
        Să începem
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Introduceți numărul de pungi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Număr de pungi:</Form.Label>
            <Form.Control
              type="number"
              min="0"
              value={numBags}
              onChange={(e) => setNumBags(parseInt(e.target.value))}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Anulează
          </Button>
          <Button style={{backgroundColor: "#FF0000", borderColor: "#FF0000"}} variant="primary" onClick={handleConfirmBags}>
            Confirmă
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default HomePage;