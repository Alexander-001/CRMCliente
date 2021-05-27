import React, { useState } from 'react';
import Layout from '../../components/Layout';
import AlertError from '../../components/ui/AlertError';
import AlertSuccess from '../../components/ui/AlertSuccess';
import { useRouter } from 'next/router';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Formik } from 'formik';
import * as Yup from 'yup';

const GET_PRODUCT = gql`
    query obtenerProducto($id: ID!) {
        obtenerProducto(id: $id) {
            id
            nombre
            existencia
            precio
        }
    }
`;

const UPDATE_PRODUCT = gql`
    mutation actualizarProducto($id: ID!, $input: ProductoInput) {
        actualizarProducto(id: $id, input: $input) {
            id
            nombre
            existencia
            precio
        }
    }
`;


const EditarProducto = () => {

    const [errormessage, setErrorMessage] = useState(null);
    const [successmessage, setSuccessMessage] = useState(null);

    const router = useRouter();
    const { query: { id } } = router;

    const { data, loading, error } = useQuery(GET_PRODUCT, {
        variables: {
            id
        }
    });

    const [actualizarProducto] = useMutation(UPDATE_PRODUCT);

    const schemaValidation = Yup.object({
        nombre: Yup.string().required('El nombre es obligatorio.'),
        existencia: Yup.number().required('La cantidad es obligatoria.')
            .positive('Ingresa solo números pósitivos.')
            .integer('La cantidad debe ser números enteros').max(500, 'La cantidad máxima es de 500.'),
        precio: Yup.number().required('El precio es obligatorio.')
            .positive('Ingresa solo números pósitivos.')
    });

    if (loading) return "Cargando...";

    if(!data) {
        return "Acción no permitida";
    }

    const { obtenerProducto } = data;

    const updateProduct = async (values) => {

        const { nombre, existencia, precio } = values;
        try {
            await actualizarProducto({
                variables: {
                    id,
                    input: {
                        nombre,
                        existencia,
                        precio
                    }
                }
            });

            setSuccessMessage('Producto actualizado correctamente');
            setTimeout(() => {
                setSuccessMessage(null);
                router.push('/productos');
            }, 2000);
        } catch (error) {
            setErrorMessage(error.message);
            setTimeout(() => {
                setErrorMessage(null)
            }, 3000);
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
        <Layout>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    {errormessage && showErrorMessage()}
                    {successmessage && showSuccessMessage()}
                    <Formik
                        enableReinitialize
                        initialValues={obtenerProducto}
                        validationSchema={schemaValidation}
                        onSubmit={values => {
                            updateProduct(values);
                        }}
                    >
                        {props => {

                            return (


                                <form
                                    className="bg-white shadow-xl px-10 pt-5 pb-8 mb-4 rounded-xl"
                                    onSubmit={props.handleSubmit}
                                >
                                    <h1 className="text-2xl text-gray-800 font-light text-center mb-5 titulo">Nuevo producto</h1>
                                    <div className="mb-3">
                                        <label className="block text-black text-sm font-bold mb-2 titulo" htmlFor="nombre">
                                            Nombre del producto
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                            placeholder="Ingresar nombre"
                                            id="nombre"
                                            type="text"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.nombre}
                                        />
                                    </div>
                                    {props.touched.nombre && props.errors.nombre ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-600 text-red-600 p-4 ">
                                            <p className="font-bold titulo">Error</p>
                                            <p className="titulo__lista-sidebar">{props.errors.nombre}</p>
                                        </div>
                                    ) : null}
                                    <div className="mb-3">
                                        <label className="block text-black text-sm font-bold mb-2 titulo" htmlFor="existencia">
                                            Cantidad
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                            placeholder="Ingresar cantidad"
                                            id="existencia"
                                            type="number"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.existencia}
                                        />
                                    </div>
                                    {props.touched.existencia && props.errors.existencia ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-600 text-red-600 p-4 ">
                                            <p className="font-bold titulo">Error</p>
                                            <p className="titulo__lista-sidebar">{props.errors.existencia}</p>
                                        </div>
                                    ) : null}
                                    <div className="mb-3">
                                        <label className="block text-black text-sm font-bold mb-2 titulo" htmlFor="precio">
                                            Precio
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                            placeholder="Ingresar precio"
                                            id="precio"
                                            type="number"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.precio}
                                        />
                                    </div>
                                    {props.touched.precio && props.errors.precio ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-600 text-red-600 p-4 ">
                                            <p className="font-bold titulo">Error</p>
                                            <p className="titulo__lista-sidebar">{props.errors.precio}</p>
                                        </div>
                                    ) : null}
                                    <input
                                        type="submit"
                                        className="bg-blue-900 text-lg cursor-pointer rounded-lg w-full mt-5 p-2 text-white font-bold hover:bg-gray-900 titulo__lista-sidebar transition duration-500 ease-in-out"
                                        value="Actualizar producto"
                                    />
                                </form>
                            )
                        }}
                    </Formik>
                </div>
            </div>
        </Layout>
    );
}

export default EditarProducto;