import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import AlertError from '../../components/ui/AlertError';
import AlertModify from '../../components/ui/AlertModify';
import { useMutation, useQuery, gql } from '@apollo/client';

const GET_CLIENT = gql`
    query obtenerCliente($id: ID!) {
        obtenerCliente(id: $id) {
            id
            nombre
            apellido
            empresa
            email
            telefono
        }
    }
`;

const UPDATE_CLIENT = gql`
    mutation actualizarCliente($id: ID!, $input: ClienteInput){
        actualizarCliente(id: $id, input: $input) {
            id
            nombre
            apellido
            email
            empresa
            telefono
        }
    }
`;



const EditarCliente = () => {

    const [errormessage, setErrorMessage] = useState(null);
    const [successmessage, setSuccessMessage] = useState(null);

    const router = useRouter();
    const { query: { id } } = router;

    const { data, loading, error } = useQuery(GET_CLIENT, {
        variables: {
            id
        }
    });

    const [actualizarCliente] = useMutation(UPDATE_CLIENT);

    const schemaValidacion = Yup.object({
        nombre: Yup.string().required('El nombre es obligatorio.'),
        apellido: Yup.string().required('El apellido es obligatorio.'),
        empresa: Yup.string().required('El campo de empresa es obligatorio.'),
        email: Yup.string().required('El correo es obligatorio.').email('Debe ser un email válido.'),
        telefono: Yup.string().max(12, "El número debe contener máximo 12 caracteres.")
    });

    if (loading) return "Cargando...";

    if(!data) {
        return "Acción no permitida";
    }

    const { obtenerCliente } = data;

    //update client
    const updateClient = async (values) => {
        const { nombre, apellido, empresa, email, telefono } = values;
        try {
            await actualizarCliente({
                variables: {
                    id,
                    input: {
                        nombre,
                        apellido,
                        empresa,
                        email,
                        telefono
                    }
                }
            });
            setSuccessMessage("Cliente actualizado correctamente");
            setTimeout(() => {
                setSuccessMessage(null);
                router.push('/');
            }, 3000);
        } catch (error) {
            setErrorMessage(error.message);
            setTimeout(() => {
                setErrorMessage(null);
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
            <AlertModify
                message={successmessage}
                secondMessage="redirigiendo..."
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
                        validationSchema={schemaValidacion}
                        enableReinitialize
                        initialValues={obtenerCliente}
                        onSubmit={(values) => {
                            updateClient(values)
                        }}
                    >
                        {props => {
                            return (
                                <form
                                    className="bg-white shadow-xl px-10 pt-5 pb-8 mb-4 rounded-xl"
                                    onSubmit={props.handleSubmit}
                                >
                                    <h1 className="text-2xl text-gray-800 font-light text-center mb-5 titulo">Editar cliente</h1>
                                    <div className="mb-3">
                                        <label className="block text-black text-sm font-bold mb-2 titulo" htmlFor="nombre">
                                            Nombre
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
                                        <label className="block text-black text-sm font-bold mb-2 titulo" htmlFor="apellido">
                                            Apellido
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                            placeholder="Ingresar apellido"
                                            id="apellido"
                                            type="text"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.apellido}
                                        />
                                    </div>
                                    {props.touched.apellido && props.errors.apellido ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-600 text-red-600 p-4 ">
                                            <p className="font-bold titulo">Error</p>
                                            <p className="titulo__lista-sidebar">{props.errors.apellido}</p>
                                        </div>
                                    ) : null}
                                    <div className="mb-3">
                                        <label className="block text-black text-sm font-bold mb-2 titulo" htmlFor="empresa">
                                            Empresa
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                            placeholder="Ingresar empresa"
                                            id="empresa"
                                            type="text"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.empresa}
                                        />
                                    </div>
                                    {props.touched.empresa && props.errors.empresa ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-600 text-red-600 p-4 ">
                                            <p className="font-bold titulo">Error</p>
                                            <p className="titulo__lista-sidebar">{props.errors.empresa}</p>
                                        </div>
                                    ) : null}
                                    <div className="mb-3">
                                        <label className="block text-black text-sm font-bold mb-2 titulo" htmlFor="email">
                                            Correo
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                            placeholder="Ingresar correo"
                                            id="email"
                                            type="email"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.email}
                                        />
                                    </div>
                                    {props.touched.email && props.errors.email ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-600 text-red-600 p-4 ">
                                            <p className="font-bold titulo">Error</p>
                                            <p className="titulo__lista-sidebar">{props.errors.email}</p>
                                        </div>
                                    ) : null}
                                    <div className="mb-3">
                                        <label className="block text-black text-sm font-bold mb-2 titulo" htmlFor="telefono">
                                            Telefono
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                            placeholder="Ingresar telefono"
                                            id="telefono"
                                            type="tel"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.telefono}
                                        />
                                    </div>
                                    {props.touched.telefono && props.errors.telefono ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-600 text-red-600 p-4 ">
                                            <p className="font-bold titulo">Error</p>
                                            <p className="titulo__lista-sidebar">{props.errors.telefono}</p>
                                        </div>
                                    ) : null}
                                    <input
                                        type="submit"
                                        className="bg-blue-900 text-lg cursor-pointer rounded-lg w-full mt-5 p-2 text-white font-bold hover:bg-gray-900 titulo__lista-sidebar transition duration-500 ease-in-out"
                                        value="Actualizar cliente"
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

export default EditarCliente;