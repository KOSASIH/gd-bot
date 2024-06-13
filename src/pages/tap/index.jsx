import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { useTimer } from 'react-timer-hook';

import { Header } from '../../components/header_v2';
import MainButton from './MainButton/MainButton';
import ProgressBar from './ProgressBar/ProgressBar';
import Background from './Background/Background';
import styles from './styles.module.css';

export function TapPage() {
  const backgroundRef = useRef();
  const mainButtonRef = useRef();

  const [theme, setTheme] = useState('default'); // 'default' or 'gold'; Fetch from store later
  const [clickedPoints, setClickedPoints] = useState(0);

  const lockTimer = useTimer({
    expiryTimestamp: new Date(),
    onExpire: () => console.warn('onExpire called'),
    autoStart: false
  });

  const clickTimer = useTimer({
    expiryTimestamp: new Date(),
    onExpire: () => {
      console.warn('onExpire called');
      const lockTime = new Date();
      lockTime.setSeconds(lockTime.getSeconds() + 10800); // 1 minutes timer
      lockTimer.restart(lockTime);
    },
    autoStart: false
  });

  const multiplier = 5;
  const points = 4000;

  const clickHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (lockTimer.isRunning) {
      return;
    }
    mainButtonRef.current.runAnimation();
    backgroundRef.current.runAnimation();
    setClickedPoints((prevState) => prevState + 2);
    if (!clickTimer.isRunning) {
      const time = new Date();
      time.setSeconds(time.getSeconds() + 60); // 1 minutes timer
      clickTimer.restart(time);
    }
  };


  return (
    <div
      className={classNames(
        styles.container,
        theme === 'gold' ? styles.gold : styles.default
      )}>
      <Background ref={backgroundRef} theme={theme} />
      <Header />

      <div className={styles.content}>
        <div className={styles['content-inner-container']}>
          <div className={styles['balance-container']}>
            <div className={styles.balance}>{clickedPoints}</div>
            <strong>Balance</strong>
          </div>

          <div
            onClick={clickHandler}
            className={styles['main-button-container']}>
            {lockTimer.isRunning && <p className={styles.charging}>Charging</p>}
            <MainButton ref={mainButtonRef} theme={theme} />
          </div>

          <p className={styles.clickTimer}>
            {lockTimer.isRunning
              ? `${lockTimer.hours}:${lockTimer.minutes}:${lockTimer.seconds}`
              : `${clickTimer.minutes}:${clickTimer.seconds < 10 ? '0' + clickTimer.seconds : clickTimer.seconds}`}
          </p>

          <div className={styles['experience-container']}>
            <div className={styles['progress-container']}>
              <div className={styles['progress-bar']}>
                <ProgressBar percent={100} theme={theme} />
              </div>
              <span className={styles.points}>{points}</span>
              <div className={styles.logo}></div>
            </div>

            <div className={styles['multiplier']}>x{multiplier}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
