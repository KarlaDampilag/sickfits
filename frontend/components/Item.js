import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link'

import Title from './styles/Title';
import ItemStyles from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';
import DeleteItem from './DeleteItem';
import formatMoney from '../lib/formatMoney';

const Item = (props) => {
    Item.propTypes = {
        item: PropTypes.object.isRequired
    };

    return (
        <ItemStyles>
            {props.item.image && <img src={props.item.image} alt={props.item.title} />}
            <Title>
                <Link href={{
                    pathname: '/item',
                    query: { id: props.item.id }
                }}>
                    <a>{props.item.title}</a>
                </Link>
            </Title>
            <PriceTag>{formatMoney(props.item.price)}</PriceTag>
            <p>{props.item.description}</p>
            <div className='buttonList'>
                <Link href={{
                    pathname: '/update',
                    query: { id: props.item.id }
                }}>
                    <a>Edit ✏️</a>
                </Link>
                <button>Add To Cart</button>
                <DeleteItem id={props.item.id}>{'Delete Item'}</DeleteItem>
            </div>
        </ItemStyles>
    )
    
}
export default Item;