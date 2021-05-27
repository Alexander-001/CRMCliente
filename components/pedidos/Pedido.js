import React, { useState, useEffect } from 'react';
import { FormatAmounts } from '../../libs/formatAmounts';
import ModalDelete from '../ui/ModalDelete';
import AlertError from '../ui/AlertError';
import AlertSuccess from '../ui/AlertSuccess';
import { gql, useMutation } from '@apollo/client';

const UPDATE_ORDER = gql`
    mutation actualizarPedido($id: ID!, $input: PedidoInput) {
        actualizarPedido(id: $id, input: $input){
            id
            estado
        }
    }
`;

const DELETE_ORDER = gql`
    mutation eliminarPedido($id: ID!){
        eliminarPedido(id: $id)
    }
`;

const GET_ORDERS_USER = gql`
  query obtenerPedidosVendedor{
    obtenerPedidosVendedor {
      id
    }
  }
`;

const Pedido = ({ pedido }) => {
    const { id, total, estado, cliente: { nombre, apellido, empresa, telefono, email }, cliente } = pedido;

    const [actualizarPedido] = useMutation(UPDATE_ORDER);
    const [eliminarPedido] = useMutation(DELETE_ORDER, {
        update(cache) {
            const { obtenerPedidosVendedor } = cache.readQuery({ query: GET_ORDERS_USER });
            cache.writeQuery({
                query: GET_ORDERS_USER,
                data: {
                    obtenerPedidosVendedor: obtenerPedidosVendedor.filter(pedido => pedido.id !== id)
                }
            });
        }
    });

    const [estadopedido, setEstadoPedido] = useState(estado);
    const [clasepedido, setClasePedido] = useState(estado);
    const [clasecardpedido, setClaseCardPedido] = useState(estado);


    const [showModalDelete, setShowModalDelete] = useState(false);
    const [errormessage, setErrorMessage] = useState(null);
    const [successmessage, setSuccessMessage] = useState(null);

    const abrirCerrarModal = () => {
        setShowModalDelete(!showModalDelete);
    }


    const descargarBoleta = () => {
        console.log('descargando...')
    }

    const deleteOrder = async (id) => {
        setShowModalDelete(!showModalDelete);
        try {
            await eliminarPedido({
                variables: {
                    id
                }
            });
            setSuccessMessage('Pedido eliminado corretamente.')
            setTimeout(() => {
                setSuccessMessage(null);
            }, 2000);
        } catch (error) {
            setErrorMessage(error.message);
            setTimeout(() => {
                setErrorMessage(null);
            }, 2000);
        }
    }

    useEffect(() => {
        if (estadopedido) {
            setEstadoPedido(estadopedido);
        }
        clasePedido();
    }, [estadopedido]);

    const clasePedido = () => {
        if (estadopedido === 'Pendiente') {
            setClasePedido('pl-5 text-sm lg:text-md appearance-none bg-yellow-300 border cursor-pointer border-yellow-400 text-black p-1 font-bold h-10 text-center rounded-lg leading-tight focus:outline-none hover:bg-yellow-200 focus:bg-yellow-200 focus:border-yellow-400 transition duration-500 ease-in-out');
            setClaseCardPedido('border-yellow-200 shadow-lg');
        } else if (estadopedido === 'Completado') {
            setClasePedido('appearance-none text-sm lg:text-md bg-green-700 border border-green-800 focus:border-green-900 cursor-pointer text-white p-2 h-10 font-bold text-center rounded-lg leading-tight focus:outline-none hover:bg-green-900 focus:bg-green-700 transition duration-500 ease-in-out');
            setClaseCardPedido('border-green-400 shadow-lg');
        } else {
            setClasePedido('pl-5 appearance-none text-sm lg:text-md bg-red-600 border border-red-400 text-white p-2 font-bold text-center rounded-lg h-10 leading-tight focus:outline-none hover:bg-red-800 cursor-pointer focus:bg-red-700 focus:border-red-900 transition duration-500 ease-in-out');
            setClaseCardPedido('border-red-400 shadow-lg');
        }
    }

    const cambiarEstado = async (estado) => {
        try {
            const { data } = await actualizarPedido({
                variables: {
                    id,
                    input: {
                        estado: estado,
                        cliente: cliente.id
                    }
                }
            });
            setEstadoPedido(data.actualizarPedido.estado);
        } catch (error) {
            console.log(error)
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
        <>
            <ModalDelete
                showModalDelete={showModalDelete}
                abrirCerrarModal={abrirCerrarModal}
                eliminarPedido={deleteOrder}
                text="¿Estás seguro que deseas eliminar este pedido?"
                pedido={pedido.pedido}
                idpedido={id}
                total={total}
            />
            {errormessage && showErrorMessage()}
            {successmessage && showSuccessMessage()}
            <div className={`${clasecardpedido} border-t-4 mt-4 bg-white rounded-lg p-6 md:grid md:grid-cols-2 md:gap-2 shadow-lg flex flex-col flex-col-reverse`}>
                <div className="titulo__lista-sidebar flex flex-col">
                    <h2 className="text-gray-800 mt-2 font-bold text-2xl mb-1">Resumen del pedido:</h2>
                    {pedido.pedido.map(articulo => (
                        <div
                            key={articulo.id}
                            className="'mt-4"
                        >
                            <p className="text-xl text-gray-500 font-semibold">Producto: {articulo.nombre}</p>
                            <p className="text-xl text-gray-500 font-semibold">Cantidad: {articulo.cantidad}</p>
                            <p className="text-xl text-gray-500 font-semibold">Precio: {FormatAmounts.formatAmountToMoney(articulo.precio)}</p>
                        </div>
                    ))}
                    <p className="text-red-700 font-semibold mt-12 text-2xl">Totál a pagar: <span className="font-bold text-2xl text-blue-900">$ {FormatAmounts.formatAmountToMoney(total)}</span></p>
                    <hr className="mt-2 mr-8 w-full md:w-5/6 shadow mb-10 lg:mb-0" />
                </div>
                <div className="titulo__lista-sidebar">
                    <div className="flex justify-between">
                        <p className="font-bold text-gray-900 text-xl md:text-2xl">Cliente: <span className="text-gray-800">{nombre} {apellido}</span></p>
                        <i
                            className="fas fa-download h-8 px-3 pt-1 bg-gray-100 rounded-lg cursor-pointer text-blue-900 transition duration-500 ease-in-out"
                            onClick={() => descargarBoleta()}
                        ></i>
                    </div>
                    <div className="flex flex-col mt-5 lg:mt-0">
                        <h1 className="text-md md:text-xl font-semibold text-blue-900"><i className="company fas fa-users text-black mr-2 p-1"></i>{empresa}</h1>
                        <p className="text-md md:text-xl font-semibold text-blue-900"><i className="fas fa-envelope text-black mr-2 p-2"></i>{email}</p>
                        <p className="text-md md:text-xl font-semibold text-blue-900"><i className="fas fa-phone-square-alt text-black mr-2 p-2"></i>{telefono ? telefono : 'No existe'}</p>
                    </div>
                    <div className="flex flex-col mt-2 mb-5 lg:mb-0">
                        <h2 className="text-gray-500 font-bold text-lg md:text-xl mb-2">Estado del pedido:</h2>
                        <div className="flex justify-start">
                            <select
                                className={clasepedido}
                                value={estadopedido}
                                onChange={e => cambiarEstado(e.target.value)}
                            >
                                <option value="Completado">Completado</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="Cancelado">Cancelado</option>
                            </select>
                            <button
                                className="w-2/4 lg:w-1/5 text-sm lg:text-md h-10 text-center bg-pink-100 hover:bg-red-200 focus:outline-none p-2 rounded-lg text-black border-2 border-red-300 font-semibold ml-5 transition duration-500 ease-in-out"
                                onClick={() => abrirCerrarModal()}
                            >Eliminar pedido</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Pedido;