import React, { useState } from 'react';
import ModalDelete from './ui/ModalDelete';
import Router from 'next/router';

import { gql, useMutation } from '@apollo/client';

const DELETE_CLIENT = gql`
    mutation eliminarCliente($id: ID!){
        eliminarCliente(id: $id)
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

const Cliente = ({ cliente, setErrorMessage, setSuccessMessage }) => {

    const [showModalDelete, setShowModalDelete] = useState(false);
    const [selectid, setSelectId] = useState('');
    const [useremail, setUserEmail] = useState('');


    const { nombre, apellido, empresa, email, id, telefono } = cliente;

    const [eliminarCliente] = useMutation(DELETE_CLIENT, {
        update(cache) {
            //obtener copia
            const { obtenerClientesVendedor } = cache.readQuery({ query: GET_CLIENTS_USER });
            //reescribir
            cache.writeQuery({
                query: GET_CLIENTS_USER,
                data: {
                    obtenerClientesVendedor: obtenerClientesVendedor.filter(cliente => cliente.id !== id)
                }
            });
        }
    });


    const abrirCerrarModal = (id, email) => {
        setShowModalDelete(!showModalDelete);
        setSelectId(id);
        setUserEmail(email);
    }

    const deleteClient = async (id) => {
        setShowModalDelete(false);
        try {
            const { data } = await eliminarCliente({
                variables: {
                    id
                }
            });
            setSuccessMessage(data.eliminarCliente);
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
        } catch (error) {
            setErrorMessage(error.message);
            setTimeout(() => {
                setErrorMessage(null);
            }, 3000);
        }
    }

    const editCliente = () => {
        Router.push({
            pathname: "/editarcliente/[id]",
            query: { id }
        });
    }

    const modal = (
        <td>
            <ModalDelete
                showModalDelete={showModalDelete}
                abrirCerrarModal={abrirCerrarModal}
                id={selectid}
                eliminarCliente={deleteClient}
                useremail={useremail}
                text="¿Estás seguro que deseas eliminar este cliente?"
            />
        </td>
    )


    return (
        <tr className="hover:bg-gray-200 overflow-y-scroll" key={id} >
            {showModalDelete && modal}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="text-lg font-medium text-gray-900">
                        {nombre} {apellido}
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap w-1/5">
                <div className="text-lg text-gray-700">
                    {email}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-lg text-gray-700">{empresa}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center">
                {telefono ? (
                    <span className="px-2 inline-flex text-lg leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {telefono}
                    </span>
                ) : (
                    <span className="px-2 inline-flex text-lg leading-5 font-semibold rounded-full bg-yellow-300 text-black">
                        No existe
                    </span>
                )}

            </td>
            <td className="py-4 whitespace-nowrap text-lg font-medium flex justify-around">
                <button
                    type="button"
                    className="text-indigo-600 bg-indigo-100 p-1 px-3 rounded-lg hover:bg-indigo-200 hover:text-indigo-900 focus:outline-none"
                    value="Editar"
                    onClick={() => editCliente()}
                >
                    Editar
                </button>
                <button
                    type="button"
                    className="text-red-500 hover:text-red-700 text-md hover:bg-red-200 rounded-lg p-1 px-1 focus:outline-none"
                    value="Eliminar"
                    onClick={() => abrirCerrarModal(id, email)}
                >
                    Eliminar
                </button>
            </td>
        </tr >

    );
}

export default Cliente;