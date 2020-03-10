import React from 'react';
import Downshift, { resetIdCounter } from 'downshift';
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

    const routeToItem = (item) => {
        Router.push({
            pathname: '/item',
            query: {
                id: item.id
            }
        });
    }

    resetIdCounter();

    return (
        <SearchStyles>
            <Downshift itemToString={item => (item && item.title)} onChange={routeToItem}>
                {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => (
                    <div>
                        <ApolloConsumer>
                            {(client) => (
                                <input
                                    {...getInputProps({
                                        type: 'search',
                                        placeholder: 'Search for an item',
                                        id: 'search',
                                        className: loading ? 'loading' : '',
                                        onChange: e => {
                                            e.persist();
                                            onChange(e, client);
                                        }
                                    })}

                                />
                            )}
                        </ApolloConsumer>
                        {isOpen && (
                            <DropDown>
                                {items && items.map((item, index) => (
                                    <DropDownItem
                                        key={item.id}
                                        highlighted={index == highlightedIndex}
                                        {...getItemProps({ item })}
                                    >
                                        <img src={item.image} alt={item.title} width='50' />
                                        {item.title}
                                    </DropDownItem>
                                ))}
                                {items && items.length == 0 && !loading && 
                                    <DropDownItem>Nothing found for '{inputValue}'</DropDownItem>
                                }
                            </DropDown>
                        )}
                    </div>
                )}
            </Downshift>
        </SearchStyles>
    )
}
export default AutoComplete;