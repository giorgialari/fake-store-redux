import React, { useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { updateOrder } from '../../../api/Api';

import { useSelector, useDispatch } from 'react-redux';
import { updateOrderStore } from '../../../store/ordersSlice';

function UpdateOrder() {
    const ordersStore = useSelector((state) => state.ordersStore.currentOrderToEdit); // recupera il prodotto dallo store
    const dispatch = useDispatch(); // crea una funzione dispatch per inviare azioni al reducer

    useEffect(() => {
        updateOrder().then((data) => dispatch(updateOrderStore(data)));
    }, [dispatch]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const { first_name, last_name, address, paid, product } = event.target.elements;
        const CurrentProduct = {
            first_name: first_name.value,
            last_name: last_name.value,
            address: address.value,
            paid: paid.value,
            product: product.value,
        };
        const idCurrent = localStorage.getItem('id')
        updateOrder(idCurrent, CurrentProduct)
            .then((response) => {
                dispatch(updateOrderStore(response))
                document.getElementById('alert').style.display = 'block'
            })
    };
    return (
        <div className='form-container'>
            {ordersStore && ordersStore.id ? (
                <Form onSubmit={handleSubmit}>
                    <h3>Edit order</h3>
                    <Alert variant="success" id='alert' style={{ display: 'none', fontSize: '12px', maxWidth: '410px' }}>
                        <Alert.Heading style={{ fontSize: '14px' }}>Prodotto aggiornato con successo</Alert.Heading>
                        <div>
                            I suoi valori aggioranti:
                            <Table striped bordered hover size="sm">
                                <tbody>
                                    <tr>
                                        <th>First name</th>
                                        <td>{ordersStore.first_name}</td>
                                    </tr>
                                    <tr>
                                        <th>Last name</th>
                                        <td>{ordersStore.last_name}</td>
                                    </tr>
                                    <tr>
                                        <th>Address</th>
                                        <td>{ordersStore.address}</td>
                                    </tr>
                                    <tr>
                                        <th>Paid</th>
                                        <td>{ordersStore.paid === true ? 'Yes' : 'No'}</td>
                                    </tr>
                                    <tr>
                                        <th>Product</th>
                                        <td>{ordersStore.product}</td>
                                    </tr>
                                </tbody>
                            </Table>
                            N.B.: L'ordine non verrà aggiornato al DB e quindi non sarà visibile, con l'api Mackaroo i dati sono casuali.
                        </div>
                    </Alert>
                    <div className='title-price-container'>
                        <Form.Group className="mb-3" controlId="formBasicTitle">
                            <Form.Label>First name</Form.Label>
                            <Form.Control
                                className="title-input"
                                type="text"
                                name="first_name"
                                defaultValue={ordersStore.first_name}
                                placeholder=""
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPrice">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control
                                className="price-input"
                                type="text" min="1" step="any" name='last_name'
                                defaultValue={ordersStore.last_name}
                                placeholder="" />
                        </Form.Group>
                    </div>
                    <div className='image-category-container'>
                        <Form.Group className="mb-3" controlId="formBasicImage">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                className="url-input" type="text"
                                name='address'
                                defaultValue={ordersStore.address}
                                placeholder="" />
                        </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicDescription">
                        <Form.Label>Paid</Form.Label>
                        <Form.Control
                            type="text"
                            className="desc-select"
                            name='paid'
                            defaultValue={ordersStore.paid}
                            placeholder="" />
                    </Form.Group>
                    </div>
                    <Form.Group className="mb-3" controlId="formBasicDescription">
                        <Form.Label>Product</Form.Label>
                        <Form.Control as="textarea"
                            type="text"
                            className="desc-select"
                            name='product'
                            defaultValue={ordersStore.product}
                            placeholder="" />
                    </Form.Group>
                    <Button variant="success" type="submit">
                        Add
                    </Button>
                </Form>
            ) : (
                <option>Loading...</option>
            )}
        </div>
    )
}

export default UpdateOrder