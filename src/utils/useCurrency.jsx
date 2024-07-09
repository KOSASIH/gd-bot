import { useEffect, useState } from 'react';

const COINGECKO_PRICE_API = 'https://api.coingecko.com/api/v3/simple/price?ids=se&vs_currencies=usd'

/** Use key for updating animation. If tour text was changed - update key */
function useCurrency(
  text,
  typingSpeed = 150,
  key = 0
) {
  const [typedText, setTypedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setTypedText('');
    setIndex(0);
  }, [text, key]);

  useEffect(() => {
    if (index < text.length) {
      const timeoutId = setTimeout(() => {
        setTypedText((prev) => prev + text.charAt(index));
        setIndex((prevIndex) => prevIndex + 1);
      }, typingSpeed);

      return () => clearTimeout(timeoutId);
    }
  }, [index, text, typingSpeed]);

  return typedText;
}

export default useCurrency;
