import React from 'react'

import { firebase } from '../firebase.js'

const Formulario = () => {

    const [id, setId] = React.useState('')
    const [juego, setJuego] = React.useState('')
    const [descripcion, setDescripcion] = React.useState('')
    const [categoria, setCategoria] = React.useState('')
    const [horasJuego, setHorasJuego] = React.useState('')
    const [jugador, setJugador] = React.useState('')
    const [estadoJuego, setEstadoJuego] = React.useState('')
    const [notasJuego, setNotasJuego] = React.useState('')
    const [listajuegos, setListajuegos] = React.useState([])
    const [modoEdicion, setModoEdicion] = React.useState(false)
    const [error, setError] = React.useState(null)

    React.useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const dataBase = firebase.firestore()
                const data = await dataBase.collection('Juegos').get()
                const arrayData = data.docs.map(item => (
                    {
                        id: item.id, ...item.data()
                    }
                ))

                console.log(arrayData)
                setListajuegos(arrayData)

            } catch (error) {
                console.log(error)
            }
        }
        obtenerDatos()
    }, [])

    const guardarJuegos = async (e) => {
        e.preventDefault()

        if (!juego.trim()) {
            setError('Digite le juego')
            return
        }
        if (!descripcion.trim()) {
            setError('Agregue una Descripción del juego')
            return
        }
        if (!categoria.trim()) {
            setError('Agregue la categoria del juego')
            return
        }
        if (!horasJuego.trim()) {
            setError('Coloque la cantidad de horas dedicadas al juego')
            return
        }
        if (!jugador.trim()) {
            setError('Especifique el nombre del jugador')
            return
        }
        if (!estadoJuego.trim()) {
            setError('Especifique el estado del juego')
            return
        }
        if (!notasJuego.trim()) {
            setError('Coloque algunas notas sobre el juego')
            return
        }

        try {
            const dataBase = firebase.firestore();
            const nuevoRegistro = {
                nombrejuego: juego,
                Descripcion: descripcion,
                Categoria: categoria,
                TiempoJugado: horasJuego,
                nombreJugador: jugador,
                estadoJuego: estadoJuego,
                notasJuego: notasJuego
            };
            const data = await dataBase.collection('Juegos').add(nuevoRegistro)
            console.log(data)
            setListajuegos([...listajuegos,
            {
                nombrejuego: juego,
                Descripcion: descripcion,
                Categoria: categoria,
                TiempoJugado: horasJuego,
                nombreJugador: jugador,
                estadoJuego: estadoJuego,
                notasJuego: notasJuego
            }
            ])

            e.target.reset()
            setJuego('')
            setDescripcion('')
            setCategoria('')
            setHorasJuego('')
            setEstadoJuego('')
            setJugador('')
            setNotasJuego('')

        } catch (error) {
            console.log(error)
        }

    }

    const editar = item => {
        setJuego(item.nombrejuego)
        setDescripcion(item.Descripcion)
        setCategoria(item.Categoria)
        setHorasJuego(item.TiempoJugado)
        setJugador(item.jugador)
        setEstadoJuego(item.estadoJuego)
        setNotasJuego(item.notasJuego)
        setModoEdicion(true)
        setId(item.id)
    }

    const editarJuegos = async e => {
        e.preventDefault()
        
        try {
            const dataBase = firebase.firestore();
            await dataBase.collection('Juegos').doc(id).update({
                nombrejuego: juego,
                Descripcion: descripcion,
                Categoria: categoria,
                TiempoJugado: horasJuego,
                nombreJugador: jugador,
                estadoJuego: estadoJuego,
                notasJuego: notasJuego
            })

            const registroEditado = listajuegos.map(
                item => item.id === id ? {
                    id: id, nombrejuego: juego, Descripcion: descripcion, Categoria: categoria,
                    TiempoJugado: horasJuego, nombreJugador: jugador, estadoJuego: estadoJuego, notasJuego: notasJuego
                } : item
            )

            setListajuegos(registroEditado)
            
            e.target.reset()
            setJuego('')
            setDescripcion('')
            setCategoria('')
            setHorasJuego('')
            setEstadoJuego('')
            setJugador('')
            setNotasJuego('')
            setModoEdicion(false)
            setError(null)

        } catch (error) {
            console.log(error)
        }

    }

    const eliminar = id => {
        const aux = listajuegos.filter(item => item.id !== id)
        setListajuegos(aux)
    }

    const cancelar = () => {
        setModoEdicion(false)
        setId(' ')
        setJuego(' ')
        setDescripcion(' ')
        setCategoria(' ')
        setHorasJuego(' ')
        setJugador(' ')
        setEstadoJuego(' ')
        setNotasJuego(' ')
        setError(null)
    }

    return (
        <div className='container mt-5'>
            <h2 className='text-center'>Fomulario</h2>
            <hr />
            <div className='row'>
                <div className='col-8'>
                    <h4 className='text-center'> Listado de Juegos </h4>
                    <ul className='list-group'>
                        {
                            listajuegos.map((item) => (
                                <li className='list-group-item' key={item.id}>
                                    <span className='lead'>{item.nombreJuego}-{item.descripcionJuego}-{item.categoriaJuego}-{item.horasJuego}
                                        -{item.nombreJugador}-{item.estadoJuego}-{item.notasJuego}
                                    </span>
                                    <button className='btn btn-danger btn-sm float-end mx-2' onClick={() => eliminar(item.id)}>
                                        Eliminar
                                    </button>
                                    <button className='btn btn-warning btn-sm float-end' onClick={() => editar(item)}>
                                        Editar
                                    </button>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className='col-4'>
                    <h4 className='text-center'>
                        {
                            modoEdicion ? 'Editar datos' : 'Agregar datos'
                        }
                        <form onSubmit={modoEdicion ? editarJuegos : guardarJuegos}>
                            {
                                error ? <span className='text-danger'>{error}</span> : null
                            }
                            <input
                                className='form-control mb-2'
                                type="text"
                                placeholder='Ingrese juego'
                                onChange={(e) => setJuego(e.target.value)}
                            />
                            <input
                                className='form-control mb-2'
                                placeholder='Ingrese descripción del Juego'
                                type="text"
                                onChange={(e) => setDescripcion(e.target.value)}
                            />
                            <input
                                className='form-control mb-2'
                                placeholder='Ingrese categoria del Juego'
                                type="text"
                                onChange={(e) => setCategoria(e.target.value)}
                            />
                            <input
                                className='form-control mb-2'
                                placeholder='Ingrese las horas de juego'
                                type="text"
                                onChange={(e) => setHorasJuego(e.target.value)}
                            />
                            <input
                                className='form-control mb-2'
                                placeholder='Ingrese el nombre del jugador'
                                type="text"
                                onChange={(e) => setJugador(e.target.value)}
                            />
                            <input
                                className='form-control mb-2'
                                placeholder='Estado del juego (Completado o Sin finalizar)'
                                type="text"
                                onChange={(e) => setEstadoJuego(e.target.value)}
                            />
                            <input
                                className='form-control mb-2'
                                placeholder='Notas o pensamientos del juego'
                                type="text"
                                onChange={(e) => setNotasJuego(e.target.value)}
                            />

                            {
                                modoEdicion ?
                                    (
                                        <>
                                            <button
                                                className='btn btn-warning btn-block'
                                                type='submit'
                                            >Editar</button>
                                            <button
                                                className='btn btn-darck btn-block mx-2'
                                                onClick={() => cancelar()}
                                            >Cancelar</button>
                                        </>
                                    )
                                    :
                                    <button
                                        className='btn btn-primary btn-block'
                                        type='submit'>
                                        Agregar
                                    </button>
                            }
                        </form>
                    </h4>
                </div>
            </div>
        </div>
    )
}

export default Formulario