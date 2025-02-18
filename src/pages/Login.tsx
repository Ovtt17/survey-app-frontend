import { useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useAuthContext } from '../context/AuthContext';
import AppIcon from '../assets/app_icon.svg';
import LoginForm from '../components/sign-in/LoginForm';
import OrSeparator from '../components/sign-in/OrSeparator';
import SocialLoginButtons from '../components/sign-in/SocialLoginButtons';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import SuccessCheck from '../assets/lottie/SuccessCheck.lottie';
import LoadingIndicator from '../components/loadings/LoadingIndicator';
import { signInWithGoogle, signInWithFacebook } from '../services/socialAuthService';

const Login = () => {
  const navigate = useNavigate();
  const { login: setAuth, user } = useAuthContext();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const usernameOrEmail = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const authReponse = await login(usernameOrEmail, password);
      setAuth(authReponse);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2500);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
      if (passwordRef.current) {
        passwordRef.current.value = '';
        passwordRef.current.focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = () => setErrorMessage('');

  return (
    <section className="flex min-h-screen flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className={`w-full flex justify-center max-w-lg p-6 sm:p-8 bg-white rounded-md shadow-md transition-opacity duration-300 ${isLoading || isSuccess ? 'opacity-10' : ''}`}>
        <article className="flex flex-col gap-4 w-full max-w-sm">
          <img src={AppIcon} alt="App Icon" className="w-12 h-12" />
          <h2 className="text-start text-3xl font-bold leading-9 tracking-tight text-gray-900">
            Iniciar Sesión
          </h2>
          <LoginForm
            handleSubmit={handleSubmit}
            passwordRef={passwordRef}
            errorMessage={errorMessage}
            handlePasswordChange={handlePasswordChange}
            isLoading={isLoading}
          />
          <OrSeparator />
          <SocialLoginButtons
            onGoogleLogin={signInWithGoogle}
            onFacebookLogin={signInWithFacebook}
          />
        </article>
      </div>
      {(isLoading || isSuccess) && (
        <div className="fixed inset-0 bg-white bg-opacity-10 flex items-center justify-center z-50">
          {isLoading && (
            <LoadingIndicator />
          )}
          {isSuccess && (
            <div className='flex flex-col items-center'>
              <DotLottieReact
                src={SuccessCheck}
                loop
                autoplay
                className='w-[300px] sm:w-[500px] h-[300px] sm:h-[500px]'
              />
              <p className="text-3xl text-center">¡Bienvenido {user?.fullName}!</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Login;