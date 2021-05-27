import React, { useContext } from 'react';
import PedidoContext from '../../context/pedidos/PedidoContext';
import ResumenProducto from './ResumenProducto';

const ResumenPedido = () => {

    const pedidoContext = useContext(PedidoContext);
    const { productos } = pedidoContext;

    return (
        <>
            {productos.length > 0 ? (
                <>
                    <h1 className="titulo text-gray-600 mt-5">Asignar cantidad al producto</h1>
                    <div className="shadow-xl overflow-scroll border-b border-gray-200 sm:rounded-lg container-table bg-gray-50 mt-5">
                        <table className="min-w-full divide-y divide-gray-200 titulo__lista-sidebar">
                            <thead className="bg-gray-200 border-t-2 border-gray-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-md font-medium text-gray-600 uppercase tracking-wider">Producto</th>
                                    <th scope="col" className="px-6 py-3 text-left text-md font-medium text-gray-600 uppercase tracking-wider">Precio unitario</th>
                                    <th scope="col" className="px-6 py-3 text-center text-md font-medium text-gray-600 uppercase tracking-wider">Cantidad</th>
                                    <th scope="col" className="px-6 py-3 text-center text-md font-medium text-gray-600 uppercase tracking-wider">Precio total</th>
                                </tr>
                            </thead>
                            {productos.map(producto => (
                                <ResumenProducto
                                    key={producto.id}
                                    producto={producto}
                                />
                            ))}
                        </table>
                    </div>
                </>
            ) : (
                <p className="mt-5 text-red-500 titulo">No existen productos</p>
            )}
        </>
    );
}

export default ResumenPedido;