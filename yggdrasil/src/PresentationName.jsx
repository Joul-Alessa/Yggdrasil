import { useEffect, useRef } from "react";
import './PresentationName.css'

function PresentationName() {
  const textRef = useRef(null);

  useEffect(() => {
    const originalText = "Joul Alessa";
    const finalText = "Joel Alejandro Espinoza Sánchez";

    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

    async function animateText() {
      await sleep(2000); // Espera 2 segundos mostrando el texto original

      // Borrar letra por letra
      for (let i = originalText.length; i >= 2; i--) {
        if (textRef.current) {
          textRef.current.textContent = originalText.slice(0, i);
        }
        await sleep(50);
      }

      // Escribir letra por letra el nuevo texto
      for (let i = 2; i <= finalText.length; i++) {
        if (textRef.current) {
          textRef.current.textContent = finalText.slice(0, i);
        }
        await sleep(60);
      }
    }

    animateText();
  }, []);
  
  return (
    <>
      <div className='PresentationName DivGlassmorphism'>
        <p>Hi, I'm</p>

        <p ref={textRef}>Joul Alessa</p>
      </div>
    </>
  )
}

export default PresentationName
