import React from 'react';
import { FormatAmounts } from '../../libs/formatAmounts';
import { Modal } from '@material-ui/core';

const ModalDelete = (props) => {
    const body = (
        <div className="modal-dialog titulo">
            <div className="modal-content">
                <div className="modal-header">
                    <button className="close focus:outline-none" type="button" onClick={props.abrirCerrarModal}>
                        <img src="cerrar-modal.svg" alt="cerrar-modal" />
                    </button>
                </div>
                <div className="modal-body text-center mt-8">
                    <i className="fas fa-exclamation-circle"></i>
                    <h1 className="mt-10 text-xl md:text-2xl flex-col">{props.text}<span className="text-red-500 mt-2 text-lg md:text-2xl font-bold">{props.useremail || props.nombre ? props.useremail || props.nombre : (
                        props.pedido.map(articulo => (
                            <div
                                key={articulo.id}
                                className="w-full flex-col mt-5 mb-5"
                            >
                                <span className="text-blue-900">Producto: {articulo.nombre}</span>
                                {articulo.cantidad === 1 ? (
                                    <p className="text-blue-900">Cantidad: {articulo.cantidad}</p>
                                ) : (
                                    <p className="text-blue-900">Cantidades: {articulo.cantidad}</p>
                                )}
                                <p className="text-red-800">Total a pagar: <span className="text-red-600">$ {FormatAmounts.formatAmountToMoney(props.total)}</span></p>
                            </div>
                        ))
                    )}</span></h1>
                </div>
                <div className="modal-footer items-center">
                    <button
                        className="modal-cancelar text-white bg-gray-900 border-2 border-black hover:bg-white hover:text-black transition duration-500 ease-in-out focus:outline-none"
                        onClick={props.abrirCerrarModal}
                    >Cancelar</button>
                    {props.eliminarCliente ? (
                        <button
                            onClick={() => props.eliminarCliente(props.id)}
                            className="btn-primario bg-blue-900 text-white hover:bg-white hover:text-black border-2 border-black transition duration-500 ease-in-out focus:outline-none"
                        >Eliminar</button>
                    ) : props.eliminarProducto ? (
                        <button
                            onClick={() => props.eliminarProducto(props.id)}
                            className="btn-primario bg-blue-900 text-white hover:bg-white hover:text-black border-2 border-black transition duration-500 ease-in-out focus:outline-none"
                        >Eliminar</button>
                    ) : props.eliminarPedido ? (
                        <button
                            key={props.pedido.id}
                            onClick={() => props.eliminarPedido(props.idpedido)}
                            className="btn-primario bg-blue-900 text-white hover:bg-white hover:text-black border-2 border-black transition duration-500 ease-in-out focus:outline-none"
                        >Eliminar</button>
                    ) : null}
                </div>
            </div>
        </div>
    )
    return (
        <div className="Modal">
            <Modal open={props.showModalDelete} onClose={props.abrirCerrarModal}>
                {body}
            </Modal>
        </div>
    );
}

export default ModalDelete;