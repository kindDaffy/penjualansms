import React from 'react';

const ApplicationLogo = ({ img, className = '' }) => {
    return (
        <img
            src={`/images/${img}`} // Path gambar sesuai folder public/images
            alt="Application Logo"
            className={`object-contain ${className}`}
        />
    );
};

export default ApplicationLogo;
