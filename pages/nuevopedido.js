import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import PedidoContext from '../context/pedidos/PedidoContext';
import AlertError from '../components/ui/AlertError';
import AlertSuccess from '../components/ui/AlertSuccess';
import AsignarCliente from '../components/pedidos/AsignarCliente';
import AsignarProducto from '../components/pedidos/AsignarProducto';
import ResumenPedido from '../components/pedidos/ResumenPedido';
import TotalPedido from '../components/pedidos/TotalPedido';
import { gql, useMutation, useQuery } from '@apollo/client';

const NEW_ORDER = gql`
    mutation nuevoPedido($input: PedidoInput) {
        nuevoPedido(input: $input) {
            id
        }
    }
`;

const GET_ORDERS_USER = gql`
  query obtenerPedidosVendedor{
    obtenerPedidosVendedor {
      id
      pedido{
        id
        cantidad
        nombre
        precio
      }
      cliente {
        id
        nombre
        apellido
        empresa
        email
        telefono
      }
      vendedor
      total
      estado
    }
  }
`;

const GET_CLIENTS_USER = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
      id
      nombre
      apellido
      empresa
      telefono
      email
    }
  }
`;

const NuevoPedido = () => {

    const router = useRouter();

    const { data, loading, client } = useQuery(GET_CLIENTS_USER);
    if (loading) return "Cargando..";

    if (!data.obtenerClientesVendedor) {
        client.clearStore();
        router.push('/login');
        return "Loading..";
    }


    const [errormessage, setErrorMessage] = useState(null);
    const [successmessage, setSuccessMessage] = useState(null);

    const pedidoContext = useContext(PedidoContext);
    const { cliente, productos, total } = pedidoContext;



    const [nuevoPedido] = useMutation(NEW_ORDER, {
        update(cache, { data: { nuevoPedido } }) {
            const { obtenerPedidosVendedor } = cache.readQuery({ query: GET_ORDERS_USER });
            cache.writeQuery({
                query: GET_ORDERS_USER,
                data: {
                    obtenerPedidosVendedor: [...obtenerPedidosVendedor, nuevoPedido]
                }
            })
        }
    });

    const validarPedido = () => {
        return !productos.every(producto => producto.cantidad > 0) || total === 0 || cliente.length === 0 ? "opacity-50 cursor-not-allowed focus:outline-none" : '';
    }

    const crearNuevoPedido = async () => {
        const { id } = cliente;
        const pedido = productos.map(({ existencia, creado, __typename, ...producto }) => producto);
        try {
            await nuevoPedido({
                variables: {
                    input: {
                        cliente: id,
                        total: total,
                        pedido
                    }
                }
            });
            setSuccessMessage('Pedido creado exitosamente');
            setTimeout(() => {
                setSuccessMessage(null);
                router.push('/pedidos');
            }, 2000);
        } catch (error) {
            setErrorMessage(error.message);
            setTimeout(() => {
                setErrorMessage(null);
            }, 2000);
        }
    }

    const showErrorMessage = () => {
        return (
            <AlertError
                message={errormessage}
            />
        )
    }

    const showSuccessMessage = () => {
        return (
            <AlertSuccess
                message={successmessage}
            />
        )
    }

    return (
        <Layout>
            <div className="flex justify-start">
                {errormessage && showErrorMessage()}
                {successmessage && showSuccessMessage()}
            </div>
            <div className="flex flex-col mt-5 py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8 items-start justify-center">
                <AsignarCliente />
                <AsignarProducto />
                <ResumenPedido />
                <TotalPedido />
                <div className="w-full flex justify-center lg:justify-start">
                    <button
                        className={`bg-blue-900 p-2 text-center text-white titulo__lista-sidebar mt-5 w-1/2 lg:w-1/5 rounded-lg hover:bg-gray-900 ${validarPedido()}`}
                        onClick={() => crearNuevoPedido()}
                    >Registrar pedido</button>
                </div>
            </div>
        </Layout>
    );
}

export default NuevoPedido;