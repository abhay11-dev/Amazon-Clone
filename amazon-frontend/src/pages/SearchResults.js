import React, {useEffect, useState} from 'react'
import "../styles/SearchResults.css"
import { useSelector , useDispatch} from 'react-redux'
import Product from '../components/Product'
import LoadingBox from "../components/LoadingBox"
import MessageBox from "../components/MessageBox"
import { listProducts } from '../actions/ProdcutActions'
import PriceCheckBox from '../components/PriceCheckBox'
import {prices} from "../data/priceRanges";
import EmptyState from '../components/EmptyState'


const SearchResults = (props) => {

    const [range, setRange] = useState([0,50000]);
    const [resetTrigger, setResetTrigger] = useState(0);

    const query = props.match.params.query;
    
    const dispatch = useDispatch();

    const productList = useSelector( state => state.productList);
    const {loading,error,products} = productList;


    useEffect(() => {
        dispatch(listProducts());
    }, [dispatch])



    const handleFilters = (filters) => {

        const data = prices;
        let array = [];

        for (let key in data) {
            if (data[key].id === parseInt(filters, 10)) {
                array = data[key].array;
            }
        }
        setRange(array);
    }

    const handleClearFilters = () => {
        setRange([0,50000]);
        setResetTrigger(prev => prev + 1);
    }

    const filteredProducts = products ? products.filter(product=>
        product.name.toLowerCase().includes(query.toLowerCase())
        && product.price <= range[1]
        && product.price >= range[0]
    ) : [];

    return (
        <div className="search-page-container">

            

            <div className="filter-options-container">
                
                <button className="clear-filter-btn" onClick={handleClearFilters}>
                    Clear filters
                </button>
                <h3>
                    Filter Price:
                </h3>

                <PriceCheckBox
                list={prices}
                handleFilters = {filters => handleFilters(filters)}
                resetTrigger={resetTrigger}
                />
                
            </div>

            <div className="search-page-product-container">
                {loading ? <LoadingBox />
                :
                error ? <MessageBox variant="danger">{error}</MessageBox>
                :
                (
                    <>
                    <h2 className="sec-title">Search results for "{query}"</h2>
                    {filteredProducts.length === 0 ? (
                        <EmptyState
                            title="No products match your search or selected filter."
                            message="Please try changing the filter, search with a different keyword, or explore other categories."
                            actionLabel="Clear filters"
                            onAction={handleClearFilters}
                        />
                    ) : (
                        <div className="search-product-container">
                            {filteredProducts.map(filteredProduct => (
                                    <Product key={filteredProduct._id} product={filteredProduct} />
                                ))
                            }
                        </div>
                    )}
                    </>
                )
                }

            </div>
        </div>
    )
}

export default SearchResults
