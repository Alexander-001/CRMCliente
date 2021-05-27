import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AlertSuccess from '../components/ui/AlertSuccess';
import Layout from '../components/Layout';
import AlertError from '../components/ui/AlertError';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { gql, useMutation } from '@apollo/client';

const AUTHENTICAR_USER = gql`
    mutation authenticarUsuario($input: AuthenticarInput){
        authenticarUsuario(input: $input){
            token
        }
    }
`;

const Login = () => {

    const [checkPassword, setCheckPassword] = useState(true);
    const [iconPassword, setIconPassword] = useState(false);
    const [errormessage, setErrorMessage] = useState(null);
    const [successmessage, setSuccessMessage] = useState(null);

    //mutation to authenticated
    const [authenticarUsuario] = useMutation(AUTHENTICAR_USER);

    //router
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Debe ser un email válido').required('El email es obligatorio'),
            password: Yup.string().required('El password es obligatorio').min(8, 'Minimo 8 caracteres')
        }),
        onSubmit: async (data) => {
            const { email, password } = data;
            try {
                const { data } = await authenticarUsuario({
                    variables: {
                        input: {
                            email,
                            password
                        }
                    }
                });
                //save token in local storage
                setTimeout(() => {
                    const { token } = data.authenticarUsuario;
                    localStorage.setItem('token', token);
                }, 1000);
                setSuccessMessage('Autenticando..')
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

    const showPassword = () => {
        setIconPassword(!iconPassword);
        if (setCheckPassword) {
            const password = document.querySelector('#password');
            if (password.type === 'password') {
                password.type = 'text';
            } else {
                password.type = 'password';
            }
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
            <Layout>
                {errormessage && showErrorMessage()}
                {successmessage && showSuccessMessage()}
                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm">
                        <form
                            className="bg-white rounded shadow-xl px-8 pt-6 pb-8 mb-4 mr-5 ml-5 md:m-0"
                            onSubmit={formik.handleSubmit}
                        >
                            <h1 className="text-center text-4xl text-blue-900 font-bold mb-5 titulo__logo">VentaShop</h1>
                            <div className="mb-3">
                                <label className="block text-black text-sm font-bold mb-2 titulo" htmlFor="email">
                                    Ingresa tu correo
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                    placeholder="Correo@correo.com"
                                    id="email"
                                    type="email"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                />
                            </div>
                            {formik.touched.email && formik.errors.email ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-600 text-red-600 p-4 ">
                                    <p className="font-bold titulo">Error</p>
                                    <p className="titulo__lista-sidebar">{formik.errors.email}</p>
                                </div>
                            ) : null}
                            <div className="mb-1">
                                <label className="block text-gray-700 text-sm font-bold mb-2 titulo" htmlFor="password">
                                    Ingresa tu contraseña
                                </label>
                                <div className="container__password">
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                        placeholder="Password"
                                        id="password"
                                        type="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    <label className="switch">
                                        {iconPassword ? (
                                            <i className="fas fa-unlock cursor-pointer"
                                                value={checkPassword}
                                                onClick={() => showPassword()}></i>
                                        ) : (
                                            <i className="fas fa-lock cursor-pointer"
                                                value={checkPassword}
                                                onClick={() => showPassword()}></i>
                                        )}

                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>
                            {formik.touched.password && formik.errors.password ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-600 text-red-600 p-4 ">
                                    <p className="font-bold titulo">Error</p>
                                    <p className="titulo__lista-sidebar">{formik.errors.password}</p>
                                </div>
                            ) : null}
                            <div>
                                <input
                                    type="submit"
                                    className="bg-blue-900 w-full rounded-lg cursor-pointer mt-5 p-2 text-white uppercase hover:bg-gray-900 titulo shadow-lg hover:shadow-xl"
                                    value="Iniciar Sesión"
                                />
                                <Link href="/nuevacuenta">
                                    <a className="flex flex-row-reverse mt-2 text-blue-900 text-sm titulo font-semibold hover:text-black">Crear nueva cuenta</a>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default Login;