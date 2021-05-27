import React from 'react';
import Layout from '../components/Layout';
import Pedido from '../components/pedidos/Pedido';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';

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


const Pedidos = () => {

  const router = useRouter();

  const getClientsUser = useQuery(GET_CLIENTS_USER);
  const { data, loading, error } = useQuery(GET_ORDERS_USER);

  if (getClientsUser.loading) return "Cargando..";

  if (!getClientsUser.data.obtenerClientesVendedor) {
    getClientsUser.client.clearStore();
    router.push('/login');
    return "Loading..";
  }

  if (loading) return "Cargando...";
  const { obtenerPedidosVendedor } = data;

  return (
    <div>
      <Layout>
        <div className="flex flex-col mt-5">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            {obtenerPedidosVendedor.length === 0 ? (
              <div className="shadow-xl overflow-scroll border-b border-gray-200 sm:rounded-lg container-table-no-info bg-gray-50">
                <div className="min-w-full divide-y divide-gray-200 titulo__lista-sidebar h-full flex flex-col justify-center items-center">
                  <img src="icon-vacio.svg" className="mt-5" alt="no-info" />
                  <h1 className="text-2xl mt-10 border-none">No existen pedidos disponibles.</h1>
                  <Link href="/nuevopedido">
                    <button className="text-white cursor-pointer hover:outline-none hover:border-green-900 bg-green-700 hover:bg-green-900 border-2 border-green-700 p-2 rounded-lg mt-8 mb-3 focus:outline-none">Agregar pedido</button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-center lg:justify-start">
                  <Link href="/nuevopedido">
                    <button className="lg:w-1/5 text-white cursor-pointer focus:outline-none bg-green-700 hover:bg-green-900 border-2 border-green-800 p-2 rounded-lg mt-8 mb-3 titulo shadow-xl transition duration-500 ease-in-out">Agregar pedido</button>
                  </Link>
                </div>
                {obtenerPedidosVendedor.map(pedido => (
                  <Pedido
                    key={pedido.id}
                    pedido={pedido}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default Pedidos;