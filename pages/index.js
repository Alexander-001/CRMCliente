import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import Cliente from '../components/Cliente';
import AlertError from '../components/ui/AlertError'
import AlertSuccess from '../components/ui/AlertSuccess';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';

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

const Index = () => {

  const [errormessage, setErrorMessage] = useState(null);
  const [successmessage, setSuccessMessage] = useState(null);

  //query in apollo
  const { data, loading, client } = useQuery(GET_CLIENTS_USER);

  const router = useRouter();

  if (loading) return "Cargando..";

  if (!data.obtenerClientesVendedor) {
    client.clearStore();
    router.push('/login');
    return "Loading..";
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
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 ml-8 font-light titulo">Clientes</h1>
        <div className="flex flex-col mt-5">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            {errormessage && showErrorMessage()}
            {successmessage && showSuccessMessage()}
            {data.obtenerClientesVendedor.length === 0 ? (
              <div className="shadow-xl overflow-scroll border-b border-gray-200 sm:rounded-lg container-table-no-info bg-gray-50">
                <div className="min-w-full divide-y divide-gray-200 titulo__lista-sidebar h-full flex flex-col justify-center items-center">
                  <img src="icon-vacio.svg" className="mt-5" alt="no-info" />
                  <h1 className="text-2xl mt-10 border-none">No existen clientes disponibles</h1>
                  <Link href="/nuevocliente">
                    <button className="text-white cursor-pointer bg-green-700 hover:bg-green-900 border-2 border-green-700 p-2 rounded-lg mt-8 mb-3">Agregar cliente</button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="shadow-xl overflow-scroll border-b border-gray-200 sm:rounded-lg container-table bg-gray-50">
                <table className="min-w-full divide-y divide-gray-200 titulo__lista-sidebar">
                  <thead className="bg-gray-50 border-t-2 border-gray-100 text-lg">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                      <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                      <th scope="col" className="px-6 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">Telefono</th>
                      <th scope="col" className="px-6 py-3 text-center font-medium text-gray-500 uppercase tracking-wider flex justify-around items-center">Acciones
                        <Link href="/nuevocliente">
                          <i className="fas fa-user-plus text-green-600 cursor-pointer hover:text-green-900 bg-gray-50 hover:bg-gray-100 p-2 rounded-lg"></i>
                        </Link>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      data.obtenerClientesVendedor.map(cliente => (
                        <Cliente
                          key={cliente.id}
                          cliente={cliente}
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

export default Index;