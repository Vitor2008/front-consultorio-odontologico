import { useState } from 'react'
import './Login.css'
import banner_login from '../../assets/Img/banner-login.png'
import FormLogin from '../FormLogin/FormLogin'
import logo from '../../assets/Img/logo.png'

const Login = () => {

    const [tipoForm, setTipoForm] = useState<'login' | 'register'>('login');

    return (
        <div className="login">

            <div className='banner-login'>
                <div className='flex'>
                    <img src={logo} width={70} alt='logo' />
                    <div className='text'>
                        <h1>Clínica OdontoVida</h1>
                        <p>Cuidando do seu sorriso com excelência e dedicação</p>
                    </div>
                </div>
                <img src={banner_login} width={550} alt='banner-login' />
            </div>

            <div className='form-login'>

                <FormLogin tipo={tipoForm} onTrocarTipo={() => setTipoForm(tipoForm === 'login' ? 'register' : 'login')} />

            </div>

        </div>
    )
}

export default Login
