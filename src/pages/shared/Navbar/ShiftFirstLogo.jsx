import React from 'react';
import logo from './../../../assets/logo.png';

const ShiftFirstLogo = () => {
    return (
        <div className='flex items-end'>
           <img className='mb-2' src={logo} alt="" /> 
           <h1 className='text-3xl -ml-2 font-extrabold'>Shift-First</h1>
        </div>
    );
};

export default ShiftFirstLogo;