import React, { useState } from 'react';
import ModalDelete from '../components/ui/ModalDelete';
import { FormatAmounts } from '../libs/formatAmounts';
import { gql, useMutation } from '@apollo/client';
import Router from 'next/router';

const DELETE_CLIENT = gql`
    mutation eliminarProducto($id: ID!) {
        eliminarProducto(id: $id)
    }
`;

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

const Producto = ({ producto, setErrorMessage, setSuccessMessage }) => {

    const [showModalDelete, setShowModalDelete] = useState(false);
    const [selectid, setSelectId] = useState('');
    const [productname, setProductName] = useState('');

    const { id, nombre, existencia, precio } = producto;

    const [eliminarProducto] = useMutation(DELETE_CLIENT, {
        update(cache) {
            const { obtenerProductos } = cache.readQuery({ query: GET_PRODUCTS });

            cache.writeQuery({
                query: GET_PRODUCTS,
                data: {
                    obtenerProductos: obtenerProductos.filter(productoActual => productoActual.id !== id)
                }
            });
        }
    });

    const abrirCerrarModal = (id, nombre) => {
        setShowModalDelete(!showModalDelete);
        setSelectId(id);
        setProductName(nombre);
    }

    const deleteProduct = async (idproduct) => {
        setShowModalDelete(false);
        try {
            const { data } = await eliminarProducto({
                variables: {
                    id: idproduct
                }
            });

            setSuccessMessage(data.eliminarProducto);
            setTimeout(() => {
                setSuccessMessage(null);
            }, 2000);
        } catch (error) {
            setErrorMessage(error.message);
            setTimeout(() => {
                setErrorMessage(null);
            }, 2000)
        }
    }

    const modal = (
        <td>
            <ModalDelete
                showModalDelete={showModalDelete}
                abrirCerrarModal={abrirCerrarModal}
                id={selectid}
                eliminarProducto={deleteProduct}
                nombre={productname}
                text="¿Estás seguro que deseas eliminar este producto?"
            />
        </td>
    )

    return (
        <tr className="hover:bg-gray-200 overflow-y-scroll" key={id} >
            {showModalDelete && modal}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="text-lg font-medium text-gray-900">
                        {nombre}
                    </div>
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-lg text-gray-700">$ {FormatAmounts.formatAmountToMoney(precio)}</div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap w-1/5">
                {existencia <= 5 ? (
                    <div className="px-2 inline-flex text-lg leading-5 font-semibold rounded-full bg-red-100 text-red-800 w-20 justify-center">{existencia}</div>
                ) : existencia <= 10 ? (
                    <div className="px-2 inline-flex text-lg leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 w-20 justify-center">{existencia}</div>
                ) : (
                    <div className="px-2 inline-flex text-lg leading-5 font-semibold rounded-full bg-green-100 text-green-800 w-20 justify-center">{existencia}</div>
                )}

            </td>

            <td className="py-4 whitespace-nowrap text-lg font-medium flex justify-around">
                <button
                    type="button"
                    className="text-indigo-600 focus:outline-none bg-indigo-100 p-1 px-3 rounded-lg hover:bg-indigo-200 hover:text-indigo-900 outline-none"
                    value="Editar"
                    onClick={() => Router.push({
                        pathname: '/editarproducto/[id]',
                        query: { id }
                    })}
                >
                    Editar
                </button>
                <button
                    type="button"
                    className="text-red-500 focus:outline-none hover:text-red-700 text-md hover:bg-red-200 rounded-lg p-1 px-1 outline-none"
                    value="Eliminar"
                    onClick={() => abrirCerrarModal(id, nombre)}
                >
                    Eliminar
                </button>
            </td>
        </tr >
    );
}

export default Producto;