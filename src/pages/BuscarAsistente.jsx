import React, { useState } from 'react'
import logo from '../images/logo.png'
import clienteAxios from '../config/clienteAxios'
import Alerta from '../components/Alerta'

const BuscarAsistente = () => {
    //Informacion clientes
    const [cedula, setCedula] = useState('')
    const [nombre, setNombre] = useState('')
    const [empresa, setEmpresa] = useState('')
    const [id, setId] = useState('')
    const [alerta, setAlerta] = useState('')
    //Flag para habilitar o deshabilitar boton
    const [isDisabled, setIsDisabled] = useState(true)
    //Input para buscar cliente
    const [inputBuscador, setInputBuscador] = useState('')

    //Evento de submit para buscar al Cliente form
    const handleSubmitBuscar = async e => {
        e.preventDefault()
        //Verificar que no este vacio el campo
        if ([inputBuscador].includes('')) {
            //Set alerta de error
            setAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
            //Set vacio todos los campos y deshabilitar boton
            setCedula('')
            setNombre('')
            setEmpresa('')
            setIsDisabled(true)
            return
        }

        try {
            //Query get para obtener datos del contacto
            const { data } = await clienteAxios(`/usuarios/cedula/${inputBuscador}`)
            //Set informacion apra mostrar en los campos
            setId(data._id)
            setCedula(data.cedula)
            setNombre(data.nombre)
            setEmpresa(data.empresa)
            //Habilitar boton para imprimir
            setIsDisabled(false)
            //Borrar input para buscar
            setInputBuscador('')
            //Set alerta sin error
            setAlerta({
                msg: '',
                error: false
            })

        } catch (error) {
            //Set alerta con Error
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            //Set campos en vacio
            setCedula('')
            setNombre('')
            setEmpresa('')
            setIsDisabled(true)
        }

    }
    //Evento para mandar a imprir QR
    const handleSubmitImprimir = async e => {
        e.preventDefault()
        try {
            //Query mandar a imprimir
            const { data } = await clienteAxios.post(`/printers/reciboQR`,{id})
            //Set alerta 
            setAlerta({
                msg: 'Imprimiendo...',
                error: false
            })
            //Borrar alerta despues de 1200ms
            setTimeout(() => {
                setAlerta({
                    msg: '',
                    error: false
                })
              }, 1200);
        } catch (error) {
            //Mostrar ensaje de error alerta
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }

        setCedula('')
        setNombre('')
        setEmpresa('')
    }

    const { msg } = alerta

    return (
        <div id='unisAirline' >
            <div className='flex flex-row-reverse h-[10vh]'>
                <img src={logo} />
            </div>

            <div className='h-[90vh] justify-center lg:w-2/3 mx-auto'>
                <p className='uppercase text-center font-bold text-2xl text-white sm:text-2xl'>Buscar asistente</p>

                {msg && <Alerta alerta={alerta} />}

                <form onSubmit={handleSubmitBuscar} action="" className='text-[#02275e] rounded-lg  my-auto  m-2 sm:mx-20 shadow-md flex justify-between'>
                    <input
                        autoFocus
                        id='cedula'
                        type='text'
                        placeholder='Ingresa la cédula del usuario'
                        className='w-full m-5 p-3 border rounded bg-gray-50 text-[#02275e]'
                        value={inputBuscador}
                        onChange={e => setInputBuscador(e.target.value)}
                    />
                    <input
                        type='submit'
                        value={'Buscar'}
                        className='bg-sky-700 w-1/3 m-5 p-3 text-white uppercase font-bold rounded hover:cursor-pointer
                            hover:bg-sky-800 transition-colors'
                    />
                </form>
                <div className='text-[#02275e] rounded-lg  my-auto p-8 m-3 sm:mx-20 shadow-md'>
                    <form onSubmit={handleSubmitImprimir}>
                        <div className='my-2'>
                            <label
                                className=' text-white block text-xl font-bold'
                                htmlFor='cedula'
                            >Cédula:</label>
                            <input
                                readOnly
                                id='cedula'
                                type='text'
                                placeholder='Ingresa su cédula'
                                className='read-only:bg-gray-200 w-full mt-3 p-3 border rounded-xl bg-gray-50 text-[#02275e] '
                                value={cedula}
                            />
                        </div>
                        <div className='my-2'>
                            <label
                                className=' text-white block text-xl font-bold'
                                htmlFor='nombre'
                            >Nombre:</label>
                            <input
                                readOnly
                                id='nombre'
                                type='text'
                                placeholder='Ingresa su nombre'
                                className='read-only:bg-gray-200 w-full mt-3 p-3 border rounded-xl bg-gray-50 text-[#02275e]'
                                value={nombre}
                            />
                        </div>

                        <div className='my-2'>
                            <label
                                className=' text-white block text-xl font-bold'
                                htmlFor='empresa'
                            >Empresa:</label>
                            <input
                                readOnly
                                id='empresa'
                                type='text'
                                placeholder='Ingresa su empresa'
                                className='read-only:bg-gray-200 w-full mt-3 p-3 border rounded-xl bg-gray-50 text-[#02275e]'
                                value={empresa}
                            />
                        </div>
                        <input
                            disabled={isDisabled ? true : false}
                            type='submit'
                            value={'Imprimir QR'}
                            className='bg-sky-700 w-full py-3 mt-2  text-white uppercase font-bold rounded hover:cursor-pointer
                            hover:bg-sky-800 transition-colors disabled:bg-gray-400'
                        />
                    </form>
                    <nav className='lg:flex lg:justify-between'>
                        <p className='block text-center my-5 text-slate-500 uppercase text-sm '>
                            ¿No encuentras al usuario? <span className='font-extrabold'> Crea un nuevo usuario</span> </p>
                    </nav>
                </div>
            </div>
        </div>
    )
}

export default BuscarAsistente