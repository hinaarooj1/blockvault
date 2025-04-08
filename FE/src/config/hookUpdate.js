import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useApplyBodyStyles = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/') {
            // Apply styles for the homepage
            document.body.style.fontFamily = 'var(--tg-body-font-family)';
            document.body.style.fontSize = 'var(--tg-body-font-size)';
            document.body.style.backgroundColor = 'var(--tg-black)';
            document.body.style.margin = '0';
            document.body.style.fontWeight = 'var(--bs-body-font-weight)';
            document.body.style.lineHeight = 'var(--bs-body-line-height)';
            document.body.style.color = 'var(--bs-body-color)';
            document.body.style.textAlign = 'var(--bs-body-text-align)';
            document.body.style.webkitTextSizeAdjust = '100%';
            document.body.style.webkitTapHighlightColor = 'transparent';
            document.body.style.msWordWrap = 'break-word';
            document.body.style.wordWrap = 'break-word';
            document.body.style.overflowX = 'hidden';
        } else {
            // Clear the styles for non-home pages
            document.body.style = '';
        }
    }, [location]);
};

export default useApplyBodyStyles;
