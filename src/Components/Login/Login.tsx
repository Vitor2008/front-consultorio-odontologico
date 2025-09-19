import './Login.css'
import banner_login from '../../assets/Img/banner-login.png'

const Login = () => {
    return (
        <div className="login">

            <div className='banner-login'>
                <h1>Consultório Odontológico</h1>
                <img src={banner_login} width={600} alt='banner-login' />
            </div>

            <div className='form-login'>
                <form className="form">
                    <p className="title">Register </p>
                    <p className="message">Signup now and get full access to our app. </p>
                    <div className="flex">
                        <label>
                            <input placeholder="" type="text" className="input" required />
                            <span>Firstname</span>
                        </label>

                        <label>
                            <input placeholder="" type="text" className="input" required />
                            <span>Lastname</span>
                        </label>
                    </div>

                    <label>
                        <input placeholder="" type="email" className="input" required />
                        <span>Email</span>
                    </label>

                    <label>
                        <input placeholder="" type="password" className="input" required />
                        <span>Password</span>
                    </label>
                    <label>
                        <input placeholder="" type="password" className="input" required />
                        <span>Confirm password</span>
                    </label>
                    <button className="submit">Submit</button>
                    <p className="signin">Already have an acount ? <a href="#">Signin</a> </p>
                </form>
            </div>

        </div>
    )
}

export default Login
