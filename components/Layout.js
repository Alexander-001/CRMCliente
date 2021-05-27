import React from 'react';
import Head from 'next/head';
import Sidebar from './Sidebar';
import Header from './Header';
import { useRouter } from 'next/router';

const Layout = ({ children }) => {

    const router = useRouter();

    return (
        <>
            <Head>
                <title>CRM</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossorigin="anonymous" />
                <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.googleapis.com/css2?family=Concert+One&family=Merienda:wght@700&family=PT+Sans&family=Roboto+Slab:wght@900&display=swap" rel="stylesheet"/>
            </Head>
            {router.pathname === '/login' || router.pathname === '/nuevacuenta' ? (
                <div className="bg-gray-900 min-h-screen flex flex-col justify-center">
                    <div>{children}</div>
                </div>
            ) : (
                <div className="bg-gray-100 min-h-screen">
                    <div className="flex flex-col xl:flex-row min-h-screen">
                        <Sidebar />

                        <main className="md:w-full xl:min-h-screen p-5">
                            <Header />
                            {children}
                        </main>
                    </div>
                </div >
            )}

        </>
    );
}

export default Layout;