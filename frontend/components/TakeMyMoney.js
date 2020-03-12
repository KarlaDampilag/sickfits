import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import Router from 'next/router'
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import caclTotalPrice from '../lib/calcTotalPrice';
import ErrorMessage from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';
import calcTotalPrice from '../lib/calcTotalPrice';

const totalItems = (cart) => {
    return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
}

const onToken = async (res, createOrder) => {
    // manually call the mutation once we have the stripe token
    const order = await createOrder({
        variables: {
            token: res.id
        }
    }).catch(error => alert(error.message));
    console.log(order);
}

const CREATE_ORDER_MUTATION = gql`
    mutation createOrder($token: String!) {
      createOrder(token: $token) {
          id
          charge
          total
          items {
              id
              title
          }
      }  
    }
`;

const TakeMyMoney = (props) => {
    return (
        <User>
            {({ data: { me } }) => (
                <Mutation mutation={CREATE_ORDER_MUTATION} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
                    {(createOrder) => (
                        <StripeCheckout
                            amount={calcTotalPrice(me.cart)}
                            name='Sick Fits'
                            description={`Order of ${totalItems(me.cart)} items`}
                            stripeKey='pk_test_rD3hRm3MuPMEg4h6f9SNHcb100wU0a8OaK'
                            currency='USD'
                            email={me.email}
                            token={res => onToken(res, createOrder)}
                        >
                            {props.children}
                        </StripeCheckout>

                    )}
                </Mutation>
            )}
        </User>
    )
}
export default TakeMyMoney;