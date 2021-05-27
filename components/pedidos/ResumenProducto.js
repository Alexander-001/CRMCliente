import React, { useContext, useState, useEffect } from 'react';
import { FormatAmounts } from '../../libs/formatAmounts';
import PedidoContext from '../../context/pedidos/PedidoContext';

const ResumenProducto = ({ producto }) => {

    const pedidoContext = useContext(PedidoContext);
    const { cantidadProductos, actualizarTotal } = pedidoContext;

    const [cantidad, setCantidad] = useState(0);

    useEffect(() => {
        actualizarCantidad();
        actualizarTotal();
    }, [cantidad]);

    const actualizarCantidad = () => {
        const nuevoProducto = { ...producto, cantidad: Number(cantidad) };
        cantidadProductos(nuevoProducto);
    }

    const totalProducto = (cantidad * producto.precio);

    return (
        <tbody>
            <tr className="bg-gray-50 hover:bg-gray-100 overflow-y-scroll">
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="text-lg font-medium text-gray-900">
                            {producto.nombre}
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="text-lg font-medium text-gray-900 text-center">
                            $ {FormatAmounts.formatAmountToMoney(producto.precio)}
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="text-lg font-medium text-gray-900 text-center">
                            <input
                                type="number"
                                className="text-center leading-tight shadow appearance-none border rounded w-1/2 text-gray-700 focus:outline-none"
                                onChange={(e) => setCantidad(e.target.value)}
                                value={cantidad}
                                min="0"
                            />
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="text-lg font-medium text-gray-900 text-center">
                        $ {FormatAmounts.formatAmountToMoney(totalProducto)}
                        </div>
                    </div>
                </td>
            </tr>
        </tbody>
    );
}

export default ResumenProducto;