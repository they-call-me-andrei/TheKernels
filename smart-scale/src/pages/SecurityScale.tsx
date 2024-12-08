import React, { useState, useEffect, useRef } from 'react';
import { Container, Button, Alert, Form } from 'react-bootstrap';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

function SecurityScale() {
  const [qrNumber, setQrNumber] = useState<number | null>(null);
  const [inputNumber, setInputNumber] = useState<number | ''>('');
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleStartScanning = () => {
    setScanning(true);
    setValidationMessage(null);
  };

  const handleVerify = () => {
    if (qrNumber === null || inputNumber === '') {
      setValidationMessage('Te rugăm să introduci un număr valid!');
      return;
    }

    if (qrNumber === inputNumber) {
      setValidationMessage('Validat');
    } else {
      setValidationMessage(
        `Eroare: gramajul introdus (${inputNumber}g) diferă de gramajul din sistem (${qrNumber}g).`
      );
    }

    setTimeout(() => {
      setQrNumber(null);
      setInputNumber('');
      setValidationMessage(null);
    }, 5000); 
  };

  useEffect(() => {
    if (scanning && videoRef.current) {
      const codeReader = new BrowserMultiFormatReader();
      codeReader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
        if (result) {
          const parsedNumber = parseInt(result.getText(), 10);
          setQrNumber(parsedNumber);
          setScanning(false);
          codeReader.reset();
        }
        if (err && !(err instanceof NotFoundException)) {
          console.error(err);
        }
      });

      return () => {
        codeReader.reset();
      };
    }
  }, [scanning]);

  return (
    <Container className="text-center my-5">
      <img
        src="../images/mega_image_logo.png"
        alt="Mega Image Logo"
        className="mb-4"
        style={{ width: '150px' }}
      />
      <h1>Cântar de control</h1>
      <Button
        style={{ backgroundColor: "#FF0000", borderColor: "#FF0000", marginBottom: '20px' }}
        onClick={handleStartScanning}
      >
        Start Scanning
      </Button>
      {scanning && (
        <div style={{ width: '300px', margin: '0 auto' }}>
          <video ref={videoRef} style={{ width: '100%' }} />
        </div>
      )}
      {qrNumber !== null && (
        <>
          <Form.Group className="my-4" style={{ maxWidth: '300px', margin: '0 auto' }}>
            <Form.Label>Introduceți gramajul:</Form.Label>
            <Form.Control
              type="number"
              value={inputNumber}
              onChange={(e) => setInputNumber(parseFloat(e.target.value))}
              style={{ textAlign: 'center' }}
            />
          </Form.Group>
          <Button
            style={{ backgroundColor: "#FF0000", borderColor: "#FF0000", marginBottom: '20px' }}
            onClick={handleVerify}
          >
            Verifică
          </Button>
        </>
      )}
      {validationMessage && (
        <Alert
          variant={validationMessage === 'Validat' ? 'success' : 'danger'}
          className="mt-4"
        >
          {validationMessage}
        </Alert>
      )}
    </Container>
  );
}

export default SecurityScale;