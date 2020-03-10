import React from 'react';
import Downshift from 'downshift';
import Router from 'next/router';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';

import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_ITEMS_QUERY = gql`
    query SEARCH_ITEMS_QUERY($searchTerm: String!) {
        items(where: {
            OR: [
                { title_contains: $searchTerm },
                { description_contains: $searchTerm }
            ]
        }) {
            id
            title
            image
        }
    }
`;

const AutoComplete = () => {
    const [items, setItems] = React.useState();
    const [loading, setLoading] = React.useState(false);

    const onChange = debounce(async (event, client) => {
        setLoading(true);

        // manually query apollo client
        const response = await client.query({
            query: SEARCH_ITEMS_QUERY,
            variables: { searchTerm: event.target.value }
        });

        setItems(response.data.items);
        setLoading(false);
    }, 350);

    return (
        <SearchStyles>
            <div>
                <ApolloConsumer>
                    {(client) => (
                        <input type='search' onChange={async (e) => {
                            e.persist();
                            await onChange(e, client);
                        }} />
                    )}
                </ApolloConsumer>
                <DropDown>
                    {items && items.map(item => (
                        <DropDownItem key={item.id}>
                            <img src={item.image} alt={item.title} width='50' />
                            {item.title}
                        </DropDownItem>
                    ))}
                </DropDown>
            </div>
        </SearchStyles>
    )
}
export default AutoComplete;