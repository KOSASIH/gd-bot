import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  useEffect
} from 'react';
import { Sheet } from 'react-modal-sheet';
import { useTranslation } from 'react-i18next';
import {
  getLastPlayedFreeSpin,
  getPendingSpins
} from '../../effects/fortuneWheelEffect';
import { ReactComponent as CloseIcon } from '../../assets/close.svg';
import useButtonVibration from '../../hooks/useButtonVibration';
import FortuneWheel from './FortuneWheel/FortuneWheel';
import FortuneTimer from './FortuneTimer/FortuneTimer';
import Loader2 from '../Loader2/Loader2';
import SystemModal from '../SystemModal/SystemModal';
import styles from './FortuneWheelModal.module.scss';

const FortuneWheelModal = forwardRef((_, ref) => {
  const modalRef = useRef(null);
  const systemModalRef = useRef(null);
  const { t } = useTranslation('system');
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true); // 'free', pendingGame, false
  const [freeSpinTimestamp, setFreeSpinTimestamp] = useState(null);
  const [lastPlayedFreeSpin, setLastPlayedFreeSpin] = useState(null);
  const [pendingSpins, setPendingSpins] = useState([]);
  const handleVibrationClick = useButtonVibration();

  useEffect(() => {
    if (isOpen) {
      getInitialData();
    }
  }, [isOpen]);

  useEffect(() => {
    checkAvailable();
  }, [freeSpinTimestamp, lastPlayedFreeSpin]);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const getInitialData = async () => {
    try {
      setIsInitialized(false);
      const [lastPlayedFreeSpinRes, pendingSpinsRes] = await Promise.all([
        getLastPlayedFreeSpin(),
        getPendingSpins()
      ]);
      console.log({ lastPlayedFreeSpinRes });
      console.log({ pendingSpinsRes });
      setLastPlayedFreeSpin(lastPlayedFreeSpinRes);
      setPendingSpins(pendingSpinsRes);
      setIsInitialized(true);
    } catch (error) {
      systemModalRef.current.open({
        title: t('message.error'),
        text: error.response?.data?.errors || t('message.serverError'),
        actions: [
          {
            type: 'default',
            text: t('message.ok'),
            onClick: () => {
              systemModalRef.current.close();
            }
          }
        ]
      });
    }
  };

  const checkAvailable = () => {
    let spinIsAvailable = false;

    if (lastPlayedFreeSpin && lastPlayedFreeSpin.expired_at) {
      const expiredAt = new Date(lastPlayedFreeSpin.expired_at).getTime();
      const currentTimestamp = Date.now();

      if (expiredAt > currentTimestamp) {
        setFreeSpinTimestamp(expiredAt);
      } else {
        spinIsAvailable = 'free';
      }
    }

    if (pendingSpins) {
      setPendingSpins(pendingSpins || []);
      if (pendingSpins.length) {
        spinIsAvailable = pendingSpins[0];
      }
    }

    setIsAvailable(spinIsAvailable);
  };

  const onFortuneWheelSpinned = () => {
    getInitialData();
  };

  const onTimerCompleted = () => {
    getInitialData();
  };

  useImperativeHandle(ref, () => ({
    open: open
  }));

  return (
    <>
      <Sheet
        ref={modalRef}
        isOpen={isOpen}
        onClose={close}
        detent="content-height">
        <Sheet.Container className="react-modal-sheet-container">
          <Sheet.Header className="react-modal-sheet-header" />
          <Sheet.Content>
            <Sheet.Scroller>
              <div className={styles.container}>
                <div className={styles.header}>
                  <h2>
                    {isInitialized && isAvailable && 'Earn GhostDrive Points'}
                  </h2>

                  <div
                    className={styles.close}
                    onClick={handleVibrationClick(close)}>
                    <CloseIcon />
                  </div>
                </div>

                {isInitialized && isAvailable && (
                  <strong className={styles.description}>Free Spin</strong>
                )}

                <div className={styles.content}>
                  {!isInitialized && (
                    <div className={styles['loader-container']}>
                      <Loader2 />
                    </div>
                  )}

                  {isInitialized && isAvailable !== false && (
                    <FortuneWheel onSpinned={onFortuneWheelSpinned} />
                  )}

                  {isInitialized &&
                    freeSpinTimestamp &&
                    isAvailable === false && (
                      <FortuneTimer
                        timestamp={freeSpinTimestamp}
                        onComplete={onTimerCompleted}
                      />
                    )}
                </div>
              </div>
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>

      <SystemModal ref={systemModalRef} />
    </>
  );
});

export default FortuneWheelModal;
