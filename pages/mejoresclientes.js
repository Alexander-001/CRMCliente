import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BEST_BUYERS = gql`
    query mejoresClientes {
        mejoresClientes {
            cliente {
                nombre
                empresa
            }
            total
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

const MejoresClientes = () => {

    const router = useRouter();

    const getClientsUser = useQuery(GET_CLIENTS_USER);

    if (getClientsUser.loading) return "Cargando..";

    if (!getClientsUser.data.obtenerClientesVendedor) {
        getClientsUser.client.clearStore();
        router.push('/login');
        return "Loading..";
    }

    const { data, loading, error, startPolling, stopPolling } = useQuery(BEST_BUYERS);

    useEffect(() => {
        startPolling(1000);
        return () => {
            stopPolling();
        }
    }, [startPolling, stopPolling]);

    if (loading) return null;

    console.log(data)
    const { mejoresClientes } = data;

    const clientesGrafica = [];

    mejoresClientes.map((cliente, index) => {
        clientesGrafica[index] = {
            ...cliente.cliente[0],
            total: cliente.total
        }
    });


    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 ml-8 font-light titulo">Mejores clientes</h1>
            <ResponsiveContainer width="99%" height={550} className="font-bold titulo">
                <BarChart
                    className="mt-10"
                    width={1200}
                    height={300}
                    data={clientesGrafica}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nombre" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" className="uppercase" fill="#E30151" />
                </BarChart>
            </ResponsiveContainer>
        </Layout>
    );
}

export default MejoresClientes;