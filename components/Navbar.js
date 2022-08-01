import Head from 'next/head'
import styles from "../styles/Home.module.css";
import Link from "next/link"
import {useState } from "react";
import { HiMenu } from "react-icons/hi";
import { BiX } from "react-icons/bi";



function Navbar () {
    const [openMenu,setOpenMenu] = useState(false)
    return (
        <nav className='shadow-md fixed w-full z-50  '>
                <div className='flex items-center bg-white h-24 rounded-b-lg w-full' >
                    <div className='flex items items-center w-full mx-5 md:mx-20 justify-between'>
                        <div className='flex items-center justify-center '>
                            <h1 className='font-bold text-2xl cursor-pointer'>
                                 NFT <span className='text-green-400'> AIR</span>
                            </h1>
                        </div>
                        <div className='hidden md:block'>
                            <div className='ml-10 flex items-baseline space-x-8'>
                                <Link href="/" className=' cusor-pointer '>
                                    <div className='no-underline font-semibold text-black-600 hover:text-orange-600 cursor-pointer'>
                                        Home
                                    </div>
                                </Link>
                                <Link href="/Feed" className=' cusor-pointer '>
                                    <div className='no-underline font-semibold text-black-600 hover:text-orange-600 cursor-pointer'>
                                        Feed
                                    </div>
                                </Link>
                                <Link href="/starred" className=' cusor-pointer '>
                                    <div className='no-underline font-semibold text-black-600 hover:text-orange-600 cursor-pointer'>
                                        Starred
                                    </div>
                                </Link>
                                <Link href="/creations" className=' cusor-pointer '>
                                    <div className='no-underline font-semibold text-black-600 hover:text-orange-600 cursor-pointer'>
                                       Creations
                                    </div>
                                </Link>

                                <Link href="/create" className=' cusor-pointer '>
                                    <button className='no-underline bg-green-500 py-2 px-3 rounded-lg font-bold text-teal-50 hover:bg-orange-500 cursor-pointer '>
                                        Create NFT
                                    </button>
                                </Link>
                                
                            </div>
                        </div>
                        <div className='block md:hidden'>
                            <button onClick={()=> setOpenMenu(!openMenu)} className=' ml-10 cursor-pointer flex items-center bg-green-500 text-gray-50  hover:bg-orange-500 px-2 py-2 rounded-lg '>
                               
                                {
                                    !openMenu ? 
                                    (
                                        <HiMenu className='font-bold text-2xl' /> 
                                    )
                                    :
                                    (
                                        <BiX className='font-bold text-2xl' />
                                        
                                    )
                                }
                            </button>
                        </div>
                    </div>
                </div>      
                <div className='md:hidden  bg-white  rounded-b-lg w-full ' >
                    <div className=' mx-20 justify-between'>
                        {
                            openMenu && 
                            <div className=' flex flex-column items-center  space-y-8 py-3'>
                                <Link href="/" className=' cusor-pointer '>
                                    <div className='no-underline font-semibold text-lg text-black-600 hover:text-orange-600 block cursor-pointer'>
                                        Home
                                    </div>
                                </Link>
                                <Link href="/Feed" className=' cusor-pointer '>
                                    <div className='no-underline font-semibold text-lg text-black-600 hover:text-orange-600 cursor-pointer'>
                                        Feed
                                    </div>
                                </Link>
                                <Link href="/starred" className=' cusor-pointer '>
                                    <div className='no-underline font-semibold text-lg text-black-600 hover:text-orange-600 cursor-pointer'>
                                        Starred
                                    </div>
                                </Link>
                                <Link href="/creations" className=' cusor-pointer '>
                                    <div className='no-underline font-semibold text-lg text-black-600 hover:text-orange-600 cursor-pointer'>
                                       Creations
                                    </div>
                                </Link>

                                <Link href="/create" className=' cusor-pointer '>
                                    <button className='no-underline bg-green-500 py-2 px-3 rounded-lg font-semibold text-lg text-teal-50  hover:bg-orange-500 cursor-pointer '>
                                        Create NFT
                                    </button>
                                </Link>
                            </div>
                        }
                    </div>
                </div>           
        </nav>
    )
}

export default Navbar