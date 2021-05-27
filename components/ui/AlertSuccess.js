import React from 'react';

const AlertSuccess = ({ message }) => {
    return (
        <div className="py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline font-bold">{message}</span>
            </div>
        </div>
    );
}

export default AlertSuccess;