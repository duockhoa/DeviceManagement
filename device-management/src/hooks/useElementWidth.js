import { useState, useEffect, useRef } from 'react';

export const useElementWidth = (ref) => {
    const [width, setWidth] = useState(0);
    const observer = useRef(null);

    useEffect(() => {
        if (!ref.current) return;

        observer.current = new ResizeObserver((entries) => {
            if (entries[0]) {
                setWidth(entries[0].contentRect.width);
            }
        });

        observer.current.observe(ref.current);

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [ref]);

    return width;
};
