import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CN from 'classnames';
import CountUp from 'react-countup';
import { useTonAddress, useTonConnectModal } from '@tonconnect/ui-react';

import {
  selectAllWorkspaces,
  selectCurrentWorkspace,
  selectTotalWsCount
} from '../../store/reducers/workspaceSlice';
import {
  getIsWorkspaceSelected,
  setIsWorkspaceSelected,
  switchWorkspace
} from '../../effects/workspaceEffects';
import {
  DEFAULT_MULTIPLIER_NAMES,
  DEFAULT_TARIFFS_NAMES
} from '../upgradeStorage';
import { useBalance } from '../../hooks/useBalance';

import GhostLoader from '../../components/ghostLoader';

// import { ReactComponent as UploadIcon } from '../../assets/upload.svg';
// import { ReactComponent as UpgradeIcon } from '../../assets/upgrade.svg';
// import { ReactComponent as GhostIcon } from '../../assets/ghost.svg';
import { ReactComponent as ArrowIcon } from '../../assets/arrow_right.svg';
import { ReactComponent as HardDriveIcon } from '../../assets/hard_drive.svg';
// import { ReactComponent as MoneyIcon } from '../../assets/money.svg';
// import { ReactComponent as RefIcon } from '../../assets/ref.svg';
import { ReactComponent as PlusIcon } from '../../assets/plusIcon.svg';
import { ReactComponent as UploadFileIcon } from '../../assets/uploadFile.svg';
import { ReactComponent as DriveIcon } from '../../assets/drive.svg';
import { ReactComponent as BoostIcon } from '../../assets/boost.svg';
import { ReactComponent as TaskIcon } from '../../assets/task.svg';
import { ReactComponent as HelpIcon } from '../../assets/help.svg';
import { ReactComponent as LeadboardIcon } from '../../assets/leadboard.svg';
import { ReactComponent as LargeTelegramIcon } from '../../assets/large_telegram.svg';
import { ReactComponent as InviteBackgroundIcon } from '../../assets/invite_background.svg';

import style from './style.module.css';

export const StartPage = ({ onClose }) => {
  const totalWsCount = useSelector(selectTotalWsCount);
  const allWorkspaces = useSelector(selectAllWorkspaces);
  const currentWorkspace = useSelector(selectCurrentWorkspace);
  const user = useSelector((state) => state?.user?.data);
  const navigate = useNavigate();
  const isWsSelected = getIsWorkspaceSelected();
  const { open } = useTonConnectModal();
  const address = useTonAddress(true);
  const link = useSelector((state) => state.user.link);

  const storage = useMemo(() => {
    const size =
      DEFAULT_TARIFFS_NAMES[user?.subscription?.subscription?.storage_size] ||
      '1GB';
    return {
      size,
      multiplier: DEFAULT_MULTIPLIER_NAMES[size]
    };
  }, []);

  const list = useMemo(() => {
    return [
      {
        Icon: UploadFileIcon,
        text: 'Upload & Reward',
        amount: '+50',
        onClick: () => {
          navigate('/file-upload');
        }
      },
      // {
      //   Icon: DriveIcon,
      //   text: 'Drive',
      //   amount: storage.size,
      //   onClick: () => {
      //     navigate('/ghostdrive-upload');
      //   }
      // },
      {
        Icon: BoostIcon,
        text: 'Multiplier',
        amount: `X${storage.multiplier}`,
        onClick: () => {
          navigate('/boost');
        }
      },
      {
        Icon: TaskIcon,
        text: 'Tasks',
        amount: '5',
        onClick: () => {
          navigate('/task');
        }
      }
    ];
  }, [storage]);

  const handleWsSelection = async (ws) => {
    await switchWorkspace(ws.workspace.id).then(() => {
      setIsWorkspaceSelected(true);
      window.location.assign(window.location.origin);
    });
  };

  const workspaceslist = useMemo(() => {
    if (allWorkspaces) {
      return allWorkspaces.map((ws) => (
        <li className={style.options__item} key={ws.workspace.id}>
          <button
            onClick={() => {
              handleWsSelection(ws);
            }}
            className={`${style.options__item__button} ${style.workspaceOptionButton}`}>
            <HardDriveIcon /> {ws.workspace.name}{' '}
            <ArrowIcon className={style.arrowIcon} />
          </button>
        </li>
      ));
    }
  }, [allWorkspaces]);

  if (!allWorkspaces && !currentWorkspace) {
    return (
      <div className={style.home_container}>
        <GhostLoader startup />
      </div>
    );
  }

  const onInvite = () => {
    window.open(link.send);
  };

  return (
    <div className={`${style.container} ${style.uploadContainer}`}>
      <header onClick={open} className={style.header_new}>
        {address.length ? (
          <p className={style.address}>
            {address.slice(0, 3) + '...' + address.slice(-6)}
          </p>
        ) : (
          <>
            <PlusIcon />
            <h2 className={style.header__title_new}>Wallet</h2>
          </>
        )}
      </header>
      <section className={style.wrapper}>
        <div className={style.wallet_balance}>
          <p className={style.wallet}>
            <CountUp delay={1} end={user?.points} />
          </p>
        </div>
        <span className={style.balance}>Balance</span>
      </section>
      <div className={style.list}>
        {list.map((el) => (
          <div key={el.text} className={style.list_element}>
            <button onClick={el?.onClick} className={style.list_element_button}>
              <el.Icon />
              <p className={style.list_element_text}>{el.text}</p>
              <span
                className={CN(
                  style.list_element_text,
                  style.list_element_amount
                )}>
                {el.amount}
              </span>
            </button>
          </div>
        ))}
      </div>
      <button onClick={onInvite} className={style.invite_button}>
        <InviteBackgroundIcon className={style.invite_background} />
        <div className={style.invite_block}>
          <div className={style.invite_left}>
            <h3 className={CN(style.invite_link, style.invite_get)}>
              Invite & Get
            </h3>
            <h2 className={CN(style.invite_link, style.invite_amount)}>
              1,000
            </h2>
            <h4 className={CN(style.invite_link, style.invite_points)}>
              points
            </h4>
          </div>
          <div className={style.invite_right}>
            <LargeTelegramIcon />
            <span className={style.invite_link}>{link?.label}</span>
          </div>
        </div>
      </button>

      <footer className={style.footer}>
        <div className={style.footer_item}>
          <HelpIcon />
          <span className={style.footer_item_text}>Rules</span>
        </div>
        <div
          className={style.footer_item}
          onClick={() => {
            navigate('/leadboard');
          }}>
          <LeadboardIcon />
          <span className={style.footer_item_text}>Leadboard</span>
        </div>
      </footer>
    </div>
  );
};
