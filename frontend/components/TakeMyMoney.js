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
    return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0 );
}

const onToken = (res) => {
    console.log(res.id)
}

const TakeMyMoney = (props) => {
    return (
        <User>
            {({ data: { me } }) => (
                <StripeCheckout
                    amount={calcTotalPrice(me.cart)}
                    name='Sick Fits'
                    description={`Order of ${totalItems(me.cart)} items`}
                    stripeKey='pk_test_rD3hRm3MuPMEg4h6f9SNHcb100wU0a8OaK'
                    currency='USD'
                    email={me.email}
                    token={res => onToken(res)}
                >
                    {props.children}
                </StripeCheckout>
            )}
        </User>
    )
}
export default TakeMyMoney;