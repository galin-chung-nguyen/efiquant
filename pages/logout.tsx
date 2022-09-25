import type { NextPage } from 'next'
import { useEffect } from 'react';

const Logout: NextPage = () => {
    useEffect(() => {
        localStorage.removeItem('jwtToken');
        window.location.href = '/stock/BTC';
    }, []);
    return (
        <></>
    )
}

export default Logout
