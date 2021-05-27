import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import AlertError from '../components/ui/AlertError';
import AlertSuccess from '../components/ui/AlertSuccess';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';

const NEW_USER = gql`
    mutation nuevoUsuario($input: UsuarioInput){
        nuevoUsuario(input: $input) {
            id
            nombre
            apellido
            email
        }
    }
`;


const NuevaCuenta = () => {

    //states
    const [checkPassword, setCheckPassword] = useState(true);
    const [checkConfirmPassword, setCheckConfirmPassword] = useState(true);
    const [iconPassword, setIconPassword] = useState(false);
    const [iconConfirmPassword, setIconConfirmPassword] = useState(false);
    const [errormessage, setErrorMessage] = useState(null);
    const [successmessage, setSuccessMessage] = useState(null);

    //create new user with mutation 
    const [nuevoUsuario] = useMutation(NEW_USER);

    //router
    const router = useRouter();

    //validate form with formik and yup
    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio'),
            apellido: Yup.string().required('El apellido es obligatorio'),
            email: Yup.string().email('Debe ser un email válido').required('El email es obligatorio'),
            password: Yup.string().required('El password es obligatorio').min(8, 'Minimo 8 caracteres').matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@_$!%*#?&])[A-Za-z\d@_$!%*#?&]{8,}$/, "Contraseña debe contener al menos un numero y un caracter especial."),
            confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden').required('Campo obligatorio')
        }),
        onSubmit: async (data) => {

            const { nombre, apellido, email, password } = data;
            try {
                const { data } = await nuevoUsuario({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            email,
                            password
                        }
                    }
                });
                //show message after created a user
                setSuccessMessage(`Usuario: ${data.nuevoUsuario.nombre} ${data.nuevoUsuario.apellido} creado exitosamente.`);
                setTimeout(() => {
                    setSuccessMessage(null);
                    router.push('/login');
                }, 3000);
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

    const showConfirmPassword = () => {
        setIconConfirmPassword(!iconConfirmPassword);
        if (setCheckConfirmPassword) {
            const passwordConfirm = document.querySelector('#confirmPassword');
            if (passwordConfirm.type === 'password') {
                passwordConfirm.type = 'text';
            } else {
                passwordConfirm.type = 'password';
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
                                <label className="block text-black text-sm font-bold mb-2 titulo" htmlFor="nombre">
                                    Ingresa tu nombre
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                    placeholder="Primer nombre"
                                    id="nombre"
                                    type="text"
                                    value={formik.values.nombre}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.nombre && formik.errors.nombre ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-600 text-red-600 p-4 ">
                                    <p className="font-bold titulo">Error</p>
                                    <p className="titulo__lista-sidebar">{formik.errors.nombre}</p>
                                </div>
                            ) : null}
                            <div className="mb-3">
                                <label className="block text-black text-sm font-bold mb-2 titulo" htmlFor="apellido">
                                    Ingresa tu apellido
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                    placeholder="Primer apellido"
                                    id="apellido"
                                    type="text"
                                    value={formik.values.apellido}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.apellido && formik.errors.apellido ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-600 text-red-600 p-4 ">
                                    <p className="font-bold titulo">Error</p>
                                    <p className="titulo__lista-sidebar">{formik.errors.apellido}</p>
                                </div>
                            ) : null}
                            <div className="mb-3">
                                <label className="block text-black text-sm font-bold mb-2 titulo" htmlFor="email">
                                    Ingresa tu correo
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                    placeholder="Correo@correo.com"
                                    id="email"
                                    type="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
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
                            <div className="mb-1">
                                <label className="block text-gray-700 text-sm font-bold mb-2 titulo" htmlFor="confirmPassword">
                                    Repite tu contraseña
                                </label>
                                <div className="container__password">
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                        placeholder="Confirmar Password"
                                        id="confirmPassword"
                                        type="password"
                                        value={formik.values.confirmPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    <label className="switch">
                                        {iconConfirmPassword ? (
                                            <i className="fas fa-unlock cursor-pointer"
                                                value={checkConfirmPassword}
                                                onClick={() => showConfirmPassword()}></i>
                                        ) : (
                                            <i className="fas fa-lock cursor-pointer"
                                                value={checkConfirmPassword}
                                                onClick={() => showConfirmPassword()}></i>
                                        )}

                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>
                            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-600 text-red-600 p-4 ">
                                    <p className="font-bold titulo">Error</p>
                                    <p className="titulo__lista-sidebar">{formik.errors.confirmPassword}</p>
                                </div>
                            ) : null}
                            <input
                                type="submit"
                                className="bg-blue-900 w-full rounded-lg cursor-pointer mt-5 p-2 text-white uppercase hover:bg-gray-900 titulo shadow-lg hover:shadow-xl"
                                value="Crear Cuenta"
                            />
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default NuevaCuenta;