import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';

import api from '../../services/api';

import isConnected from '../../utils/isConnected';

import * as S from './styles';
import logo from '../../assets/logo.png';
import bell from '../../assets/bell.png';

function Header({ clickNotification }) {
    const [lateCount, setLateCount] = useState();
    const [redirect, setRedirect] = useState(false);
    const macaddress = localStorage.getItem('@todo/macaddress');

    async function Logout() {
        localStorage.removeItem('@todo/macaddress');
        setRedirect(true);
    }

    async function lateVerify(signal) {
        await api.get(`/task/filter/late/${macaddress}`, { signal: signal })
            .then(response => {
                setLateCount(response.data.length);
            })
    }

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        lateVerify(signal);

        return function cleanup() {
            abortController.abort();
        }
    }, [])

    return (
        <S.Container>
            { redirect && <Redirect to="/qrcode" />}
            <S.LeftSide>
                <img src={logo} alt="Logo" />
            </S.LeftSide>
            <S.RightSide>
                <Link to="/">INÍCIO</Link>
                <span className="dividir" />
                <Link to="/task">NOVA TAREFA</Link>
                <span className="dividir" />

                {isConnected() ?
                    <button type="button" onClick={Logout}>SAIR</button>
                    :
                    <Link to="/qrcode">SINCRONIZAR CELULAR</Link>
                }
                {
                    lateCount > 0 && isConnected() &&
                    <>
                        <span className="dividir" />
                        <button onClick={clickNotification}>
                            <img src={bell} alt="Notificação" />
                            <span>{lateCount}</span>
                        </button>
                    </>
                }

            </S.RightSide>
        </S.Container>
    )
}

export default Header;
