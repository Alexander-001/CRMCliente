import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Producto from '../components/Producto';
import AlertError from '../components/ui/AlertError'
import AlertSuccess from '../components/ui/AlertSuccess';
import { gql, useQuery } from '@apollo/client';

const GET_PRODUCTS = gql`
  query obtenerProductos {
    obtenerProductos {
        id
        nombre
        existencia
        precio
        creado
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

const Productos = () => {

  const [errormessage, setErrorMessage] = useState(null);
  const [successmessage, setSuccessMessage] = useState(null);

  const router = useRouter();

  const getClientsUser = useQuery(GET_CLIENTS_USER);

  if (getClientsUser.loading) return "Cargando..";

  if (!getClientsUser.data.obtenerClientesVendedor) {
    getClientsUser.client.clearStore();
    router.push('/login');
    return "Loading..";
  }

  const { data, loading } = useQuery(GET_PRODUCTS);

  if (loading) return "Cargando...";

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
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light titulo">Productos</h1>
        <div className="flex flex-col mt-5">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            {errormessage && showErrorMessage()}
            {successmessage && showSuccessMessage()}
            {data.obtenerProductos.length === 0 ? (
              <div className="shadow-xl overflow-scroll border-b border-gray-200 sm:rounded-lg container-table-no-info bg-gray-50">
                <div className="min-w-full divide-y divide-gray-200 titulo__lista-sidebar h-full flex flex-col justify-center items-center">
                  <img src="icon-vacio.svg" className="mt-5" alt="no-info" />
                  <h1 className="text-2xl mt-10 border-none">No existen productos disponibles</h1>
                  <Link href="/nuevoproducto">
                    <button className="text-white cursor-pointer bg-green-700 hover:bg-green-900 border-2 border-green-700 p-2 rounded-lg mt-8 mb-3">Agregar producto</button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="shadow-xl overflow-scroll border-b border-gray-200 sm:rounded-lg container-table-products bg-gray-50">
                <table className="min-w-full divide-y divide-gray-200 titulo__lista-sidebar">
                  <thead className="bg-gray-50 border-t-2 border-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th scope="col" className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                      <th scope="col" className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                      <th scope="col" className="px-6 py-3 text-center text-lg font-medium text-gray-500 uppercase tracking-wider flex justify-around items-center">Acciones
                        <Link href="/nuevoproducto">
                          <i className="fas fa-cart-plus text-green-600 cursor-pointer hover:text-green-900 bg-gray-50 hover:bg-gray-100 p-2 rounded-lg"></i>
                        </Link>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      data.obtenerProductos.map(producto => (
                        <Producto
                          key={producto.id}
                          producto={producto}
                          setErrorMessage={setErrorMessage}
                          setSuccessMessage={setSuccessMessage}
                        />
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default Productos;