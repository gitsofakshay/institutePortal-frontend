import {React,useState} from 'react'
import LoadingContext from './loadingContext'

export default function LoadingState(props) {
    const [loading, setLoading] = useState(false);
    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {props.children}
        </LoadingContext.Provider>
    )
}
