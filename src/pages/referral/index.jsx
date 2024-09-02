import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';

import { referralEffect } from '../../effects/referralEffect';
import { getBalanceEffect } from '../../effects/balanceEffect';
import { Header } from '../../components/header';
import { Tab } from '../../components/tab';
import { History } from '../../components/history';
import Menu from '../../components/Menu/Menu';
import styles from './styles.module.css';

export const Referral = () => {
  const { t } = useTranslation('game');
  const [users, setUsers] = useState(0);
  const [areUsersLoading, setUsersLoading] = useState(true);
  const [points, setPoints] = useState(0);
  const [arePointsLoading, setPointsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setUsersLoading(false);
        const { data } = await referralEffect();
        setUsers(data?.data?.current_usage || 0);
        console.log({ referralEffect: data });
        setUsersLoading(false);
      } catch (error) {
        console.log({ referralEffectErr: error });
      }
    })();

    (async () => {
      try {
        setPointsLoading(true);
        const { data } = await getBalanceEffect({ page: 1 });
        setPoints(data?.points || 0);
        console.log({ getBalanceEffect: data });
        setPointsLoading(false);
      } catch (error) {
        console.log({ getBalanceEffectErr: error });
      }
    })();
  }, []);

  useEffect(() => {
    /** Animation */
    gsap.fromTo(
      `[data-animation="tab-animation-1"]`,
      {
        opacity: 0,
        y: -100,
        scale: 0
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.1,
        duration: 0.5,
        delay: 0,
        ease: 'back.out(0.2)'
      }
    );

    gsap.fromTo(
      `[data-animation="history-animation-1"]`,
      {
        opacity: 0,
        x: 20,
        scale: 0.7
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.5,
        delay: 0.25,
        ease: 'back.out(0.2)'
      }
    );

    gsap.fromTo(
      `[data-animation="no-history-animation-1"]`,
      {
        opacity: 0,
        y: 20,
        scale: 1
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        delay: 0.15,
        ease: 'power1.out'
      }
    );
  }, []);

  return (
    <div className={styles.container}>
      <Header
        hideBack
        label={t('airdrop.airdrop')}
        headerClassName={styles.header}
      />

      <div className={styles.tabs}>
        <Tab
          active={true}
          tab={{
            number: users,
            name: t('airdrop.users')
          }}
          isLoading={areUsersLoading}
          onClick={() => {}}
        />

        <Tab
          active={false}
          tab={{
            number: points,
            name: t('airdrop.earn')
          }}
          isLoading={arePointsLoading}
          onClick={() => {}}
        />
      </div>

      <History />

      <Menu />
    </div>
  );
};
