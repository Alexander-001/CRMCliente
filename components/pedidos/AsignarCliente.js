import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import PedidoContext from '../../context/pedidos/PedidoContext';
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

const AsignarCliente = () => {

  const [cliente, setCliente] = useState([]);

  const pedidoContext = useContext(PedidoContext);
  const { agregarCliente } = pedidoContext;

  const { data, loading, error } = useQuery(GET_CLIENTS_USER);

  useEffect(() => {
    agregarCliente(cliente);
  }, [cliente]);

  const seleccionarCliente = cliente => {
    setCliente(cliente);
  }

  if (loading) return null;
  const { obtenerClientesVendedor } = data;

  return (

    <>
      <h1 className="titulo text-gray-600">Asignar cliente al pedido</h1>
      <Select
        className="mt-3 w-full lg:w-2/3 focus:outline-none focus:ring focus:border-blue-300 titulo__lista-sidebar text-indigo-900 font-bold text-md lg:text-lg cursor-pointer"
        options={obtenerClientesVendedor}
        onChange={(option) => seleccionarCliente(option)}
        getOptionValue={opciones => opciones.id}
        getOptionLabel={opciones => opciones.nombre}
        placeholder="Seleccione el cliente"
        noOptionsMessage={() => "No hay resultados"}
      />
    </>
  );
}

export default AsignarCliente;