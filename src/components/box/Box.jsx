import S from './Box.module.css';

const Box = ({ children, className, style }) => {
    return (
        <div className={`${className} ${S.boxContainer}`} style={style}>
            {children}
        </div>
    );
};

export default Box;