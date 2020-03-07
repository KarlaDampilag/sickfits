import React from 'react';
import Reset from '../components/Reset';

const Sell = (props) => {
    return (
        <>
            <p>Reset your password:</p>
            <Reset resetToken={props.query.resetToken} />
        </>
    )
}
export default Sell;