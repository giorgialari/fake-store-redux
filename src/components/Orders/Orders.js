import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ReactPaginate from 'react-paginate';
import Button from 'react-bootstrap/Button';
import './Orders.css';
import { getAllOrders, deleteOrder } from '../../api/Api';


import { useSelector, useDispatch } from 'react-redux';
import { getAllOrdersStore, deleteOrderStore } from '../../store/ordersSlice';

const Orders = () => {
    const ordersStore = useSelector((state) => state.ordersStore.currentOrders);
    const dispatch = useDispatch();

    useEffect(() => {
        getAllOrders()
            .then((response) => {
                dispatch(getAllOrdersStore(response));
            })
            .catch((error) => {
                console.log(error);
            });
    }, [dispatch]);


    //Ricerca 
    const [searchText, setSearchText] = useState('');

    const FilteredOrders = ordersStore.filter(ordersStore => {
        return ordersStore.first_name.toLowerCase().includes(searchText.toLowerCase());
    });

    //Paginazione
    const [pageNumber, setPageNumber] = useState(0);
    const [ordersPerPage, setOrdersPerPage] = useState(10);
    const pagesVisited = pageNumber * ordersPerPage;
    const pageCount = Math.ceil(FilteredOrders.length / ordersPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };
    const ordiniPerPagina = (e) => {
        setOrdersPerPage(parseInt(e.target.value));
    };


    const navigate = useNavigate();
    const goToEditOrder = (id) => {
        localStorage.setItem('id', id)
        navigate('/edit-order/' + id)
    }
    const visibleOrders = FilteredOrders.slice(pagesVisited, pagesVisited + ordersPerPage)
    //METODO CORRETTO CHE SI ADATTA A UN'API REALE. 
    // Questa api manda solo un messaggio di successo ma non elimina davvero il prodotto dal DB
    const deleteCurrentOrder = (id) => {
        deleteOrder(id)
            .then(() => getAllOrdersStore()
                .then((data) => dispatch(deleteOrderStore(data))))
    }

    //Metodo con filter per eliminare i dati dal db in maniera fittizia
    // const deleteCurrentOrder = (id) => {
    //     deleteOrder(id)
    //         .then(() => {
    //             dispatch(deleteOrderStore(ordersStore.filter(order => order.id !== id)))
    //         })
    // }

    return (
        <div className='container-fluid container-table'>
            <h3>Orders</h3>
            <div className='search-container'>
                <div>
                    <InputGroup className='mb-3'>
                        <InputGroup.Text id='inputGroup-sizing-default'>
                            Search
                        </InputGroup.Text>
                        <Form.Control
                            aria-label='Default'
                            aria-describedby='inputGroup-sizing-default'
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </InputGroup>
                </div>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th>Name</th>
                        <th>LastName</th>
                        <th>Address</th>
                        <th>Paid</th>
                        <td>Actions</td>
                    </tr>
                </thead>
                <tbody>
                    {visibleOrders.map((data) => {
                        return (
                            <tr key={data.id}>
                                <td>{data.id}</td>
                                <td>{data.product}</td>
                                <td>{data.first_name}</td>
                                <td>{data.last_name}</td>
                                <td>{data.address}</td>
                                <td>{data.paid === true ? 'Yes' : 'No'}</td>
                                <td>
                                    <div className='btn-container'>
                                        <Button variant="warning" onClick={() => goToEditOrder(data.id)}>Edit</Button>
                                        <Button variant="danger" onClick={() => deleteCurrentOrder(data.id)}>Delete</Button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
            <div className='pagination-container'>
                <div className='select-container'>
                    <Form.Select aria-label="Default select example" className='select-pagination ordini-pagina' onChange={ordiniPerPagina}>
                        <option value="5">5</option>
                        <option value="10" selected>10</option>
                        <option value="20">20</option>
                    </Form.Select>
                </div>
                <div>
                    <ReactPaginate
                        nextLabel="Next"
                        onPageChange={changePage}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={2}
                        pageCount={pageCount}
                        previousLabel="Previous"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        breakLabel="..."
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        containerClassName="pagination"
                        activeClassName="active"
                        renderOnZeroPageCount={null}
                    />
                </div>
            </div>

        </div>
    );
};

export default Orders;
