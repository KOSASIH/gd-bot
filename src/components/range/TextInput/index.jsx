import { useRef, useState } from 'react';

import { storageConvertEffect } from '../../../effects/storageEffects';
import { fomatNumber, getNumbers } from '../../../utils/string';
import { MAX_POINT_COUNT } from '../../../pages/balance';
import { useClickOutside } from '../../../utils/useClickOutside';

import styles from './styles.module.css';

export const TextInput = ({ pointCount, setPointCount, pointBalance }) => {
  const textInputRef = useRef(null);
  const [show, setShow] = useState(false);

  const onShow = () => {
    setShow(true);
  }

  const handleClickOutside = () => {
    setShow(false);
  };

  useClickOutside(textInputRef, handleClickOutside);
  
  const onPointCountChange = ({ target: { value } }) => {
    if (!value) {
      setPointCount('');
    }

    const nextValue = Number(getNumbers(value));
    if (nextValue > pointBalance || MAX_POINT_COUNT < nextValue)
      return ;

    setPointCount(fomatNumber(nextValue));
  }

  const onFocus = () => {
    if (pointCount === 0 || pointCount === '0') {
      setPointCount('')
    }
  }

  return (
    <div
      className={styles.left}
      onClick={onShow}
    >
      {show ?
        <input
          ref={textInputRef}
          onFocus={onFocus}
          className={styles.input}
          onChange={onPointCountChange}
          value={pointCount}
          type='text'
        /> :
        <p className={styles.count}>{pointCount || 0}</p>
      }
      <span className={styles.text}>Enter points</span>
    </div>
  );
};
