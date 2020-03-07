import * as React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import ErrorMessage from './ErrorMessage';

const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title: String!
        $description: String!
        $price: Int!
        $image: String
        $largeImage: String
    ) {
        createItem(
            title: $title
            description: $description
            price: $price
            image: $image
            largeImage: $largeImage
        ) {
            id
        }
    }
`;

const CreateItem = () => {
    const [title, setTitle] = React.useState();
    const [description, setDescription] = React.useState();
    const [price, setPrice] = React.useState();
    const [image, setImage] = React.useState();
    const [largeImage, setLargeImage] = React.useState();

    const uploadFile = async (e) => {
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'sickfits'); // needed by Cloudinary

        const response = await fetch('https://api.cloudinary.com/v1_1/dlki0o7xf/image/upload', {
            method: 'POST',
            body: data
        });

        const file = await response.json();
        setImage(file.secure_url);
        setLargeImage(file.eager[0].secure_url);
    }
    
    return (
        <Mutation
            mutation={CREATE_ITEM_MUTATION}
            variables={{title, description, price, image, largeImage}}
        >
            {(createItem, { loading, error }) => ( 
                <Form onSubmit={async (e) => {
                    e.preventDefault();
                    const response = await createItem();
                    Router.push({
                        pathname: '/item',
                        query: { id: response.data.createItem.id }
                    })
                }}>
                    <ErrorMessage error={error} />
                    <fieldset disabled={loading} aria-busy={loading}>
                        <label htmlFor='file'>
                            Image
                            <input onChange={uploadFile} type='file' id='file' name='file' placeholder='Upload an image' required />
                            {
                                image && <img src={image} width='200' alt='upload preview' />
                            }
                        </label>
                        <label htmlFor='title'>
                            Title
                            <input value={title} onChange={(e) => setTitle(e.target.value)} type='text' id='title' name='title' placeholder='title' required />
                        </label>
                        <label htmlFor='price'>
                            Price
                            <input value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} type='text' inputMode='numeric' pattern='[0-9]*' id='price' name='price' placeholder='price' required />
                        </label>
                        <label htmlFor='description'>
                            Description
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} id='description' name='description' placeholder='description' />
                        </label>
                        <button type='submit'>Submit</button>
                    </fieldset>
                </Form>
            )}
        </Mutation>
    )
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };