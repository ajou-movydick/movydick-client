import S from './Header.module.css';

const Header = () => {
    return (
        <header className={S.headerContainer}>
            <img src={'/images/logo.svg'} alt={'movidick-logo'} />
        </header>
    );
};

export default Header;