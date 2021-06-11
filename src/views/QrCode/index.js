import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import Qr from 'qrcode.react';
import * as S from './styles';

// import api from '../../services/api';

import Header from '../../components/Header';
import Footer from '../../components/Footer';


function QrCode() {
    const [mac, setMac] = useState('');
    const [redirect, setRedirect] = useState(false);

    const abortController = new AbortController();

    async function SaveMac() {
        await localStorage.setItem('@todo/macaddress', mac, { signal: abortController.signal });
        abortController.abort();
        setRedirect(true);
        // window.location.reload();
    }

    return (
        <S.Container>
            { redirect && <Redirect to="/" />}
            <Header />
            <S.Content>
                <h1>CAPTURE O QRCODE PELO APP</h1>

                <S.QrCodeArea>
                    <Qr value='getmacaddress' size={350} />
                </S.QrCodeArea>

                <p>suas atividades serão sincronizadas com a do seu celular.</p>
            </S.Content>

            <S.ValidationCode>
                <span>Digite a numeração que apareceu no seu celular</span>
                <input type="text" onChange={e => setMac(e.target.value)} value={mac} />
                <button type="button" onClick={SaveMac}>SINCRONIZAR</button>
            </S.ValidationCode>
            <p></p>
            <p></p>
            <Footer />
        </S.Container>
    )
}

export default QrCode
