// src/utils/useWarnOnUnload.js
import { useEffect } from 'react';

const AccidentalProgressLoss = (shouldWarn) => {
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (!shouldWarn) return;
            e.preventDefault();
            e.returnValue = ''; // For Google Chrome
        };

        if (shouldWarn) {
            window.addEventListener('beforeunload', handleBeforeUnload);
        }

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [shouldWarn]);
};

export default AccidentalProgressLoss;
