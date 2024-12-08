import React, { useState, useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import { Container, Card, Button, Form, ToggleButtonGroup, ToggleButton, Modal } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../App.css";

function ScalePage() {
  const location = useLocation();
  const numBags = location.state?.numBags || 0;
  const [selectedCategory, setSelectedCategory] = useState("fruits");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [weight, setWeight] = useState(0);
  const [price, setPrice] = useState(0);
  const [showQRCode, setShowQRCode] = useState(false);
  const scrollContainerRef = useRef(null);
  const IP = "10.200.22.133";

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://10.200.22.133:5555/get-cantaribile`);
      const data = response.data.data;
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    getPathAfterThirdSlash("../assets/images/kiwi.jpg")
  }, []);

  const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newWeight = parseFloat(event.target.value);
    if (newWeight >= 0) {
      setWeight(newWeight);
      setPrice(newWeight * (selectedProduct?.pret || 0) + numBags * 0.12);
    }
  };

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    setWeight(0);
    setPrice(numBags * 0.12);
    setShowQRCode(false);
  };

  const confirmPurchase = () => {
    setShowQRCode(true);
  };

  const resetScale = () => {
    setSelectedProduct(null);
    setWeight(0);
    setPrice(numBags * 0.12);
    setShowQRCode(false);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const filteredProducts = products.filter(product => product.tip === "cantaribil");
  const fruitsList = ["Mere", "Banane", "Portocale", "Struguri", "Kiwi", "Ananas", "Pere", "Pepene rosu", "Pepene galben"];
  const vegetablesList = ["Vinete", "Cartofi", "Morcovi", "Ceapa", "Ardei Gras", "Rosii", "Castraveti", "Varza", "Broccoli"];

  const fruits = filteredProducts.filter(product => fruitsList.includes(product.nume));
  const vegetables = filteredProducts.filter(product => vegetablesList.includes(product.nume));

  function getPathAfterThirdSlash(path: string): string {
    const parts = path.split('/');
    return "/images/" + parts.slice(3).join('/')
  }

  return (
    <Container className="App">
      <header className="App-header">
        <h1 className="my-4">Cântar</h1>

        <div className="category-selection">
          <ToggleButtonGroup
            type="radio"
            name="categories"
            value={selectedCategory}
            className="mb-4"
            onChange={(value) => setSelectedCategory(value)}
          >
            <ToggleButton
              id="fruits-btn"
              value="fruits"
              variant="outline-primary"
              style={{ backgroundColor: selectedCategory === "fruits" ? "#FF0000" : "transparent", borderColor: "#000000", color: "#000000" }}
            >
              Fructe
            </ToggleButton>
            <ToggleButton
              id="vegetables-btn"
              value="vegetables"
              variant="outline-success"
              style={{ backgroundColor: selectedCategory === "vegetables" ? "#FF0000" : "transparent", borderColor: "#000000", color: "#000000" }}
            >
              Legume
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        <div className="position-relative">
          <button className="scroll-button left" onClick={scrollLeft}>
            <FaChevronLeft />
          </button>
          <div className="scroll-container" ref={scrollContainerRef}>
            {(selectedCategory === "fruits" ? fruits : vegetables).map((product) => (
              <Card
                key={product._id}
                onClick={() => handleProductSelect(product)}
                className={`product-card ${selectedProduct?._id === product._id ? "selected" : ""}`}
                style={{ borderColor: selectedProduct?._id === product._id ? "#FF0000" : "transparent" }}
              >
                <div className="card-img-container">
                  <Card.Img variant="top" src={getPathAfterThirdSlash(product.poza)} />
                </div>
                <Card.Body className="d-flex flex-column align-items-center">
                  <Card.Title>{product.nume}</Card.Title>
                  <Card.Text className="text-muted">{product.pret} lei/kg</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>
          <button className="scroll-button right" onClick={scrollRight}>
            <FaChevronRight />
          </button>
        </div>

        {selectedProduct && (
          <div className="scale-section mt-4">
            <h3>Produs selectat: {selectedProduct.nume}</h3>
            <Form.Group className="mb-3 d-flex flex-column align-items-center">
              <Form.Label>Greutate (kg):</Form.Label>
              <Form.Control type="number" min="0" value={weight} onChange={handleWeightChange} style={{ maxWidth: '100px' }} />
            </Form.Group>
            <p>Preț: {price.toFixed(2)} lei</p>
            <Button variant="success" className="me-2" onClick={confirmPurchase} style={{ backgroundColor: "#FF0000", borderColor: "#FF0000" }}>
              Confirmă
            </Button>
            <Button variant="danger" onClick={resetScale} style={{ backgroundColor: "#000000", borderColor: "#000000" }}>
              Resetează
            </Button>
          </div>
        )}

        <Modal show={showQRCode} onHide={() => setShowQRCode(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Cod QR pentru achiziție</Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex justify-content-center">
            {selectedProduct && (
              <QRCode
                value={`${selectedProduct._id},${weight},${price}`}
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowQRCode(false)}>
              Închide
            </Button>
          </Modal.Footer>
        </Modal>
      </header>
    </Container>
  );
}

export default ScalePage;