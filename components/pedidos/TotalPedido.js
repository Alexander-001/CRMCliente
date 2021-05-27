import React, { useContext } from 'react';
import { FormatAmounts } from '../../libs/formatAmounts';
import PedidoContext from '../../context/pedidos/PedidoContext';


const TotalPedido = () => {

    const pedidoContext = useContext(PedidoContext);
    const { total, productos } = pedidoContext;

    return (
        <>
            {productos.length > 0 ? (
                <div className="flex shadow-lg items-center mt-5 justify-between bg-white w-full lg:w-2/5 rounded-lg p-3 border-solid border-2 border-gray-200 titulo__lista-sidebar">
                    <h2 className="text-gray-500 text-xl">Total a pagar:</h2>
                    <p className="text-blue-900 font-bold mt-0 text-xl">$ {FormatAmounts.formatAmountToMoney(total)}</p>
                </div>
            ) : null}
        </>
    );
}

export default TotalPedido;