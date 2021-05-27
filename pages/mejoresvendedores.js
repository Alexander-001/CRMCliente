import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BEST_SELLERS = gql`
    query mejoresVendedores{
        mejoresVendedores {
            vendedor {
                nombre
                email
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


const MejoresVendedores = () => {

    const router = useRouter();

    const getClientsUser = useQuery(GET_CLIENTS_USER);

    if (getClientsUser.loading) return "Cargando..";

    if (!getClientsUser.data.obtenerClientesVendedor) {
        getClientsUser.client.clearStore();
        router.push('/login');
        return "Loading..";
    }

    const { data, loading, error, startPolling, stopPolling } = useQuery(BEST_SELLERS);

    useEffect(() => {
        startPolling(1000);
        return () => {
            stopPolling();
        }
    }, [startPolling, stopPolling]);

    if (loading) return null;

    console.log(data)
    const { mejoresVendedores } = data;

    const vendedorGrafica = [];

    mejoresVendedores.map((vendedor, index) => {
        vendedorGrafica[index] = {
            ...vendedor.vendedor[0],
            total: vendedor.total
        }
    });


    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 ml-8 font-light titulo">Mejores vendedores</h1>
            <ResponsiveContainer width="99%" height={550} className="font-bold titulo">
                <BarChart
                    className="mt-10"
                    width={1200}
                    height={300}
                    data={vendedorGrafica}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nombre" />
                    <YAxis dataKey="total" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" className="uppercase" fill="#E30151" />
                </BarChart>
            </ResponsiveContainer>
        </Layout>
    );
}

export default MejoresVendedores;