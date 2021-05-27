import React, { useState, useEffect, useContext } from 'react';
import PedidoContext from '../../context/pedidos/PedidoContext';
import Select from 'react-select';
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

const AsignarProducto = () => {

    const pedidoContext = useContext(PedidoContext);
    const { agregarProducto, actualizarTotal } = pedidoContext;

    const [productos, setProductos] = useState([]);

    const { data, loading, error } = useQuery(GET_PRODUCTS);

    const seleccionarProducto = (producto) => {
        setProductos(producto)
    }

    useEffect(() => {
        if (productos == null) {
            setProductos([]);
            actualizarTotal();
        } else {
            agregarProducto(productos);
            actualizarTotal();
        }
    }, [productos]);


    if (loading) return null;
    const { obtenerProductos } = data;

    return (
        <>
            <h1 className="titulo text-gray-600 mt-5">Asignar producto al pedido</h1>
            <Select
                className="mt-3 w-full lg:w-2/3 focus:outline-none focus:ring focus:border-blue-300 titulo__lista-sidebar text-indigo-900 font-bold text-md lg:text-lg cursor-pointer"
                options={obtenerProductos}
                isMulti={true}
                onChange={(option) => seleccionarProducto(option)}
                getOptionValue={opciones => opciones.id}
                getOptionLabel={opciones => `${opciones.nombre} (${opciones.existencia} disponibles)`}
                placeholder="Seleccione el producto"
                noOptionsMessage={() => "No hay resultados"}
            />
        </>
    );
}

export default AsignarProducto;