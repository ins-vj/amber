"use client";
import React from 'react';
import{Home,ShoppingCart, Settings} from "lucide-react";
import AnimatedIconButton from './animated-icon-button';

const Navbar = ({student}:any) => {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-[#272729] p-10 shadow-lg">
      <div className="text-4xl font-bold text-white tracking-wide">Amber</div>

      <div className="space-x-8">
        {/* <button className="text-white text-xl hover:text-gray-300 transition duration-200">
          <div className='flex'> Home <Home/></div>
        </button> */}
        <AnimatedIconButton text="Home" icon="Home" />

        {/* <button className="text-white text-xl hover:text-gray-300 transition duration-200">
        <div className='flex'>  My Cart <ShoppingCart/></div>

        </button> */}
        <AnimatedIconButton text="My Cart" icon="ShoppingCart" />

        {/* <button className="text-white text-xl hover:text-gray-300 transition duration-200">
          <div className="flex"> Setting <Settings/></div>
        </button> */}
        <AnimatedIconButton text="Setting" icon="Settings" />

        <button className="text-white text-xl hover:text-gray-300 transition duration-200">
          <a href="/dashboard" className='flex justify-center'>{student.name}
          <img src={student.imgUrl} alt="pic" className='h-8 rounded-full mr-3 ml-3'/>
          </a>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
