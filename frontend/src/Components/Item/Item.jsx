import React from 'react'
import './item.css'

const Item = (props) => {
  return (
    <div className='item'>
        <img src={props.image} alt="" />
        <p>{props.name}</p>
        <div className="item-prices">
            <div className="item-price-new">
                Tk.{props.new_price}
            </div>
            <div className="item-price-old">
                Tk.{props.old_price}
            </div>
        </div>
    </div>
  )
}

export default Item