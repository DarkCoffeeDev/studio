// src/app/(auth)/layout.tsx
"use client";

import { useMediaQuery } from "@/hooks/use-media-query"; // Necesitarás crear este hook
import styles from "@/components/clemmont/YetiLogin.module.css"; // Importa los estilos del Yeti

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useMediaQuery("(max-width: 500px)"); // Usa el breakpoint de tu CSS

  return (
    <div className="flex min-h-screen w-full">
      {/* Contenedor principal que maneja el layout responsivo */}
      <div className="flex flex-1 flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-blue-100 to-blue-300 dark:from-slate-900 dark:to-slate-800">
        {isMobile ? (
          // Vista Móvil: Yeti arriba, formulario abajo
          <div className="flex flex-col items-center w-full max-w-sm">
            <div className={styles.svgContainerMobile}>
              {/* Aquí se renderizará el SVG del Yeti si se pasa como prop o si el componente YetiLogin es inteligente */}
              {/* En tu caso, el SVG ya está dentro de YetiLogin, por lo que este div
                  es solo un placeholder visual para la estructura móvil si lo separaras.
                  Como el SVG está dentro de YetiLogin, este layout solo posiciona el componente completo.
                  El estilo .svgContainerMobile se aplicará al contenedor del SVG para simularlo arriba.
              */}
            </div>
            {/* El children (YetiLogin) será el formulario */}
            <div className="w-full">
              {children} 
            </div>
          </div>
        ) : (
          // Vista Escritorio: Formulario centrado, ocupando el espacio disponible
          <div className="w-full max-w-md mx-auto">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}