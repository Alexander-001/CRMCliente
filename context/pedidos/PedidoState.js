import React, { useReducer } from 'react';
import PedidoContext from './PedidoContext';
import PedidoReducer from './PedidoReducer';
import {
    SELECCIONAR_CLIENTE, SELECCIONAR_PRODUCTO, 
    CANTIDAD_PRODUCTOS, ACTUALIZAR_TOTAL,
    ACTUALIZAR_PRECIO_UNITARIO
} from '../../types';

const PedidoState = ({ children }) => {

    const initialState = {
        cliente: {},
        productos: [],
        total: 0,
        preciounitario: 0
    }

    const [state, dispatch] = useReducer(PedidoReducer, initialState);

    const agregarCliente = cliente => {
        dispatch({
            type: SELECCIONAR_CLIENTE,
            payload: cliente
        });
    }

    const agregarProducto = productosSelect => {
        let newState;
        if (state.productos.length > 0) {
            newState = productosSelect.map(producto => {
                const newObject = state.productos.find(productoState => productoState.id === producto.id);
                return {
                    ...producto,
                    ...newObject
                }
            })
        } else {
            newState = productosSelect;
        }
        dispatch({
            type: SELECCIONAR_PRODUCTO,
            payload: newState
        });
    }

    const cantidadProductos = producto => {
        dispatch({
            type: CANTIDAD_PRODUCTOS,
            payload: producto
        });
    }

    const actualizarTotal = () => {
        dispatch({
            type: ACTUALIZAR_TOTAL
        });
    }
    

    return (
        <PedidoContext.Provider
            value={{
                cliente: state.cliente,
                productos: state.productos,
                total: state.total,
                preciounitario: state.preciounitario,
                agregarCliente,
                agregarProducto,
                cantidadProductos,
                actualizarTotal
            }}
        >
            {children}
        </PedidoContext.Provider>
    )
}

export default PedidoState;


