import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

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

import style from './style.module.css';
import CN from 'classnames';
import { useTonAddress, useTonConnectModal } from '@tonconnect/ui-react';

export const StartPage = ({ onClose }) => {
  const totalWsCount = useSelector(selectTotalWsCount);
  const allWorkspaces = useSelector(selectAllWorkspaces);
  const currentWorkspace = useSelector(selectCurrentWorkspace);
  const navigate = useNavigate();
  const isWsSelected = getIsWorkspaceSelected();
  const { open } = useTonConnectModal();
  const address = useTonAddress(true);
  console.log({ address });

  const list = useMemo(() => {
    return [
      {
        Icon: UploadFileIcon,
        text: 'Upload File',
        amount: '+50',
        onClick: () => {
          navigate('/file-upload');
        }
      },
      {
        Icon: DriveIcon,
        text: 'Drive',
        amount: '1GB',
        onClick: () => {
          navigate('/ghostdrive-upload');
        }
      },
      {
        Icon: BoostIcon,
        text: 'Boost',
        amount: 'X1',
        onClick: () => {
          navigate('/balance');
        }
      },
      {
        Icon: TaskIcon,
        text: 'Task',
        amount: '5',
        onClick: () => {
          navigate('/ref');
        }
      }
    ];
  }, []);

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
        <GhostLoader />
      </div>
    );
  }

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
          <p className={style.wallet}>100500</p>
        </div>
        <span className={style.balance}>Balance</span>
      </section>
      <div className={style.list}>
        {list.map((el) => (
          <div className={style.list_element}>
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
      <footer className={style.footer}>
        <div className={style.footer_item}>
          <HelpIcon />
          <span className={style.footer_item_text}>Rules</span>
        </div>
        <div className={style.footer_item}>
          <LeadboardIcon />
          <span className={style.footer_item_text}>Leadboard</span>
        </div>
      </footer>
    </div>
  );
};
