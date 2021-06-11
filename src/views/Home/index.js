import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as S from './styles';

import api from '../../services/api';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FilterCard from '../../components/FilterCard';
import TaskCard from '../../components/TaskCard';

function Home() {
    const [filterActived, setFilterActived] = useState('all');
    const [tasks, setTasks] = useState(null);
    const macaddress = localStorage.getItem('@todo/macaddress');

    function Notification() {
        setFilterActived('late');
    }

    async function loadTasks(signal) {
        await api.get(`/task/filter/${filterActived}/${macaddress}`, { signal: signal })
            .then(response => {
                setTasks(response.data);
            })
    }

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        loadTasks(signal);

        return function cleanup() {
            abortController.abort();
        }
    }, [filterActived])

    return (
        <S.Container>
            <Header clickNotification={Notification} />
            <S.FilterArea>
                <button type="button" onClick={() => setFilterActived("all")}>
                    <FilterCard title="Todos" actived={filterActived === 'all'} />
                </button>
                <button type="button" onClick={() => setFilterActived("today")}>
                    <FilterCard title="Hoje" actived={filterActived === 'today'} />
                </button>
                <button type="button" onClick={() => setFilterActived("week")}>
                    <FilterCard title="Semana" actived={filterActived === 'week'} />
                </button>
                <button type="button" onClick={() => setFilterActived("month")}>
                    <FilterCard title="Mês" actived={filterActived === 'month'} />
                </button>
                <button type="button" onClick={() => setFilterActived("year")}>
                    <FilterCard title="Ano" actived={filterActived === 'year'} />
                </button>
            </S.FilterArea>

            <S.Title>
                <h3>{filterActived === 'late' ? 'TAREFAS ATRASADAS' : 'TAREFAS'}</h3>
            </S.Title>

            <S.Content>
                {
                    tasks ? tasks.map((task, index) => (
                        <Link to={`/task/${task._id}`} key={index}>
                            <TaskCard type={task.type} title={task.title} when={task.when} done={task.done} />
                        </Link>
                    ))
                        : null
                }
            </S.Content>
            <Footer />
        </S.Container>
    )
}

export default Home;
