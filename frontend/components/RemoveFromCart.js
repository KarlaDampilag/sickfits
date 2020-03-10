import React from 'react';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const REMOVE_FROM_CART_MUTATION = gql`
    mutation removeFromCart($id: ID!) {
        removeFromCart(id: $id) {
            id
        }
    }
`;

const BigButton = styled.button`
    font-size: 3rem;
    background: none;
    border: none;
    &:hover {
        color: ${props => props.theme.red};
        cursor: pointer;
    }
`;

// this gets called as soon as we get a response back from server, after a mutation is performed
const update = (cache, payload) => {
    // read the cache first
    const data = cache.readQuery({ query: CURRENT_USER_QUERY });

    // remove that item from the cache cart
    const cartItemId = payload.data.removeFromCart.id;
    data.me.cart = data.me.cart.filter(cartItem => cartItem.id != cartItemId);

    // write it back to the cache
    cache.writeQuery({ query: CURRENT_USER_QUERY, data: data });
}

const RemoveFromCart = (props) => {
    return (
        <Mutation
            mutation={REMOVE_FROM_CART_MUTATION}
            variables={{id: props.id}}
            update={update}
            optimisticResponse={{
                __typename: 'Mutation',
                removeFromCart: {
                    __typename: 'CartItem',
                    id: props.id
                }
            }}
        >
            {(removeFromCart, { loading, error }) => (
                <BigButton
                    title='Delete Item'
                    disabled={loading}
                    onClick={() => {
                        removeFromCart().catch(error => alert(error.message));
                    }}
                >&times;</BigButton>
            )}
        </Mutation>
    )
}

RemoveFromCart.propTypes = {
    id: PropTypes.string.isRequired
}

export default RemoveFromCart;