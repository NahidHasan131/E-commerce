import React, { useContext, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import './CSS/Search.css';

const SearchPopup = ({ onClose }) => {
    const [query, setQuery] = useState('');
    const { searchProducts, searchResults } = useContext(ShopContext);

    const handleSearch = () => {
        searchProducts(query);
    };

    return (
        <div className="search-popup">
            <div className="search-popup-content">
                <button className="close-btn" onClick={onClose}>X</button>
                <input
                    type="text" 
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
                <div className="search-results">
                    {searchResults.length > 0 ? (
                        searchResults.map((product) => (
                            <div key={product.id} className="search-item">
                                <p>Product: {product.name}</p>
                                <p className='space'>Price: Tk.{product.new_price}</p>
                            </div>
                        ))
                    ) : (
                        <p>No products found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPopup;
