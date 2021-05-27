import React, { useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';

const GET_USER = gql`
    query obtenerUsuario {
        obtenerUsuario {
            id
            nombre
            apellido
            email
        }
    }
`;

const Header = () => {

    const { data, loading, client } = useQuery(GET_USER);

    const router = useRouter();

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        client.clearStore();
        router.push('/login');
    }

    if (loading) return "Cargando..";

    const showAndCloseMenu = (classMenu) => {
        const contenedor = document.querySelector('.barra-lateral');
        const flechaIzquierda = document.querySelector('.fa-arrow-left');
        const flechaDerecha = document.querySelector('.fa-arrow-right');

        if (classMenu.contains('fa-arrow-left')) {
            flechaDerecha.style.display = 'block';
            flechaIzquierda.style.display = 'none';
            contenedor.classList.add('no-menu');
        } else if (classMenu.contains('fa-arrow-right')) {
            flechaDerecha.style.display = 'none';
            flechaIzquierda.style.display = 'block';
            contenedor.classList.remove('no-menu');
        }
    }


    return (
        <div className="flex justify-between mb-10">
            <div className="flex justify-center items-center" id="menu" onClick={(e) => showAndCloseMenu(e.target.classList)}>
                <div className="hidden xl:block">
                    <i className="fas fa-arrow-left text-blue-900 text-3xl mr-5 cursor-pointer"></i>
                    <i className="fas fa-arrow-right text-blue-900 text-3xl cursor-pointer p-2"></i>
                </div>
                <h1 className="mr-2 titulo text-lg lg:text-3xl ml-5 font-bold">Bienvenido {data.obtenerUsuario.nombre} {data.obtenerUsuario.apellido}</h1>
            </div>
            <button
                type="button"
                className="titulo bg-blue-900 w-1/2 text-md sm:w-1/6 font-bold text-white lg:text-xl rounded-lg py-2 px-2 shadow-xl hover:bg-white focus:outline-none hover:text-blue-900 hover:border-blue-900 border-2 transition duration-500 ease-in-out"
                onClick={() => cerrarSesion()}
            >
                Cerrar Sesión
            </button>
        </div>
    );
}

export default Header;