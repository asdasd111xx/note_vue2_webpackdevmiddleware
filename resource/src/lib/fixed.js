// 取得瀏覽器捲軸位置
const getWindowScroll = (direction) => {
    const eleWin = document.documentElement || document.body;

    switch (direction) {
        case 'top':
            return eleWin.scrollTop;
        case 'left':
            return eleWin.scrollLeft;
        default:
            return eleWin;
    }
};

// Fixed 時，左右位移處理
export default (setFixed, element) => {
    if (!setFixed) {
        return;
    }

    const targetTop = element.offsetTop;

    window.addEventListener('scroll', () => {
        if (targetTop < getWindowScroll('top')) {
            const eleFixedBlock = element.getElementsByClassName('fixed-block')[0];

            if (!element.classList.contains('fixed')) {
                element.classList.add('fixed');
            }
            eleFixedBlock.style.left = (getWindowScroll('left') > 0) ? `-${getWindowScroll('left')}px` : `${getWindowScroll('left')}px`;
            return;
        }

        element.classList.remove('fixed');
    });
};
