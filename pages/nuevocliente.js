import React, { useState } from 'react';
import Layout from '../components/Layout';
import AlertError from '../components/ui/AlertError';
import AlertSuccess from '../components/ui/AlertSuccess';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

const NEW_CLIENT = gql`
    mutation nuevoCliente($input: ClienteInput) {
        nuevoCliente(input: $input) {
            nombre
            apellido
            empresa
            email
            telefono
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


const NuevoCliente = () => {

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

    const [nuevoCliente] = useMutation(NEW_CLIENT, {
        //actualizar cache
        update(cache, { data: { nuevoCliente } }) {
            //obtener el objeto de cache
            const { obtenerClientesVendedor } = cache.readQuery({ query: GET_CLIENTS_USER });
            //reescribimos el cache (nunca modificar)
            cache.writeQuery({
                query: GET_CLIENTS_USER,
                data: {
                    obtenerClientesVendedor: [...obtenerClientesVendedor, nuevoCliente]
                }
            });
        }
    });

    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            empresa: '',
            email: '',
            telefono: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio.'),
            apellido: Yup.string().required('El apellido es obligatorio.'),
            empresa: Yup.string().required('El campo de empresa es obligatorio.'),
            email: Yup.string().required('El correo es obligatorio.').email('Debe ser un email válido.')
        }),
        onSubmit: async data => {
            const { nombre, apellido, empresa, email, telefono } = data;
            try {
                await nuevoCliente({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            empresa,
                            email,
                            telefono
                        }
                    }
                });
                
                setSuccessMessage('Cliente registrado correctamente');
                setTimeout(() => {
                    setSuccessMessage(null);
                    router.push('/');
                }, 2000);
            } catch (error) {
                setErrorMessage(error.message);
                setTimeout(() => {
                    setErrorMessage(null);
                }, 3000);
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
                        <h1 className="text-3xl text-gray-800 font-light text-center mb-5 titulo">Nuevo cliente</h1>
                        <div className="mb-3">
                            <label className="block text-black text-lg font-bold mb-2 titulo" htmlFor="nombre">
                                Nombre
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
                            <div className="my-2 bg-red-100 text-lg border-l-4 border-red-600 text-red-600 p-4 ">
                                <p className="font-bold titulo">Error</p>
                                <p className="titulo__lista-sidebar">{formik.errors.nombre}</p>
                            </div>
                        ) : null}
                        <div className="mb-3">
                            <label className="block text-black text-lg font-bold mb-2 titulo" htmlFor="apellido">
                                Apellido
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline text-lg"
                                placeholder="Ingresar apellido"
                                id="apellido"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.apellido}
                            />
                        </div>
                        {formik.touched.apellido && formik.errors.apellido ? (
                            <div className="my-2 text-lg bg-red-100 border-l-4 border-red-600 text-red-600 p-4 ">
                                <p className="font-bold titulo">Error</p>
                                <p className="titulo__lista-sidebar">{formik.errors.apellido}</p>
                            </div>
                        ) : null}
                        <div className="mb-3">
                            <label className="block text-black text-lg font-bold mb-2 titulo" htmlFor="empresa">
                                Empresa
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline text-lg"
                                placeholder="Ingresar empresa"
                                id="empresa"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.empresa}
                            />
                        </div>
                        {formik.touched.empresa && formik.errors.empresa ? (
                            <div className="my-2 text-lg bg-red-100 border-l-4 border-red-600 text-red-600 p-4 ">
                                <p className="font-bold titulo">Error</p>
                                <p className="titulo__lista-sidebar">{formik.errors.empresa}</p>
                            </div>
                        ) : null}
                        <div className="mb-3">
                            <label className="block text-black text-lg font-bold mb-2 titulo" htmlFor="email">
                                Correo
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline text-lg"
                                placeholder="Ingresar correo"
                                id="email"
                                type="email"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                            />
                        </div>
                        {formik.touched.email && formik.errors.email ? (
                            <div className="my-2 text-lg bg-red-100 border-l-4 border-red-600 text-red-600 p-4 ">
                                <p className="font-bold titulo">Error</p>
                                <p className="titulo__lista-sidebar">{formik.errors.email}</p>
                            </div>
                        ) : null}
                        <div className="mb-3">
                            <label className="block text-black text-lg font-bold mb-2 titulo" htmlFor="telefono">
                                Telefono
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline text-lg"
                                placeholder="Ingresar telefono"
                                id="telefono"
                                type="tel"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.telefono}
                            />
                        </div>
                        {formik.touched.telefono && formik.errors.telefono ? (
                            <div className="my-2 text-lg bg-red-100 border-l-4 border-red-600 text-red-600 p-4 ">
                                <p className="font-bold titulo">Error</p>
                                <p className="titulo__lista-sidebar">{formik.errors.telefono}</p>
                            </div>
                        ) : null}
                        <input
                            type="submit"
                            className="bg-blue-900 text-lg cursor-pointer rounded-lg w-full mt-5 p-2 text-white font-bold hover:bg-gray-900 titulo__lista-sidebar transition duration-500 ease-in-out"
                            value="Registrar cliente"
                        />

                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default NuevoCliente;