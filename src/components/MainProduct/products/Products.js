import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import ReactPaginate from 'react-paginate';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import './Products.css';
import { getAllProducts, deleteProduct } from '../../../api/Api';

import { useSelector, useDispatch } from 'react-redux';
import { getAllProductsStore, deleteProductStore } from '../../../store/productsSlice';


function Products() {
    const products = useSelector((state) => state.products.currentProducts); // recupera il prodotto dallo store
    const dispatch = useDispatch(); // crea una funzione dispatch per inviare azioni al reducer

    const navigate = useNavigate();
    useEffect(() => {
        localStorage.clear()
        getAllProducts()
            .then((response) => {
                dispatch(getAllProductsStore(response)); // Imposta i prodotti nello store
            })
            .catch((error) => {
                console.log(error);
            });
    }, [dispatch]);

    const goToProductDetails = (id) => {
        localStorage.setItem('id', id)
        navigate('/product/' + id)
    }
    const goToProductEdit = (id) => {
        localStorage.setItem('id', id)
        navigate('/edit-product/' + id)
    }
    //METODO CORRETTO CHE SI ADATTA A UN'API REALE. 
    // Questa api manda solo un messaggio di successo ma non elimina davvero il prodotto dal DB
    // const deleteCurrentProduct = (id) =>{
    //     deleteProduct(id)
    //     .then(() => getAllProducts()
    //      .then((data) => dispatch(deleteProductStore(data))))
    // }

    //Metodo con filter per eliminare i dati dal db in maniera fittizia
    const deleteCurrentProduct = (id) => {
        deleteProduct(id)
            .then(() => {
                dispatch(deleteProductStore(products.filter(product => product.id !== id)))
            })
    }


        //Ricerca 
        const [searchText, setSearchText] = useState('');

        const FilteredProducts = products.filter(products => {
            return products.title.toLowerCase().includes(searchText.toLowerCase());
        });
    
        //Paginazione
        const [pageNumber, setPageNumber] = useState(0);
        const [productsPerPage, setProductsPerPage] = useState(10);
        const pagesVisited = pageNumber * productsPerPage;
        const pageCount = Math.ceil(FilteredProducts.length / productsPerPage);
    
        const changePage = ({ selected }) => {
            setPageNumber(selected);
        };
        const prodottiPerPagina = (e) => {
            setProductsPerPage(parseInt(e.target.value));
        };
        const visibleProducts = FilteredProducts.slice(pagesVisited, pagesVisited + productsPerPage)
    return (
        <div>
            <h2>Manage Products</h2>
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
            <div className='products'>
                {Array.isArray(visibleProducts) ? ( //verifica che products sia un array prima di mapparlo, 
                    //corregge l'errore products.map is not a function che si presentava passando da /update-product a /products
                    visibleProducts.map((data) => { // parentesi graffa corretta
                        return (
                            <div key={data.id}>
                                <Card className="single-product" style={{ width: '18rem' }}>
                                    <div className='img-container'>
                                        <Card.Img className="single-product-img" variant="top" src={data.image} />
                                    </div>
                                    <Card.Body>
                                        <Card.Title>{data.title}</Card.Title>
                                        <div className='btn-container'>
                                            <Button variant="danger" onClick={() => deleteCurrentProduct(data.id)}>Delete</Button>
                                            <Button variant="warning" onClick={() => goToProductEdit(data.id)}>Edit</Button>
                                            <Button variant="primary" onClick={() => goToProductDetails(data.id)}>Details</Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        )
                    })
                ) : (
                    <p>Caricamento in corso...</p>
                )}
            </div>
            <div className='pagination-container'>
                <div className='select-container'>
                    <Form.Select aria-label="Default select example" className='select-pagination ordini-pagina' onChange={prodottiPerPagina}>
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

    )
}

export default Products