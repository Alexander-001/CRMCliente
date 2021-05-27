import React, { useState } from 'react';
import Layout from '../components/Layout';
import AlertError from '../components/ui/AlertError'
import AlertSuccess from '../components/ui/AlertSuccess';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { useMutation, useQuery, gql } from '@apollo/client';

const NEW_PRODUCT = gql`
    mutation nuevoProducto($input: ProductoInput) {
        nuevoProducto(input: $input) {
            id
            nombre
            existencia
            precio
            creado
        }
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

const NuevoProducto = () => {

    const [errormessage, setErrorMessage] = useState(null);
    const [successmessage, setSuccessMessage] = useState(null);

    const router = useRouter();

    const { data, loading, client } = useQuery(GET_CLIENTS_USER);
    if (loading) return "Cargando..";
    
    if (!data.obtenerClientesVendedor) {
        client.clearStore();
        router.push('/login');
        return "Loading..";
    }

    const [nuevoProducto] = useMutation(NEW_PRODUCT, {
        update(cache, { data: { nuevoProducto } }) {
            const { obtenerProductos } = cache.readQuery({ query: GET_PRODUCTS });

            cache.writeQuery({
                query: GET_PRODUCTS,
                data: {
                    obtenerProductos: [...obtenerProductos, nuevoProducto]
                }
            })
        }
    });

    const formik = useFormik({
        initialValues: {
            nombre: '',
            cantidad: '',
            precio: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio.'),
            cantidad: Yup.number().required('La cantidad es obligatoria.')
                .positive('Ingresa solo números pósitivos.')
                .integer('La cantidad debe ser números enteros').max(500, 'La cantidad máxima es de 500.'),
            precio: Yup.number().required('El precio es obligatorio.')
                .positive('Ingresa solo números pósitivos.')
        }),
        onSubmit: async (values) => {
            const { nombre, cantidad, precio } = values;
            try {
                const { data } = await nuevoProducto({
                    variables: {
                        input: {
                            nombre: nombre,
                            existencia: cantidad,
                            precio: precio
                        }
                    }
                });
                setSuccessMessage(`Producto ${data.nuevoProducto.nombre} creado correctamente`);
                setTimeout(() => {
                    setSuccessMessage(null);
                    router.push('/productos');
                }, 2000);
            } catch (error) {
                setErrorMessage(error.message);
                setTimeout(() => {
                    setErrorMessage(null);
                }, 2000);
            }
        }
    });

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
        <Layout>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    {errormessage && showErrorMessage()}
                    {successmessage && showSuccessMessage()}
                    <form
                        className="bg-white shadow-xl px-10 pt-5 pb-8 mb-4 rounded-xl"
                        onSubmit={formik.handleSubmit}
                    >
                        <h1 className="text-2xl text-gray-800 font-light text-center mb-5 titulo">Nuevo producto</h1>
                        <div className="mb-3">
                            <label className="block text-black text-lg font-bold mb-2 titulo" htmlFor="nombre">
                                Nombre del producto
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline text-lg"
                                placeholder="Ingresar nombre"
                                id="nombre"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.nombre}
                            />
                        </div>
                        {formik.touched.nombre && formik.errors.nombre ? (
                            <div className="my-2 text-lg bg-red-100 border-l-4 border-red-600 text-red-600 p-4 ">
                                <p className="font-bold titulo">Error</p>
                                <p className="titulo__lista-sidebar">{formik.errors.nombre}</p>
                            </div>
                        ) : null}
                        <div className="mb-3">
                            <label className="block text-black text-lg font-bold mb-2 titulo" htmlFor="cantidad">
                                Cantidad
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline text-lg"
                                placeholder="Ingresar cantidad"
                                id="cantidad"
                                type="number"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.cantidad}
                            />
                        </div>
                        {formik.touched.cantidad && formik.errors.cantidad ? (
                            <div className="my-2 text-lg bg-red-100 border-l-4 border-red-600 text-red-600 p-4 ">
                                <p className="font-bold titulo">Error</p>
                                <p className="titulo__lista-sidebar">{formik.errors.cantidad}</p>
                            </div>
                        ) : null}
                        <div className="mb-3">
                            <label className="block text-black text-lg font-bold mb-2 titulo" htmlFor="precio">
                                Precio
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline text-lg"
                                placeholder="Ingresar precio"
                                id="precio"
                                type="number"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.precio}
                            />
                        </div>
                        {formik.touched.precio && formik.errors.precio ? (
                            <div className="my-2 text-lg bg-red-100 border-l-4 border-red-600 text-red-600 p-4 ">
                                <p className="font-bold titulo">Error</p>
                                <p className="titulo__lista-sidebar">{formik.errors.precio}</p>
                            </div>
                        ) : null}
                        <input
                            type="submit"
                            className="bg-blue-900 text-lg cursor-pointer rounded-lg w-full mt-5 p-2 text-white font-bold hover:bg-gray-900 titulo__lista-sidebar transition duration-500 ease-in-out"
                            value="Registrar producto"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default NuevoProducto;