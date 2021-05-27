import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import fetch from 'node-fetch';
import { setContext } from 'apollo-link-context';

const httpLink = createHttpLink({
    uri: 'https://mysterious-retreat-90653.herokuapp.com/',
    fetch
});

const authLink = setContext((root, { headers }) => {
    //view local storage
    const token = localStorage.getItem('token');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
            mipropioheader: 'caca'
        }

    }
});

const client = new ApolloClient({
    connectToDevTools: true,
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
});

export default client;