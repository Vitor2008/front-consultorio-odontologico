import './Loader.css'
import logo from '../../assets/Img/logo.png'

const Loader = () => {
    return (
        <div className="loader">
            <img src={logo} width={40} alt='logo' />
            <span></span>
        </div>
    )
}

export default Loader