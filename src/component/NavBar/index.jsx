import React from 'react'
import { Link } from 'react-router-dom'

function NavBar() {
  return (
    <div >
        <nav className=" p-5   md:w-[80%] fixed top-0 bg-white/3 px-5 md:px-0  backdrop-blur-sm right-0 left-0 mx-auto  border-b border-gray-200" >
            <div className="container mx-auto flex justify-between items-center">
            <Link to={'/'} className="text-black cursor-pointer hover:text-pink-500 text-lg font-bold">Pauk Thae Application</Link>
            <ul className="flex space-x-4">
                
                <li><a href="/policy" className="text-black transition-all duration-300 hover:text-pink-500 cursor-pointer">Privacy & Policy</a></li>
            </ul>
            </div>
        </nav>
    </div>
  )
}

export default NavBar