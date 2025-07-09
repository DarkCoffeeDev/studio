// src/components/clemmont/YetiLogin.tsx
"use client"; // Necesario para componentes interactivos en Next.js App Router

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import styles from './YetiLogin.module.css';

interface YetiLoginProps {
  mode?: 'login' | 'signup';
  onLogin?: (email: string, password: string) => Promise<any>;
  onSignup?: (username: string, email: string, password: string) => Promise<any>;
  onGoogleLogin?: () => Promise<void>;
  loading?: boolean;
  error?: string;
  t?: any; // Para internacionalización, se espera un objeto de traducciones
}

// Variantes de animación para la boca del Yeti
const mouthVariants = {
  small: { scale: 1, y: 0, pathLength: 0.1, d: 'M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z' },
  medium: { scale: 1.1, y: 2, pathLength: 0.5, d: 'M95,104.2c-4.5,0-8.2-3.7-8.2-8.2v-2c0-1.2,1-2.2,2.2-2.2h22c1.2,0,2.2,1,2.2,2.2v2 c0,4.5-3.7,8.2-8.2,8.2H95z' },
  large: { scale: 1.2, y: 4, pathLength: 1, d: 'M100 110.2c-9 0-16.2-7.3-16.2-16.2 0-2.3 1.9-4.2 4.2-4.2h24c2.3 0 4.2 1.9 4.2 4.2 0 9-7.2 16.2-16.2 16.2z' }
};

