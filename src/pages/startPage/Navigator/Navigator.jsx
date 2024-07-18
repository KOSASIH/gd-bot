import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CN from 'classnames';

import NavigatItem from './NavigatItem';
import { WalletConnect } from '../WalletConnect';
import { ReactComponent as WalletIcon } from '../assets/wallet.svg';
import { ReactComponent as DriveIcon } from '../assets/drive.svg';
import { ReactComponent as TapIcon } from '../assets/tap.svg';
import { ReactComponent as RewardsIcon } from '../assets/rewards.svg';
import { ReactComponent as BoostIcon } from '../assets/boost.svg';
// import { ReactComponent as LanguageIcon } from '../assets/language.svg';

import styles from './Navigator.module.css';

export default function Navigator({
  storage,
  human,
  tasks,
  openDisconnectModal
}) {
  const { t } = useTranslation('system');
  const navigate = useNavigate();
  const ref = useRef(null);

  const handleWalletClick = useCallback(() => {
    ref.current.handleClick()
  }, [])

  const NAVIGATION = useMemo(() => {
    const list = [
      {
        id: 1,
        name: t('dashboard.wallet'),
        icon: <WalletIcon />,
        html: (<WalletConnect openDisconnectModal={openDisconnectModal} ref={ref} />),
        onClick: handleWalletClick
      },
      {
        id: 2,
        name: t('dashboard.drive'),
        icon: <DriveIcon />,
        html: (<span className={CN(styles.actionBtn, styles.addBt)}>{human.percent.label}</span>),
        onClick: () => navigate('/file-upload')
      },
      {
        id: 3,
        name: t('dashboard.tap'),
        icon: <TapIcon />,
        html: (<span className={CN(styles.actionBtn, styles.playBtn)}>{t('dashboard.play')}</span>),
        onClick: () => navigate('/game-3d')
      },
      {
        id: 4,
        name: t('dashboard.rewards'),
        icon: <RewardsIcon />,
        html: (<span className={styles.actionBtn}>{tasks?.length || 0}</span>),
        onClick: () => navigate('/task')
      },
      {
        id: 5,
        name: t('dashboard.boost'),
        icon: <BoostIcon />,
        html: (<span className={styles.actionBtn}>{`X${storage.multiplier}`}</span>),
        onClick: () => navigate('/boost')
      },
      {
        id: 6,
        name: t('dashboard.conver'),
        icon: <ConvertIcon />,
        html: (<span className={styles.actionBtn}>{t('dashboard.go')}</span>),
        onClick: () => navigate('/balance')
      },
      // {
      //   id: 6,
      //   name: 'Nodes',
      //   icon: <NodeIcon />,
      //   html: (<span className={styles.actionBtn}>{userNodes}</span>),
      //   onClick: () => navigate('/nodes-welcome')
      // }
      // {
      //   id: 7,
      //   name: 'Language',
      //   icon: <LanguageIcon />,
      //   html: (<span className={styles.actionBtn}>Eng</span>),
      //   onClick: () => {}
      // },
    ]

    if (!isDev) {
      return list.filter((item) => !(HIDDEN_OPTION.includes(item.name)));
    }

    return list
  }, [storage, tasks, human, handleWalletClick, openDisconnectModal, navigate, isDev])

  return (
    <ul className={CN(styles['navigator'], styles['to-appear'])}>
      {NAVIGATION.map(({ id, name, icon, html, onClick }) => (
        <NavigatItem
          key={id}
          name={name}
          icon={icon}
          html={html}
          onClick={onClick}
        />
      ))}
    </ul>
  );
}
