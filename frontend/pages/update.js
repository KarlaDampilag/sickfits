import React from 'react';
import UpdateItem from '../components/UpdateItem';

const Update = (props) => {
    return (
        <>
            <UpdateItem id={props.query.id} />
        </>
    )
}
export default Update;