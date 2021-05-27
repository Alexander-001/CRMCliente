import React from 'react';

const AlertError = ({ message }) => {
    return (
        <div className="py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline font-bold">{message}</span>
            </div>
        </div>
    );
}

export default AlertError;