// Variantes de animación para los brazos del Yeti (cubrir/descubrir ojos)
const armVariants = {
  hidden: { y: 220, rotate: 105, opacity: 0, transition: { duration: 0.8, ease: "easeOut" } },
  visible: { y: 10, rotate: 0, opacity: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

// Variantes para los dedos (mostrar/ocultar contraseña)
const twoFingersVariants = {
  closed: { rotate: 0, x: 0, y: 0, transition: { duration: 0.35, ease: "easeInOut" } },
  spread: { rotate: 30, x: -9, y: -2, transition: { duration: 0.35, ease: "easeInOut" } },
};

const YetiLogin: React.FC<YetiLoginProps> = ({
  mode = 'login',
  onLogin,
  onSignup,
  onGoogleLogin,
  loading = false,
  error = '',
  t = { // Traducciones por defecto si no se proporcionan
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
  const [mouthState, setMouthState] = useState<'small' | 'medium' | 'large'>('small');
  const [localError, setLocalError] = useState('');
  const [formMode, setFormMode] = useState<'login' | 'signup'>(mode);

  // Controladores de animación de Framer Motion
  const mouthControls = useAnimation();
  const armLControls = useAnimation();
  const armRControls = useAnimation();
  const twoFingersControls = useAnimation();
  const eyeLControls = useAnimation();
  const eyeRControls = useAnimation();
  const eyebrowControls = useAnimation();
  const noseControls = useAnimation();
  const chinControls = useAnimation();
  const faceControls = useAnimation();
  const hairControls = useAnimation();
  const bodyBGControls = useAnimation();
  const outerEarLControls = useAnimation(); // <--- Faltaba esta declaración
  const outerEarRControls = useAnimation(); // <--- Faltaba esta declaración
  const earHairLControls = useAnimation();  // <--- Faltaba esta declaración
  const earHairRControls = useAnimation();  // <--- Faltaba esta declaración


  // Refs para los elementos SVG
  const svgContainerRef = useRef<HTMLDivElement>(null); // Para calcular posiciones relativas
  const emailInputRef = useRef<HTMLInputElement>(null); // Para el input de email

  // Sincronizar animación de la boca con el estado del email
  useEffect(() => {
    if (email.length === 0) setMouthState('small');
    else if (email.includes('@')) setMouthState('large');
    else setMouthState('medium');
    mouthControls.start(mouthVariants[mouthState]);
  }, [email, mouthState, mouthControls]);

  // Manejar el foco del campo de contraseña para animar los brazos
  const handlePasswordFocus = useCallback(async () => {
    // Animar brazos para cubrir ojos
    await armLControls.start("visible");
    await armRControls.start("visible");
    // Animar bodyBG
    bodyBGControls.start({ pathLength: 1, transition: { duration: 0.45, ease: "easeOut" } });

  }, [armLControls, armRControls, bodyBGControls]);

  const handlePasswordBlur = useCallback(async () => {
    if (!showPassword) { // Solo si la contraseña no está visible
      // Animar brazos para descubrir ojos
      await armLControls.start("hidden");
      await armRControls.start("hidden");
      // Animar bodyBG de vuelta
      bodyBGControls.start({ pathLength: 0, transition: { duration: 0.45, ease: "easeOut" } });
    }
  }, [armLControls, armRControls, bodyBGControls, showPassword]);

  // Sincronizar animación de los dedos con el checkbox de mostrar contraseña
  useEffect(() => {
    if (showPassword) {
      twoFingersControls.start("spread");
    } else {
      twoFingersControls.start("closed");
    }
  }, [showPassword, twoFingersControls]);

  // Parpadeo aleatorio de los ojos
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;
    const blink = async () => {
      await eyeLControls.start({ scaleY: 0, transition: { duration: 0.1 } });
      await eyeRControls.start({ scaleY: 0, transition: { duration: 0.1 } });
      await eyeLControls.start({ scaleY: 1, transition: { duration: 0.1 } });
      await eyeRControls.start({ scaleY: 1, transition: { duration: 0.1 } });
      blinkTimeout = setTimeout(blink, 3000 + Math.random() * 2000);
    };
    blinkTimeout = setTimeout(blink, 3000); // Primer parpadeo después de 3 segundos
    return () => clearTimeout(blinkTimeout);
  }, [eyeLControls, eyeRControls]);

  // Animación de los ojos y la cara siguiendo el cursor/input
  useEffect(() => {
    const handleEyeAndFaceMove = (event: MouseEvent) => {
      const emailInput = emailInputRef.current;
      const svgContainer = svgContainerRef.current;

      if (!emailInput || !svgContainer) return;

      const inputRect = emailInput.getBoundingClientRect();
      const svgRect = svgContainer.getBoundingClientRect();

      // Calcular la posición del caret (aproximada, más compleja para precisión exacta)
      // Para una precisión "exacta" como el original, se necesitaría un helper para el caret
      // Aquí, usaremos la posición del ratón para simular el seguimiento
      const targetX = event.clientX;
      const targetY = event.clientY;

      // Coordenadas centrales de los ojos en el SVG (aproximadas)
      const eyeL_cX = 85.5;
      const eyeL_cY = 78.5;
      const eyeR_cX = 114.5;
      const eyeR_cY = 78.5;
      const nose_cX = 97;
      const nose_cY = 81;
      const mouth_cX = 100;
      const mouth_cY = 100;
      const chin_cX = 100;
      const chin_cY = 125; // Aproximado
      const face_cX = 100;
      const face_cY = 80; // Aproximado
      const eyebrow_cX = 100;
      const eyebrow_cY = 58; // Aproximado
      const outerEar_cX = 47; // Para el izquierdo
      const outerEar_cY = 83; // Para el izquierdo
      const hair_cX = 100;
      const hair_cY = 40; // Aproximado

      // Calcular el centro del SVG en coordenadas de la ventana
      const svgWindowCenterX = svgRect.left + svgRect.width / 2;
      const svgWindowCenterY = svgRect.top + svgRect.height / 2;

      // Calcular la diferencia entre el objetivo y el centro del SVG
      const diffX = targetX - svgWindowCenterX;
      const diffY = targetY - svgWindowCenterY;

      // Limitar el movimiento de los elementos (ajusta estos valores para controlar el rango)
      const eyeMoveLimit = 10;
      const noseMoveLimit = 15;
      const mouthMoveLimit = 15;
      const faceMoveLimit = 10;
      const eyebrowMoveLimit = 20;
      const earMoveLimit = 5;
      const hairMoveLimit = 8;

      const eyeX = Math.max(-eyeMoveLimit, Math.min(eyeMoveLimit, diffX * 0.05));
      const eyeY = Math.max(-eyeMoveLimit, Math.min(eyeMoveLimit, diffY * 0.05));

      const noseX = Math.max(-noseMoveLimit, Math.min(noseMoveLimit, diffX * 0.08));
      const noseY = Math.max(-noseMoveLimit, Math.min(noseMoveLimit, diffY * 0.08));

      const mouthX = Math.max(-mouthMoveLimit, Math.min(mouthMoveLimit, diffX * 0.08));
      const mouthY = Math.max(-mouthMoveLimit, Math.min(mouthMoveLimit, diffY * 0.08));

      const chinX = mouthX * 0.8;
      const chinY = mouthY * 0.5;
      const chinScaleY = 1 - (Math.abs(diffX) * 0.0015); // Simular el "aplastamiento"

      const faceX = Math.max(-faceMoveLimit, Math.min(faceMoveLimit, diffX * 0.03));
      const faceY = Math.max(-faceMoveLimit, Math.min(faceMoveLimit, diffY * 0.04));
      const faceSkew = diffX * 0.02;

      const eyebrowX = faceX;
      const eyebrowY = faceY;
      const eyebrowSkew = diffX * 0.05;

      const outerEarX = Math.max(-earMoveLimit, Math.min(earMoveLimit, diffX * 0.04));
      const outerEarY = Math.max(-earMoveLimit, Math.min(earMoveLimit, diffY * 0.05));

      const hairX = Math.max(-hairMoveLimit, Math.min(hairMoveLimit, diffX * 0.06));
      const hairScaleY = 1.2; // Hardcoded from original, could be dynamic

      // Animar ojos
      eyeLControls.start({ x: eyeX, y: eyeY, transition: { duration: 0.5, ease: "easeOut" } });
      eyeRControls.start({ x: eyeX, y: eyeY, transition: { duration: 0.5, ease: "easeOut" } });

      // Animar nariz
      noseControls.start({ x: noseX, y: noseY, rotate: diffX * 0.03, transition: { duration: 0.5, ease: "easeOut" } });

      // Animar boca (solo traslación y rotación, el morphing es por email)
      mouthControls.start({ x: mouthX, y: mouthY, rotate: diffX * 0.03, transition: { duration: 0.5, ease: "easeOut" } });

      // Animar barbilla
      chinControls.start({ x: chinX, y: chinY, scaleY: chinScaleY < 0.5 ? 0.5 : chinScaleY, transition: { duration: 0.5, ease: "easeOut" } });

      // Animar cara
      faceControls.start({ x: faceX, y: faceY, skewX: faceSkew, transition: { duration: 0.5, ease: "easeOut" } });

      // Animar cejas
      eyebrowControls.start({ x: eyebrowX, y: eyebrowY, skewX: eyebrowSkew, transition: { duration: 0.5, ease: "easeOut" } });

      // Animar orejas
      outerEarLControls.start({ x: outerEarX, y: -outerEarY, transition: { duration: 0.5, ease: "easeOut" } });
      outerEarRControls.start({ x: outerEarX, y: outerEarY, transition: { duration: 0.5, ease: "easeOut" } });
      earHairLControls.start({ x: -outerEarX, y: -outerEarY, transition: { duration: 0.5, ease: "easeOut" } });
      earHairRControls.start({ x: -outerEarX, y: outerEarY, transition: { duration: 0.5, ease: "easeOut" } });

      // Animar cabello
      hairControls.start({ x: hairX, scaleY: hairScaleY, transition: { duration: 0.5, ease: "easeOut" } });
    };

    window.addEventListener('mousemove', handleEyeAndFaceMove);
    return () => {
      window.removeEventListener('mousemove', handleEyeAndFaceMove);
    };
  }, [email, eyeLControls, eyeRControls, noseControls, mouthControls, chinControls, faceControls, eyebrowControls, outerEarLControls, outerEarRControls, earHairLControls, earHairRControls, hairControls]); // Dependencias de los controladores de animación


  // Función para resetear las animaciones de la cara
  const resetFaceAnimations = useCallback(() => {
    eyeLControls.start({ x: 0, y: 0, transition: { duration: 0.5, ease: "easeOut" } });
    eyeRControls.start({ x: 0, y: 0, transition: { duration: 0.5, ease: "easeOut" } });
    noseControls.start({ x: 0, y: 0, rotate: 0, transition: { duration: 0.5, ease: "easeOut" } });
    mouthControls.start({ x: 0, y: 0, rotate: 0, transition: { duration: 0.5, ease: "easeOut" } });
    chinControls.start({ x: 0, y: 0, scaleY: 1, transition: { duration: 0.5, ease: "easeOut" } });
    faceControls.start({ x: 0, y: 0, skewX: 0, transition: { duration: 0.5, ease: "easeOut" } });
    eyebrowControls.start({ x: 0, y: 0, skewX: 0, transition: { duration: 0.5, ease: "easeOut" } });
    outerEarLControls.start({ x: 0, y: 0, transition: { duration: 0.5, ease: "easeOut" } });
    outerEarRControls.start({ x: 0, y: 0, transition: { duration: 0.5, ease: "easeOut" } });
    earHairLControls.start({ x: 0, y: 0, transition: { duration: 0.5, ease: "easeOut" } });
    earHairRControls.start({ x: 0, y: 0, transition: { duration: 0.5, ease: "easeOut" } });
    hairControls.start({ x: 0, scaleY: 1, transition: { duration: 0.5, ease: "easeOut" } });
  }, [eyeLControls, eyeRControls, noseControls, mouthControls, chinControls, faceControls, eyebrowControls, outerEarLControls, outerEarRControls, earHairLControls, earHairRControls, hairControls]);


  // Validación simple
  const validate = useCallback(() => {
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
  }, [formMode, username, email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      if (formMode === 'login' && onLogin) await onLogin(email, password);
      if (formMode === 'signup' && onSignup) await onSignup(username, email, password);
    } catch (err: any) {
      setLocalError(err.message || 'Ocurrió un error. Inténtalo de nuevo.');
    }
  };

  return (
    <form className={styles.yetiForm} autoComplete="off" onSubmit={handleSubmit} aria-label={formMode === 'login' ? t.login : t.signup}>
      <div ref={svgContainerRef} className={styles.svgContainer}>
        <div>
          <svg className={styles.mySVG} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200">
            <defs>
              <circle id="armMaskPath" cx="100" cy="100" r="100" />
            </defs>
            <clipPath id="armMask">
              <use xlinkHref="#armMaskPath" overflow="visible" />
            </clipPath>
            <circle cx="100" cy="100" r="100" fill="#a9ddf3" />
            <g className="body">
              {/* bodyBGchanged y bodyBGnormal son paths, pero para animar entre ellos se necesita morphSVG,
                  que framer-motion no soporta directamente para el 'd' de paths diferentes.
                  Una alternativa es animar la opacidad entre dos paths o usar un solo path dinámico.
                  Aquí, animamos un pathLength para simular un efecto. */}
              <motion.path
                className={styles.bodyBGnormal}
                stroke="#3A5E77"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="#FFFFFF"
                d="M200,158.5c0-20.2-14.8-36.5-35-36.5h-14.9V72.8c0-27.4-21.7-50.4-49.1-50.8c-28-0.5-50.9,22.1-50.9,50v50 H35.8C16,122,0,138,0,157.8L0,213h200L200,158.5z"
                animate={bodyBGControls}
              />
              <path fill="#DDF1FA" d="M100,156.4c-22.9,0-43,11.1-54.1,27.7c15.6,10,34.2,15.9,54.1,15.9s38.5-5.8,54.1-15.9 C143,167.5,122.9,156.4,100,156.4z" />
            </g>
            <g className="earL">
              <motion.g className="outerEar" fill="#ddf1fa" stroke="#3a5e77" strokeWidth="2.5" animate={outerEarLControls}>
                <circle cx="47" cy="83" r="11.5" />
                <path d="M46.3 78.9c-2.3 0-4.1 1.9-4.1 4.1 0 2.3 1.9 4.1 4.1 4.1" strokeLinecap="round" strokeLinejoin="round" />
              </motion.g>
              <motion.g className="earHair" animate={earHairLControls}>
                <rect x="51" y="64" fill="#FFFFFF" width="15" height="35" />
                <path d="M53.4 62.8C48.5 67.4 45 72.2 42.8 77c3.4-.1 6.8-.1 10.1.1-4 3.7-6.8 7.6-8.2 11.6 2.1 0 4.2 0 6.3.2-2.6 4.1-3.8 8.3-3.7 12.5 1.2-.7 3.4-1.4 5.2-1.9" fill="#fff" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </motion.g>
            </g>
            <g className="earR">
              <motion.g className="outerEar" fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" animate={outerEarRControls}>
                <circle cx="153" cy="83" r="11.5" />
                <path fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M153.7,78.9 c2.3,0,4.1,1.9,4.1,4.1c0,2.3-1.9,4.1-4.1,4.1" />
              </motion.g>
              <motion.g className="earHair" animate={earHairRControls}>
                <rect x="134" y="64" fill="#FFFFFF" width="15" height="35" />
                <path d="M146.6 62.8C151.5 67.4 155 72.2 157.2 77c-3.4-.1-6.8-.1-10.1.1 4 3.7 6.8 7.6 8.2 11.6-2.1 0-4.2 0-6.3.2 2.6 4.1 3.8 8.3 3.7 12.5-1.2-.7-3.4-1.4-5.2-1.9" fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </motion.g>
            </g>
            <motion.path className="chin" d="M84.1 121.6c2.7 2.9 6.1 5.4 9.8 7.5l.9-4.5c2.9 2.5 6.3 4.8 10.2 6.5 0-1.9-.1-3.9-.2-5.8 3 1.2 6.2 2 9.7 2.5-.3-2.1-.7-4.1-1.2-6.1" fill="none" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" animate={chinControls} />
            <motion.path className="face" fill="#DDF1FA" d="M134.5,46v35.5c0,21.815-15.446,39.5-34.5,39.5s-34.5-17.685-34.5-39.5V46" animate={faceControls} />
            <motion.path className="hair" fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M81.457,27.929 c1.755-4.084,5.51-8.262,11.253-11.77c0.979,2.565,1.883,5.14,2.712,7.723c3.162-4.265,8.626-8.27,16.272-11.235 c-0.737,3.293-1.588,6.573-2.554,9.837c4.857-2.116,11.049-3.64,18.428-4.156c-2.403,3.23-5.021,6.391-7.852,9.474" animate={hairControls} />
            <motion.g className="eyebrow" animate={eyebrowControls}>
              <path fill="#FFFFFF" d="M138.142,55.064c-4.93,1.259-9.874,2.118-14.787,2.599c-0.336,3.341-0.776,6.689-1.322,10.037 c-4.569-1.465-8.909-3.222-12.996-5.226c-0.98,3.075-2.07,6.137-3.267,9.179c-5.514-3.067-10.559-6.545-15.097-10.329 c-1.806,2.889-3.745,5.73-5.816,8.515c-7.916-4.124-15.053-9.114-21.296-14.738l1.107-11.768h73.475V55.064z" />
              <path fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M63.56,55.102 c6.243,5.624,13.38,10.614,21.296,14.738c2.071-2.785,4.01-5.626,5.816-8.515c4.537,3.785,9.583,7.263,15.097,10.329 c1.197-3.043,2.287-6.104,3.267-9.179c4.087,2.004,8.427,3.761,12.996,5.226c0.545-3.348,0.986-6.696,1.322-10.037 c4.913-0.481,9.857-1.34,14.787-2.599" />
            </motion.g>
            <motion.g className="eyeL" animate={eyeLControls}>
              <circle cx="85.5" cy="78.5" r="3.5" fill="#3a5e77" />
              <circle cx="84" cy="76" r="1" fill="#fff" />
            </motion.g>
            <motion.g className="eyeR" animate={eyeRControls}>
              <circle cx="114.5" cy="78.5" r="3.5" fill="#3a5e77" />
              <circle cx="113" cy="76" r="1" fill="#fff" />
            </motion.g>
            <g className="mouth">
              <motion.path
                className={styles.mouthBG}
                fill="#617E92"
                d={mouthVariants[mouthState].d as string}
                animate={{ d: mouthVariants[mouthState].d, scale: mouthVariants[mouthState].scale, y: mouthVariants[mouthState].y }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              {/* Estos paths se mantienen para referencia de morphing, pero no se animan directamente */}
              <path style={{ display: 'none' }} className={styles.mouthSmallBG} fill="#617E92" d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z" />
              <path style={{ display: 'none' }} className={styles.mouthMediumBG} d="M95,104.2c-4.5,0-8.2-3.7-8.2-8.2v-2c0-1.2,1-2.2,2.2-2.2h22c1.2,0,2.2,1,2.2,2.2v2 c0,4.5-3.7,8.2-8.2,8.2H95z" />
              <path style={{ display: 'none' }} className={styles.mouthLargeBG} d="M100 110.2c-9 0-16.2-7.3-16.2-16.2 0-2.3 1.9-4.2 4.2-4.2h24c2.3 0 4.2 1.9 4.2 4.2 0 9-7.2 16.2-16.2 16.2z" fill="#617e92" stroke="#3a5e77" strokeLinejoin="round" strokeWidth="2.5" />
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
              <path className={styles.mouthOutline} fill="none" stroke="#3A5E77" strokeWidth="2.5" strokeLinejoin="round" d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z" />
            </g>
            <motion.path className="nose" d="M97.7 79.9h4.7c1.9 0 3 2.2 1.9 3.7l-2.3 3.3c-.9 1.3-2.9 1.3-3.8 0l-2.3-3.3c-1.3-1.6-.2-3.7 1.8-3.7z" fill="#3a5e77" animate={noseControls} />
            <g className="arms" clipPath="url(#armMask)">
              <motion.g className="armL" initial="hidden" animate={armLControls} variants={armVariants}>
                <polygon fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" points="121.3,98.4 111,59.7 149.8,49.3 169.8,85.4" />
                <path fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M134.4,53.5l19.3-5.2c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-10.3,2.8" />
                <path fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M150.9,59.4l26-7c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-21.3,5.7" />

                <motion.g className="twoFingers" animate={twoFingersControls} variants={twoFingersVariants}>
                  <path fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M158.3,67.8l23.1-6.2c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-23.1,6.2" />
                  <path fill="#A9DDF3" d="M180.1,65l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L180.1,65z" />
                  <path fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M160.8,77.5l19.4-5.2c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-18.3,4.9" />
                  <path fill="#A9DDF3" d="M178.8,75.7l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L178.8,75.7z" />
                </motion.g>
                <path fill="#A9DDF3" d="M175.5,55.9l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L175.5,55.9z" />
                <path fill="#A9DDF3" d="M152.1,50.4l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L152.1,50.4z" />
                <path fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M123.5,97.8 c-41.4,14.9-84.1,30.7-108.2,35.5L1.2,81c33.5-9.9,71.9-16.5,111.9-21.8" />
                <path fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M108.5,60.4 c7.7-5.3,14.3-8.4,22.8-13.2c-2.4,5.3-4.7,10.3-6.7,15.1c4.3,0.3,8.4,0.7,12.3,1.3c-4.2,5-8.1,9.6-11.5,13.9 c3.1,1.1,6,2.4,8.7,3.8c-1.4,2.9-2.7,5.8-3.9,8.5c2.5,3.5,4.6,7.2,6.3,11c-4.9-0.8-9-0.7-16.2-2.7" />
                <path fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M94.5,103.8 c-0.6,4-3.8,8.9-9.4,14.7c-2.6-1.8-5-3.7-7.2-5.7c-2.5,4.1-6.6,8.8-12.2,14c-1.9-2.2-3.4-4.5-4.5-6.9c-4.4,3.3-9.5,6.9-15.4,10.8 c-0.2-3.4,0.1-7.1,1.1-10.9" />
                <path fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M97.5,63.9 c-1.7-2.4-5.9-4.1-12.4-5.2c-0.9,2.2-1.8,4.3-2.5,6.5c-3.8-1.8-9.4-3.1-17-3.8c0.5,2.3,1.2,4.5,1.9,6.8c-5-0.6-11.2-0.9-18.4-1 c2,2.9,0.9,3.5,3.9,6.2" />
              </motion.g>
              <motion.g className="armR" initial="hidden" animate={armRControls} variants={armVariants}>
                <path fill="#ddf1fa" stroke="#3a5e77" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2.5" d="M265.4 97.3l10.4-38.6-38.9-10.5-20 36.1z" />
                <path fill="#ddf1fa" stroke="#3a5e77" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2.5" d="M252.4 52.4L233 47.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l10.3 2.8M226 76.4l-19.4-5.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l18.3 4.9M228.4 66.7l-23.1-6.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l23.1 6.2M235.8 58.3l-26-7c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l21.3 5.7" />
                <path fill="#a9ddf3" d="M207.9 74.7l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8zM206.7 64l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8zM211.2 54.8l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8zM234.6 49.4l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8z" />
                <path fill="#fff" stroke="#3a5e77" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M263.3 96.7c41.4 14.9 84.1 30.7 108.2 35.5l14-52.3C352 70 313.6 63.5 273.6 58.1" />
                <path fill="#fff" stroke="#3a5e77" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M278.2 59.3l-18.6-10 2.5 11.9-10.7 6.5 9.9 8.7-13.9 6.4 9.1 5.9-13.2 9.2 23.1-.9M284.5 100.1c-.4 4 1.8 8.9 6.7 14.8 3.5-1.8 6.7-3.6 9.7-5.5 1.8 4.2 5.1 8.9 10.1 14.1 2.7-2.1 5.1-4.4 7.1-6.8 4.1 3.4 9 7 14.7 11 1.2-3.4 1.8-7 1.7-10.9M314 66.7s5.4-5.7 12.6-7.4c1.7 2.9 3.3 5.7 4.9 8.6 3.8-2.5 9.8-4.4 18.2-5.7.1 3.1.1 6.1 0 9.2 5.5-1 12.5-1.6 20.8-1.9-1.4 3.9-2.5 8.4-2.5 8.4" />
              </motion.g>
            </g>
          </svg>
        </div>
      </div>

      {formMode === 'signup' && (
        <div className={`${styles.inputGroup} ${styles.inputGroup0}`}>
          <label htmlFor="loginUsername" id="loginUsernameLabel">{t.username}</label>
          <input
            type="text"
            id="loginUsername"
            maxLength={32}
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoFocus={formMode === 'signup'}
            onFocus={resetFaceAnimations} // Reset face animations on username focus
            onBlur={resetFaceAnimations}
          />
        </div>
      )}
      <div className={`${styles.inputGroup} ${styles.inputGroup1}`}>
        <label htmlFor="loginEmail" id="loginEmailLabel">{t.email}</label>
        <input
          ref={emailInputRef} // Asignar ref al input de email
          type="email"
          id="loginEmail"
          maxLength={254}
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoFocus={formMode === 'login'}
          onFocus={resetFaceAnimations} // Reset face animations on email focus
          onBlur={resetFaceAnimations}
        />
        <p className={`${styles.helper} ${styles.helper1}`}>{t.helperEmail}</p>
      </div>
      <div className={`${styles.inputGroup} ${styles.inputGroup2}`}>
        <label htmlFor="loginPassword" id="loginPasswordLabel">{t.password}</label>
        <input
          type={showPassword ? 'text' : 'password'}
          id="loginPassword"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          onFocus={handlePasswordFocus}
          onBlur={handlePasswordBlur}
        />
        <label id="showPasswordToggle" htmlFor="showPasswordCheck">Show
          <input
            id="showPasswordCheck"
            type="checkbox"
            checked={showPassword}
            onChange={e => setShowPassword(e.target.checked)}
            onFocus={handlePasswordFocus} // Mantener brazos cubriendo al enfocar checkbox
            onBlur={handlePasswordBlur}
          />
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
        <button type="button" className={styles.googleBtn} onClick={onGoogleLogin} disabled={loading}>
          <span className={styles.googleIcon}></span> {formMode === 'login' ? t.google : t.googleSignup}
        </button>
      </div>
      <div className={`${styles.inputGroup} ${styles.inputGroupSwitch}`}>
        {formMode === 'login' ? (
          <span>{t.dontHaveAccount} <button type="button" className="underline" onClick={() => setFormMode('signup')}>{t.switchToSignup}</button></span>
        ) : (
          <span>{t.haveAccount} <button type="button" className="underline" onClick={() => setFormMode('login')}>{t.switchToLogin}</button></span>
        )}
      </div>
    </form>
  );
};

export default YetiLogin;