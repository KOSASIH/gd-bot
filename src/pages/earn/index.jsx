import React, { useState, useEffect, useRef } from 'react';

import { getBalanceEffect } from '../../effects/balanceEffect';
import { tasks as tasksFromFile } from './tasks';

import { Header } from '../../components/header';
import Menu from '../../components/Menu/Menu';
import Task from '../../components/Task/Task';
import EarnModal from './EarnModal/EarnModal';

import styles from './styles.module.css';

export default function EarnPage() {
  const [tasks, setTasks] = useState([]);
  const [animatedTaskIds, setAnimatedTaskIds] = useState(new Set());
  const modalRef = useRef(null);
  const [modalSelectedTask, setModalSelectedTask] = useState(null);

  const getTasks = async () => {
    try {
      const {
        data: { data: userTasks }
      } = await getBalanceEffect();
      const isTgCommunityTaskDone = userTasks.find(
        (task) =>
          task.point.id === 18 || task.point.action === 'JOIN_TG_NEWS_CHANNEL'
      );
      const updatedTasks = tasksFromFile.map((task) =>
        task.id === 'joinTG' && isTgCommunityTaskDone
          ? { ...task, isDone: true }
          : task
      );
      setTasks(updatedTasks);
    } catch {
      setTasks(tasksFromFile);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    const notAnimatedTasks = tasks.filter((el) => !animatedTaskIds.has(el.id));

    notAnimatedTasks.forEach((task, index) => {
      setTimeout(() => {
        setAnimatedTaskIds((prevIds) => new Set(prevIds).add(task.id));
      }, index * 100);
    });
  }, [tasks]);

  const handleClick = (task) => {
    switch (task.id) {
      case 'youtube':
      case 'joinTG':
      case 'followX':
      case 'downloadMobileApp':
        setModalSelectedTask(task);
        setTimeout(() => {
          modalRef.current.open();
        }, 10);

        break;

      default:
        console.log(task);
        break;
    }
  };

  return (
    <div className={styles.container}>
      <Header label={'Earn'} />

      <div className={styles['title-block']}>
        <img src="/assets/token.png" alt="Token" />
        <h1>Earn more points</h1>
      </div>

      <div className={styles['tasks-list']}>
        {tasks.map((task) => {
          if (animatedTaskIds.has(task.id)) {
            return (
              <Task
                key={task.id}
                onClick={() => handleClick(task)}
                isDone={task.isDone}
                title={task.title}
                points={task.points}
                imgUrl={task.imgUrl}
              />
            );
          } else {
            return null;
          }
        })}
      </div>

      <Menu />

      <EarnModal ref={modalRef} item={modalSelectedTask} />
    </div>
  );
}
