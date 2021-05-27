import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar = () => {

    const router = useRouter();

    return (
        <>
            <aside className="shadow-2xl bg-blue-900 w-full xl:w-1/4 xl:min-h-screen p-5 barra-lateral">

                <p className="text-white text-2xl font-bold titulo__logo text-center lg:text-left">VentaShop</p>


                <nav className="mt-5 list-none nav__sidebar">
                    <li className={router.pathname === "/" ? "bg-gray-900 shadow-lg rounded-md mb-3 cursor-pointer" : "mb-3 hover:bg-gray-900 rounded-md cursor-pointer"} >
                        <Link href="/">
                            <a className="text-white mb-2 block titulo__lista-sidebar text-xl text-center lg:text-left"><i className="fas fa-users mr-2 p-2 text-center rounded-full"></i>Clientes</a>
                        </Link>
                    </li>
                    <li className={router.pathname === "/pedidos" ? "bg-gray-900 text-black shadow-lg rounded-md mb-3 cursor-pointer" : "mb-3 hover:bg-gray-900 rounded-md cursor-pointer"} >
                        <Link href="/pedidos">
                            <a className="text-white mb-2 block titulo__lista-sidebar text-xl text-center lg:text-left"><i className="fas fa-clipboard-list mr-3 text-center p-2 rounded-full"></i>Pedidos</a>
                        </Link>
                    </li>
                    <li className={router.pathname === "/productos" ? "bg-gray-900 text-black shadow-lg rounded-md mb-3 cursor-pointer" : "mb-3 hover:bg-gray-900 rounded-md cursor-pointer"} >
                        <Link href="/productos">
                            <a className="text-white mb-2 block titulo__lista-sidebar text-xl text-center lg:text-left"><i className="fas fa-archive mr-2 text-center p-2 rounded-full"></i>Productos</a>
                        </Link>
                    </li>
                </nav>

                <p className="text-white text-2xl font-bold titulo__logo text-center lg:text-left">Análisis de datos</p>
                <nav className="mt-5 list-none nav__sidebar">
                    <li className={router.pathname === "/mejoresvendedores" ? "bg-gray-900 shadow-lg rounded-md mb-3 cursor-pointer" : "mb-3 hover:bg-gray-900 rounded-md cursor-pointer"} >
                        <Link href="/mejoresvendedores">
                            <a className="text-white mb-2 block titulo__lista-sidebar text-xl text-center lg:text-left"><i className="fas fa-chart-line mr-2 p-2 text-center rounded-full"></i>Mejores vendedores</a>
                        </Link>
                    </li>
                    <li className={router.pathname === "/mejoresclientes" ? "bg-gray-900 shadow-lg rounded-md mb-3 cursor-pointer" : "mb-3 hover:bg-gray-900 rounded-md cursor-pointer"} >
                        <Link href="/mejoresclientes">
                            <a className="text-white mb-2 block titulo__lista-sidebar text-xl text-center lg:text-left"><i className="fas fa-handshake mr-2 p-2 text-center rounded-full"></i>Mejores clientes</a>
                        </Link>
                    </li>
                </nav>
            </aside>
        </>
    );
}

export default Sidebar;