import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import styles from './YetiLogin.module.css';

interface YetiLoginProps {
  mode?: 'login' | 'signup';
  onLogin?: (email: string, password: string) => void;
  onSignup?: (username: string, email: string, password: string) => void;
  onGoogleLogin?: () => void;
  loading?: boolean;
  error?: string;
  t?: any; // Para internacionalización
}

const mouthVariants = {
  small: { scale: 1, y: 0, pathLength: 0.1, d: 'M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z' },
  medium: { scale: 1.1, y: 2, pathLength: 0.5, d: 'M95,104.2c-4.5,0-8.2-3.7-8.2-8.2v-2c0-1.2,1-2.2,2.2-2.2h22c1.2,0,2.2,1,2.2,2.2v2 c0,4.5-3.7,8.2-8.2,8.2H95z' },
  large: { scale: 1.2, y: 4, pathLength: 1, d: 'M100 110.2c-9 0-16.2-7.3-16.2-16.2 0-2.3 1.9-4.2 4.2-4.2h24c2.3 0 4.2 1.9 4.2 4.2 0 9-7.2 16.2-16.2 16.2z' }
};

const YetiLogin: React.FC<YetiLoginProps> = ({
  mode = 'login',
  onLogin,
  onSignup,
  onGoogleLogin,
  loading = false,
  error = '',
  t = {
    email: 'Email',
    password: 'Password',
    username: 'Username',
    login: 'Log in',
    signup: 'Sign up',
    google: 'Log in with Google',
    googleSignup: 'Sign up with Google',
    haveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    switchToLogin: 'Log in',
    switchToSignup: 'Sign up',
    helperEmail: 'email@domain.com',
  },
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mouth, setMouth] = useState<'small' | 'medium' | 'large'>('small');
  const [localError, setLocalError] = useState('');
  const [formMode, setFormMode] = useState<'login' | 'signup'>(mode);

  // Refs para los elementos SVG
  const svgRef = useRef<SVGSVGElement>(null);
  const armLRef = useRef<SVGGElement>(null);
  const armRRef = useRef<SVGGElement>(null);
  const eyeLRef = useRef<SVGCircleElement>(null);
  const eyeRRef = useRef<SVGCircleElement>(null);
  const noseRef = useRef<SVGPathElement>(null);
  const eyebrowRef = useRef<SVGGElement>(null);
  const outerEarLRef = useRef<SVGGElement>(null);
  const outerEarRRef = useRef<SVGGElement>(null);
  const earHairLRef = useRef<SVGGElement>(null);
  const earHairRRef = useRef<SVGGElement>(null);
  const hairRef = useRef<SVGPathElement>(null);
  const bodyBGRef = useRef<SVGPathElement>(null);
  const bodyBGchangedRef = useRef<SVGPathElement>(null);
  const twoFingersRef = useRef<SVGGElement>(null);

  const mouthControls = useAnimation();

  // Animación: brazos cubren ojos al enfocar password
  useEffect(() => {
    const input = document.getElementById('loginPassword');
    if (!input || !armLRef.current || !armRRef.current) return;

    const handleFocus = () => {
      // Esta manipulación directa del DOM funciona, pero idealmente se refactorizaría con framer-motion
      armLRef.current?.setAttribute('transform', 'rotate(-35 60 100) translate(-10 -30)');
      armRRef.current?.setAttribute('transform', 'rotate(35 140 100) translate(10 -30)');
    };
    const handleBlur = () => {
      // Esta manipulación directa del DOM funciona, pero idealmente se refactorizaría con framer-motion
      armLRef.current?.setAttribute('transform', 'rotate(0 60 100)');
      armRRef.current?.setAttribute('transform', 'rotate(0 140 100)');
    };

    input.addEventListener('focus', handleFocus);
    input.addEventListener('blur', handleBlur);
    return () => {
      input.removeEventListener('focus', handleFocus);
      input.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Animación: ojos siguen el input email (refactorizado de forma básica para React)
  // Esta implementación es una simplificación. Para el seguimiento preciso del cursor/caret
  // como el original, se necesitarían cálculos más complejos y posiblemente `framer-motion`.
  useEffect(() => {
    if (!eyeLRef.current || !eyeRRef.current) return;

    const handleMouseMove = (event: MouseEvent) => {
      const emailInput = document.getElementById('loginEmail');
      if (!emailInput) return;

      const inputRect = emailInput.getBoundingClientRect();
      const inputX = inputRect.left + inputRect.width / 2;
      const inputY = inputRect.top + inputRect.height / 2;

      const eyeLOriginalX = 85.5; // Coordenadas originales de los ojos en el SVG
      const eyeLOriginalY = 78.5;
      const eyeROriginalX = 114.5;
      const eyeROriginalY = 78.5;

      const svgRect = svgRef.current?.getBoundingClientRect();
      if (!svgRect) return;

      const svgCenterX = svgRect.left + svgRect.width / 2;
      const svgCenterY = svgRect.top + svgRect.height / 2;

      // Calcular la posición del cursor en relación con el centro del SVG
      const mouseXRelativeToSVG = event.clientX - svgCenterX;
      const mouseYRelativeToSVG = event.clientY - svgCenterY;

      // Limitar el movimiento de los ojos
      const maxX = 10; // Máximo desplazamiento horizontal
      const maxY = 5;  // Máximo desplazamiento vertical

      const moveX = Math.max(-maxX, Math.min(maxX, mouseXRelativeToSVG * 0.1));
      const moveY = Math.max(-maxY, Math.min(maxY, mouseYRelativeToSVG * 0.1));

      eyeLRef.current.setAttribute('cx', (eyeLOriginalX + moveX).toString());
      eyeLRef.current.setAttribute('cy', (eyeLOriginalY + moveY).toString());
      eyeRRef.current.setAttribute('cx', (eyeROriginalX + moveX).toString());
      eyeRRef.current.setAttribute('cy', (eyeROriginalY + moveY).toString());
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [email]); // Depende del email para re-calcular, aunque el movimiento es con el mouse


  // Animación: boca del Yeti reacciona al input de email
  useEffect(() => {
    if (email.length === 0) setMouth('small');
    else if (email.includes('@')) setMouth('large');
    else setMouth('medium');
    mouthControls.start(mouthVariants[mouth]);
  }, [email, mouth, mouthControls]);

  // Parpadeo aleatorio (reimplementado de forma básica para React)
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;
    const blink = () => {
      if (eyeLRef.current && eyeRRef.current) {
        eyeLRef.current.style.transform = 'scaleY(0)';
        eyeRRef.current.style.transform = 'scaleY(0)';
        setTimeout(() => {
          eyeLRef.current.style.transform = 'scaleY(1)';
          eyeRRef.current.style.transform = 'scaleY(1)';
        }, 120);
      }
      blinkTimeout = setTimeout(blink, 3000 + Math.random() * 2000);
    };
    blinkTimeout = setTimeout(blink, 3000);
    return () => clearTimeout(blinkTimeout);
  }, []);

  // Validación simple
  function validate() {
    if (formMode === 'signup' && username.trim().length < 2) {
      setLocalError('El nombre de usuario debe tener al menos 2 caracteres.');
      return false;
    }
    if (!email.includes('@')) {
      setLocalError('Email inválido.');
      return false;
    }
    if (password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres.');
      return false;
    }
    setLocalError('');
    return true;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (formMode === 'login' && onLogin) onLogin(email, password);
    if (formMode === 'signup' && onSignup) onSignup(username, email, password);
  };

  const handleGoogleLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (onGoogleLogin) {
      await onGoogleLogin();
      // Redirige al dashboard tras login con Google
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard';
      }
    }
  };

  return (
    <div className={styles.yetiLoginWrapper}>
      {/* Modern toggle at the top */}
      <div className={styles.toggleTabs}>
        <button
          type="button"
          className={formMode === 'login' ? styles.activeTab : ''}
          onClick={() => setFormMode('login')}
          aria-selected={formMode === 'login'}
        >
          {t.login}
        </button>
        <button
          type="button"
          className={formMode === 'signup' ? styles.activeTab : ''}
          onClick={() => setFormMode('signup')}
          aria-selected={formMode === 'signup'}
        >
          {t.signup}
        </button>
      </div>
      <form className={styles.yetiForm} autoComplete="off" onSubmit={handleSubmit} aria-label={formMode === 'login' ? t.login : t.signup}>
        <div className={styles.svgContainer}>
          <div>
            <svg ref={svgRef} className={styles.mySVG} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200">
              <defs>
                <circle id="armMaskPath" cx="100" cy="100" r="100" />
              </defs>
              <clipPath id="armMask">
                <use xlinkHref="#armMaskPath" overflow="visible" />
              </clipPath>
              <circle cx="100" cy="100" r="100" fill="#a9ddf3" />
              <g className="body">
                <path ref={bodyBGchangedRef} className="bodyBGchanged" style={{ display: 'none' }} fill="#FFFFFF" d="M200,122h-35h-14.9V72c0-27.6-22.4-50-50-50s-50,22.4-50,50v50H35.8H0l0,91h200L200,122z" />
                <path ref={bodyBGRef} className="bodyBGnormal" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#FFFFFF" d="M200,158.5c0-20.2-14.8-36.5-35-36.5h-14.9V72.8c0-27.4-21.7-50.4-49.1-50.8c-28-0.5-50.9,22.1-50.9,50v50 H35.8C16,122,0,138,0,157.8L0,213h200L200,158.5z" />
                <path fill="#DDF1FA" d="M100,156.4c-22.9,0-43,11.1-54.1,27.7c15.6,10,34.2,15.9,54.1,15.9s38.5-5.8,54.1-15.9 C143,167.5,122.9,156.4,100,156.4z" />
              </g>
              <g className="earL">
                <g ref={outerEarLRef} className="outerEar" fill="#ddf1fa" stroke="#3a5e77" strokeWidth="2.5">
                  <circle cx="47" cy="83" r="11.5" />
                  <path d="M46.3 78.9c-2.3 0-4.1 1.9-4.1 4.1 0 2.3 1.9 4.1 4.1 4.1" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <g ref={earHairLRef} className="earHair">
                  <rect x="51" y="64" fill="#FFFFFF" width="15" height="35" />
                  <path d="M53.4 62.8C48.5 67.4 45 72.2 42.8 77c3.4-.1 6.8-.1 10.1.1-4 3.7-6.8 7.6-8.2 11.6 2.1 0 4.2 0 6.3.2-2.6 4.1-3.8 8.3-3.7 12.5 1.2-.7 3.4-1.4 5.2-1.9" fill="#fff" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </g>
              <g className="earR">
                <g ref={outerEarRRef} className="outerEar">
                  <circle fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" cx="153" cy="83" r="11.5" />
                  <path fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M153.7,78.9 c2.3,0,4.1,1.9,4.1,4.1c0,2.3-1.9,4.1-4.1,4.1" />
                </g>
                <g ref={earHairRRef} className="earHair">
                  <rect x="134" y="64" fill="#FFFFFF" width="15" height="35" />
                  <path fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M146.6,62.8 c4.9,4.6,8.4,9.4,10.6,14.2c-3.4-0.1-6.8-0.1-10.1,0.1c4,3.7,6.8,7.6,8.2,11.6c-2.1,0-4.2,0-6.3,0.2c2.6,4.1,3.8,8.3,3.7,12.5 c-1.2-0.7-3.4-1.4-5.2-1.9" />
                </g>
              </g>
              <path className="chin" d="M84.1 121.6c2.7 2.9 6.1 5.4 9.8 7.5l.9-4.5c2.9 2.5 6.3 4.8 10.2 6.5 0-1.9-.1-3.9-.2-5.8 3 1.2 6.2 2 9.7 2.5-.3-2.1-.7-4.1-1.2-6.1" fill="none" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path className="face" fill="#DDF1FA" d="M134.5,46v35.5c0,21.815-15.446,39.5-34.5,39.5s-34.5-17.685-34.5-39.5V46" />
              <path ref={hairRef} className="hair" fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M81.457,27.929 c1.755-4.084,5.51-8.262,11.253-11.77c0.979,2.565,1.883,5.14,2.712,7.723c3.162-4.265,8.626-8.27,16.272-11.235 c-0.737,3.293-1.588,6.573-2.554,9.837c4.857-2.116,11.049-3.64,18.428-4.156c-2.403,3.23-5.021,6.391-7.852,9.474" />
              <g ref={eyebrowRef} className="eyebrow">
                <path fill="#FFFFFF" d="M138.142,55.064c-4.93,1.259-9.874,2.118-14.787,2.599c-0.336,3.341-0.776,6.689-1.322,10.037 c-4.569-1.465-8.909-3.222-12.996-5.226c-0.98,3.075-2.07,6.137-3.267,9.179c-5.514-3.067-10.559-6.545-15.097-10.329 c-1.806,2.889-3.745,5.73-5.816,8.515c-7.916-4.124-15.053-9.114-21.296-14.738l1.107-11.768h73.475V55.064z" />
                <path fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M63.56,55.102 c6.243,5.624,13.38,10.614,21.296,14.738c2.071-2.785,4.01-5.626,5.816-8.515c4.537,3.785,9.583,7.263,15.097,10.329 c1.197-3.043,2.287-6.104,3.267-9.179c4.087,2.004,8.427,3.761,12.996,5.226c0.545-3.348,0.986-6.696,1.322-10.037 c4.913-0.481,9.857-1.34,14.787-2.599" />
              </g>
              <g className="eyeL">
                <circle ref={eyeLRef} cx="85.5" cy="78.5" r="3.5" fill="#3a5e77" />
                <circle cx="84" cy="76" r="1" fill="#fff" />
              </g>
              <g className="eyeR">
                <circle ref={eyeRRef} cx="114.5" cy="78.5" r="3.5" fill="#3a5e77" />
                <circle cx="113" cy="76" r="1" fill="#fff" />
              </g>
              <g className="mouth">
                <motion.path
                  className="mouthBG"
                  fill="#617E92"
                  d={mouthVariants[mouth].d as string}
                  animate={{ d: mouthVariants[mouth].d, scale: mouthVariants[mouth].scale, y: mouthVariants[mouth].y }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                <path style={{ display: 'none' }} className="mouthSmallBG" fill="#617E92" d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z" />
                <path style={{ display: 'none' }} className="mouthMediumBG" d="M95,104.2c-4.5,0-8.2-3.7-8.2-8.2v-2c0-1.2,1-2.2,2.2-2.2h22c1.2,0,2.2,1,2.2,2.2v2 c0,4.5-3.7,8.2-8.2,8.2H95z" />
                <path style={{ display: 'none' }} className="mouthLargeBG" d="M100 110.2c-9 0-16.2-7.3-16.2-16.2 0-2.3 1.9-4.2 4.2-4.2h24c2.3 0 4.2 1.9 4.2 4.2 0 9-7.2 16.2-16.2 16.2z" fill="#617e92" stroke="#3a5e77" strokeLinejoin="round" strokeWidth="2.5" />
                <defs>
                  <path id="mouthMaskPath" d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z" />
                </defs>
                <clipPath id="mouthMask">
                  <use xlinkHref="#mouthMaskPath" overflow="visible" />
                </clipPath>
                <g clipPath="url(#mouthMask)">
                  <g className="tongue">
                    <circle cx="100" cy="107" r="8" fill="#cc4a6c" />
                    <ellipse className="tongueHighlight" cx="100" cy="100.5" rx="3" ry="1.5" opacity=".1" fill="#fff" />
                  </g>
                </g>
                <path clipPath="url(#mouthMask)" className="tooth" style={{ fill: '#FFFFFF' }} d="M106,97h-4c-1.1,0-2-0.9-2-2v-2h8v2C108,96.1,107.1,97,106,97z" />
                <path className="mouthOutline" fill="none" stroke="#3A5E77" strokeWidth="2.5" strokeLinejoin="round" d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z" />
              </g>
              <path ref={noseRef} className="nose" d="M97.7 79.9h4.7c1.9 0 3 2.2 1.9 3.7l-2.3 3.3c-.9 1.3-2.9 1.3-3.8 0l-2.3-3.3c-1.3-1.6-.2-3.7 1.8-3.7z" fill="#3a5e77" />
              <g className="arms" clipPath="url(#armMask)">
                <g ref={armLRef} className="armL" style={{ visibility: 'hidden' }}>
                  <polygon fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" points="121.3,98.4 111,59.7 149.8,49.3 169.8,85.4" />
                  <path fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M134.4,53.5l19.3-5.2c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-10.3,2.8" />
                  <path fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M150.9,59.4l26-7c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-21.3,5.7" />

                  <g ref={twoFingersRef} className="twoFingers">
                    <path fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M158.3,67.8l23.1-6.2c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-23.1,6.2" />
                    <path fill="#A9DDF3" d="M180.1,65l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L180.1,65z" />
                  </g> {/* Close twoFingersRef g */}
                </g> {/* Close armLRef g */}
              </g> {/* Close arms g */}
            </svg>
          </div>
        </div>
        {formMode === 'signup' && (
          <div className={`${styles.inputGroup} ${styles.inputGroup0}`}>
            <label htmlFor="loginUsername" id="loginUsernameLabel">{t.username}</label>
            <input type="text" id="loginUsername" maxLength={32} value={username} onChange={e => setUsername(e.target.value)} required autoFocus={formMode === 'signup'} />
          </div>
        )}
        <div className={`${styles.inputGroup} ${styles.inputGroup1}`}>
          <label htmlFor="loginEmail" id="loginEmailLabel">{t.email}</label>
          <input type="email" id="loginEmail" maxLength={254} value={email} onChange={e => setEmail(e.target.value)} required autoFocus={formMode === 'login'} />
          <p className={`${styles.helper} ${styles.helper1}`}>{t.helperEmail}</p>
        </div>
        <div className={`${styles.inputGroup} ${styles.inputGroup2}`}>
          <label htmlFor="loginPassword" id="loginPasswordLabel">{t.password}</label>
          <input type={showPassword ? 'text' : 'password'} id="loginPassword" value={password} onChange={e => setPassword(e.target.value)} required />
          <label id="showPasswordToggle" htmlFor="showPasswordCheck">Show
            <input id="showPasswordCheck" type="checkbox" checked={showPassword} onChange={e => setShowPassword(e.target.checked)} />
            <div className={styles.indicator}></div>
          </label>
        </div>
        {(localError || error) && (
          <div className={`${styles.inputGroup} ${styles.inputGroupError}`}>
            <p className="text-red-500 text-sm">{localError || error}</p>
          </div>
        )}
        <div className={`${styles.inputGroup} ${styles.inputGroup3}`}>
          <button id="login" type="submit" disabled={loading} aria-busy={loading}>
            {formMode === 'login' ? t.login : t.signup}
          </button>
        </div>
        <div className={`${styles.inputGroup} ${styles.inputGroup4}`}>
          <button type="button" className={styles.googleBtn} onClick={handleGoogleLogin} disabled={loading}>
            <span className={styles.googleIcon}></span> {formMode === 'login' ? t.google : t.googleSignup}
          </button>
        </div>
        <div className={`${styles.inputGroup} ${styles.inputGroupSwitch}`}>
          {formMode === 'login' ? (
            <span>
              {t.dontHaveAccount}
              <button
                type="button"
                className={`${styles.switchBtn} underline`}
                onClick={() => setFormMode('signup')}
                aria-label={t.switchToSignup}
              >
                {t.switchToSignup}
              </button>
            </span>
          ) : (
            <span>
              {t.haveAccount}
              <button
                type="button"
                className={`${styles.switchBtn} underline`}
                onClick={() => setFormMode('login')}
                aria-label={t.switchToLogin}
              >
                {t.switchToLogin}
              </button>
            </span>
          )}
          {/* Extra dedicated switch button for accessibility (always visible) */}
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            {formMode === 'login' ? (
              <button type="button" className={styles.switchBtn} onClick={() => setFormMode('signup')} aria-label="Switch to sign up">
                {t.switchToSignup}
              </button>
            ) : (
              <button type="button" className={styles.switchBtn} onClick={() => setFormMode('login')} aria-label="Switch to log in">
                {t.switchToLogin}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default YetiLogin;