import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { createPurchase } from "../../service/purchases/purchaseService";
import { getProducts } from "../../service/products/productService";
import { getProviders } from "../../service/providers/providerService";
import { toast } from "react-toastify";

const newPurchase = () => {
  const [providers, setProviders] = useState([]);
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    series: "",
    billNumber: "",
    issueDate: "",
    purchaseDate: "",
    totalAmount: 0,
    idProvider: "",
    movementDate: "",
    reason: "",
    details: [],
  });

  const [currentDetail, setCurrentDetail] = useState({
    idProduct: "",
    amount: 1,
    expirationDate: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    getProducts().then(setProducts);
    getProviders().then(setProviders);
  }, []);

  const canAddDetail = () => {
    const err = {};
    if (!currentDetail.idProduct) err.idProduct = "Selecciona un producto";
    if (!currentDetail.amount || currentDetail.amount <= 0)
      err.amount = "Cantidad debe ser mayor a 0";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const calculateTotalAmount = (details) => {
    return details.reduce((acc, detail) => {
      const product = products.find(
        (p) => p.idProduct === Number(detail.idProduct)
      );
      if (!product) return acc;
      return acc + product.purchasePrice * detail.amount;
    }, 0);
  };

  const calculateProductTotal = (detail) => {
    const product = products.find(
      (p) => p.idProduct === Number(detail.idProduct)
    );
    return product ? product.purchasePrice * detail.amount : 0;
  };

  const handleAddDetail = () => {
    if (!canAddDetail()) return;

    const newDetails = [...formData.details, { ...currentDetail }];
    const newTotal = calculateTotalAmount(newDetails);

    setFormData((prev) => ({
      ...prev,
      details: newDetails,
      totalAmount: newTotal,
    }));

    setCurrentDetail({
      idProduct: "",
      amount: 1,
      expirationDate: "",
    });
    setErrors({});
  };

  const validateForm = () => {
    const err = {};
    if (!formData.series.trim()) err.series = "La serie es requerida";
    if (!formData.billNumber.trim()) err.billNumber = "Número de factura requerido";
    if (!formData.issueDate) err.issueDate = "Fecha de emisión requerida";
    if (!formData.purchaseDate) err.purchaseDate = "Fecha de compra requerida";
    if (!formData.idProvider) err.idProvider = "Debe seleccionar un proveedor";
    if (!formData.movementDate) err.movementDate = "Fecha de movimiento requerida";
    if (!formData.reason.trim()) err.reason = "Razón es requerida";
    if (formData.details.length === 0) err.details = "Debe agregar al menos un producto";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  const issueDateISO = formData.issueDate ? formData.issueDate + "T00:00:00" : null;

  const dataToSend = {
    ...formData,
    idProvider: Number(formData.idProvider),
    issueDate: issueDateISO,
    details: formData.details.map((d) => ({
      ...d,
      idProduct: Number(d.idProduct),
    })),
    totalAmount: Number(formData.totalAmount),
  };

  try {
    const res = await createPurchase(dataToSend);
    toast.success("Compra creada con éxito");
    console.log("Respuesta backend:", res);

    setFormData({
      series: "",
      billNumber: "",
      issueDate: "",
      purchaseDate: "",
      totalAmount: 0,
      idProvider: "",
      movementDate: "",
      reason: "",
      details: [],
    });
  } catch (err) {
    console.error("Error al crear compra:", err);
    toast.error("Error al crear la compra");
  }
};

  return (
    <div className="container">
      <Form onSubmit={handleSubmit}>
        <h3 className="fz-checkout-title">Datos de la Factura</h3>
        <Row className="gy-3">
          <Col md={6}>
            <Form.Group controlId="series">
              <Form.Label>Serie</Form.Label>
              <Form.Control
                type="text"
                value={formData.series}
                onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                isInvalid={!!errors.series}
              />
              <Form.Control.Feedback type="invalid">{errors.series}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="billNumber">
              <Form.Label>Número de factura</Form.Label>
              <Form.Control
                type="text"
                value={formData.billNumber}
                onChange={(e) => setFormData({ ...formData, billNumber: e.target.value })}
                isInvalid={!!errors.billNumber}
              />
              <Form.Control.Feedback type="invalid">{errors.billNumber}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row className="gy-3 mt-3">
          <Col md={6}>
            <Form.Group controlId="issueDate">
              <Form.Label>Fecha de emisión</Form.Label>
              <Form.Control
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                isInvalid={!!errors.issueDate}
              />
              <Form.Control.Feedback type="invalid">{errors.issueDate}</Form.Control.Feedback>
            </Form.Group>
          </Col>
<Col md={6}>
    <Form.Group controlId="purchaseDate">
      <Form.Label>Fecha de compra</Form.Label>
      <Form.Control
        type="date"
        value={formData.purchaseDate}
        onChange={(e) =>
          setFormData({
            ...formData,
            purchaseDate: e.target.value,
            movementDate: e.target.value,  // Actualizar movementDate igual que purchaseDate
          })
        }
        isInvalid={!!errors.purchaseDate}
      />
      <Form.Control.Feedback type="invalid">{errors.purchaseDate}</Form.Control.Feedback>
    </Form.Group>
  </Col>
        </Row>
        <Row className="gy-3 mt-3">
          <Col md={12}>
            <Form.Group controlId="idProvider">
              <Form.Label>Selecciona un proveedor</Form.Label>
              <Form.Select
                value={formData.idProvider}
                onChange={(e) => setFormData({ ...formData, idProvider: e.target.value })}
                isInvalid={!!errors.idProvider}
              >
                <option value="">Selecciona un proveedor</option>
                {providers.map((prov) => (
                  <option key={prov.idProvider} value={prov.idProvider}>
                    {prov.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.idProvider}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row className="gy-3 mt-3">
<Col md={6}>
    <Form.Group controlId="movementDate">
      <Form.Label>Fecha de movimiento</Form.Label>
      <Form.Control
        type="date"
        value={formData.movementDate}
        readOnly
        // o si prefieres, usar disabled
        // disabled
        isInvalid={!!errors.movementDate}
      />
      <Form.Control.Feedback type="invalid">{errors.movementDate}</Form.Control.Feedback>
    </Form.Group>
  </Col>
          <Col md={6}>
            <Form.Group controlId="reason">
              <Form.Label>Razón</Form.Label>
              <Form.Control
                type="text"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                isInvalid={!!errors.reason}
              />
              <Form.Control.Feedback type="invalid">{errors.reason}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <h3 className="fz-checkout-title mt-4">Detalles de Productos</h3>
        <Row className="gy-3 align-items-end">
          <Col md={4}>
            <Form.Group controlId="idProduct">
              <Form.Label>Selecciona un producto</Form.Label>
              <Form.Select
                value={currentDetail.idProduct}
                onChange={(e) => setCurrentDetail({ ...currentDetail, idProduct: e.target.value })}
                isInvalid={!!errors.idProduct}
              >
                <option value="">Selecciona un producto</option>
                {products.map((prod) => (
                  <option key={prod.idProduct} value={prod.idProduct}>
                    {prod.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.idProduct}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group controlId="amount">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={currentDetail.amount}
onChange={(e) => {
  const val = e.target.value;
  // Permite que sea vacío, o un número mayor o igual a 1
  if (val === "") {
    setCurrentDetail({
      ...currentDetail,
      amount: val,  // vacio temporalmente
    });
  } else {
    const num = parseInt(val);
    if (!isNaN(num) && num >= 1) {
      setCurrentDetail({
        ...currentDetail,
        amount: num,
      });
    }
  }
}}
                isInvalid={!!errors.amount}
              />
              <Form.Control.Feedback type="invalid">{errors.amount}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="expirationDate">
              <Form.Label>Fecha de expiración</Form.Label>
              <Form.Control
                type="date"
                value={currentDetail.expirationDate}
                onChange={(e) => setCurrentDetail({ ...currentDetail, expirationDate: e.target.value })}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="mt-3">
          <button
            type="button"
            onClick={handleAddDetail}
            className="fz-1-banner-btn cart-checkout-btn checkout-form-btn"
          >
            Agregar producto
          </button>
        </div>
        {errors.details && <div className="text-danger mt-2">{errors.details}</div>}

        {formData.details.length > 0 && (
          <div className="mt-4">
            <h4 className="fz-checkout-title">Resumen de la Compra</h4>
            <ul className="checkout-summary">
              {formData.details.map((d, i) => {
                const prod = products.find((p) => p.idProduct === Number(d.idProduct));
                return (
                  <li key={i}>
                    <span className="checkout-summary__key">
                      {prod?.name} - Cantidad: {d.amount}
                    </span>
                    <span className="checkout-summary__value">
                      ${calculateProductTotal(d).toFixed(2)}
                    </span>
                  </li>
                );
              })}
              <li className="cart-checkout-total">
                <span className="checkout-summary__key">Total compra</span>
                <span className="checkout-summary__value">
                  ${formData.totalAmount.toFixed(2)}
                </span>
              </li>
            </ul>
          </div>
        )}

        <div className="mt-4">
          <button type="submit" className="fz-1-banner-btn cart-checkout-btn checkout-form-btn">
            Crear compra
          </button>
          <br></br>
          <br></br>
          <br></br>
        </div>
      </Form>
    </div>
  );
};

export default newPurchase;