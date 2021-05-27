import '../styles/globals.css';
import '../styles/all.min.css';
import { ApolloProvider } from '@apollo/client';
import client from '../config/Apollo';
import PedidoState from '../context/pedidos/PedidoState';

function MyApp({ Component, pageProps }) {

  return (
    <ApolloProvider client={client}>
      <PedidoState>
        <Component {...pageProps} />
      </PedidoState>
    </ApolloProvider>
  )
}

export default MyApp;
