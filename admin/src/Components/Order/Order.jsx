import { useEffect, useState } from 'react';
import axios from 'axios';
import './Order.css';

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all orders from the backend
    const fetchAllOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:4000/orders');
            console.log("Backend Response:", response.data); // Debug the response
            if (response.data.success) {
                setOrders(response.data.orders); // Ensure correct field is accessed
            } else {
                alert('Error fetching orders!');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            alert('Failed to fetch orders.');
        } finally {
            setLoading(false);
        }
    };
    

    // Update order status
    const statusHandler = async (event, orderId) => {
        const newStatus = event.target.value;

        try {
            const response = await axios.post('http://localhost:4000/orders/update-status', {
                orderId,
                status: newStatus,
            });

            if (response.data.success) {
                fetchAllOrders(); // Refresh orders after status update
            } else {
                alert('Failed to update order status.');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status.');
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    return (
        <div className='order-container'>
            <h3><i className="fa-solid fa-truck-fast"></i>Orders<i className="fa-solid fa-truck-fast"></i></h3>
            {loading ? (
                <p>Loading orders...</p>
            ) : orders.length > 0 ? (
                
                <div className="order-list">
                    <div className="order-listproduct">
                        <p>Order</p>
                        <p>Title</p>
                        <p>Quantity</p>
                        <p>price</p>
                        <p>Order Status</p>
                    </div>
                    <hr />
                    {orders.map((order, index) => (
                        <div key={index} className='order-item'>
                            <span><i className="fa-solid fa-truck"></i></span>
                            <div>
                                <p className='order-item-food'>
                                    {order.items.map((item, idx) => (
                                        <span key={idx}>
                                            {item.name} x {item.quantity}
                                            {idx < order.items.length - 1 && ', '}
                                        </span>
                                    ))}
                                </p>
                                <p className='order-item-name'>
                                    {order.address.firstName} {order.address.lastName}
                                </p>
                                <div className='order-item-address'>
                                    <p>{order.address.street},</p>
                                    <p>
                                        {order.address.city}, {order.address.state}, {order.address.country},{' '}
                                        {order.address.zipcode}
                                    </p>
                                </div>
                                <p className='order-item-phone'>{order.address.phone}</p>
                            </div>
                            <p>Items: {order.items.length}</p>
                            <p>Total: Tk.{order.amount}</p>
                            <select
                                onChange={(e) => statusHandler(e, order._id)}
                                value={order.status}
                            >
                                <option value="Order Processing">Order Processing</option>
                                <option value="Out for delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    );
};

export default Order;
