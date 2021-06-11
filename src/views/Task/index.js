import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import api from '../../services/api';
import { format } from 'date-fns';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TypeIcons from '../../utils/typeIcons'
import iconCalendar from '../../assets/calendar.png';
import iconClock from '../../assets/clock.png';
import * as S from './styles';

function Task({ match }) {
    const [redirect, setRedirect] = useState(false);
    const [type, setType] = useState('');
    // const [id, setId] = useState();
    const [done, setDone] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [hour, setHour] = useState('');
    const [macaddress,] = useState(localStorage.getItem('@todo/macaddress')); // 888888
    // const macaddress = localStorage.getItem('@todo/macaddress');

    async function Save() {
        if (!title)
            return alert("Você precisa informar o título da terefa")
        else if (!description)
            return alert("Você precisa informar a descrição da terefa")
        else if (!type)
            return alert("Você precisa selecionar o tipo da terefa")
        else if (!date)
            return alert("Você precisa definir a data da terefa")
        else if (!hour)
            return alert("Você precisa definir a hora da terefa")

        if (match.params.id) {
            await api.patch(`/task/${match.params.id}`, {
                macaddress,
                done,
                type,
                title,
                description,
                when: `${date}T${hour}:00.000`
            }).then(() => {
                setRedirect(true);
            })
                .catch(error => {
                    return alert(error.response.data.error)
                })
        }
        else {
            await api.post('/task', {
                macaddress,
                done,
                type,
                title,
                description,
                when: `${date}T${hour}:00.000`
            }).then(() => {
                setRedirect(true);
            })
                .catch(error => {
                    return alert(error.response.data.error)
                })
        }
    }

    async function Remove() {
        const res = window.confirm('Deseja realmente remover a tarefa?');
        if (res === true) {
            await api.delete(`/task/${match.params.id}`)
                .then(() => {
                    setRedirect(true);
                })
        }
    }

    async function LoadTaskDetails(signal) {
        await api.get(`/task/${match.params.id}`, { signal: signal })
            .then((response) => {
                setType(parseInt(response.data.type));
                setDone(response.data.done);
                setTitle(response.data.title);
                setDescription(response.data.description);
                setDate(format(new Date(response.data.when), 'yyyy-MM-dd'));
                setHour(format(new Date(response.data.when), 'HH:mm'));
            })
    }

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        if (match.params.id)
            LoadTaskDetails(signal);

        return function cleanup() {
            abortController.abort();
        }
    }, [])

    return (
        <S.Container>
            { redirect && <Redirect to="/" />}
            <Header />
            <S.Form>
                <S.TypeIcons>
                    {
                        TypeIcons.map((icon, index) => (
                            index > 0 &&
                            <button type="button" key={index} onClick={() => setType(index)}>
                                <img src={icon} alt="Tipo da tarefa"
                                    className={type && type !== index && 'inative'} />
                            </button>
                        ))
                    }
                </S.TypeIcons>

                <S.Input>
                    <span>Título</span>
                    <input type="text" placeholder="Título da tarefa..."
                        onChange={e => setTitle(e.target.value)} value={title} />
                </S.Input>

                <S.TextArea>
                    <span>Descrição</span>
                    <textarea rows={5} placeholder="Detalhes da tarefa..."
                        onChange={e => setDescription(e.target.value)} value={description} />
                </S.TextArea>

                <S.Input>
                    <span>Data</span>
                    <input type="date" placeholder="Título da tarefa..."
                        onChange={e => setDate(e.target.value)} value={date} />
                    <img src={iconCalendar} alt="Calendário" />
                </S.Input>

                <S.Input>
                    <span>Hora</span>
                    <input type="time" placeholder="Título da tarefa..."
                        onChange={e => setHour(e.target.value)} value={hour} />
                    <img src={iconClock} alt="Relógio" />
                </S.Input>

                <S.Options>
                    <div>
                        <input type="checkbox" checked={done} onChange={() => setDone(!done)} />
                        <span>CONCLUÍDO</span>
                    </div>
                    {match.params.id && <button type="button" onClick={Remove}>EXCLUIR</button>}
                </S.Options>

                <S.Save>
                    <button type="button" onClick={Save}>SALVAR</button>
                </S.Save>

            </S.Form>
            <Footer />
        </S.Container>
    )
}

export default Task;
