import * as React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { ALL_ITEMS_QUERY } from './Items';

const DELETE_ITEM_MUTATION = gql`
    mutation DELETE_ITEM_MUTATION($id: ID!) {
        deleteItem(id: $id) {
            id
        }
    }
`;

const DeleteItem = (props) => {
    const update = (cache, payload) => {
        // manually update cache on client so it matches the server

        // Read cache for the items
        const data = cache.readQuery({ query: ALL_ITEMS_QUERY });

        // Filter out the deleted item out of the page
        data.items = data.items.filter(item => item.id != payload.data.deleteItem.id);

        // Put the items back in the cache
        cache.writeQuery({ query: ALL_ITEMS_QUERY, data})
    }

    return (
        <Mutation
            mutation={DELETE_ITEM_MUTATION}
            variables={{ id: props.id}}
            update={update}
        >
            {(deleteItem, { error }) => (
                <button
                    onClick={() => {
                        if (confirm('Are you sure you want to delete?')) {
                            deleteItem();
                        }
                    }}
                >
                    {props.children}
                </button>
            )}
        </Mutation>
        
    )
}

export default DeleteItem;