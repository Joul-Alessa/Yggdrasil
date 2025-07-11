import { useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import './PresentationName.css'
import GitHub from './assets/images/socials/github.png';
import LinkedIn from './assets/images/socials/linkedin.png';
import Kaggle from './assets/images/socials/kaggle.png';
import GoogleDev from './assets/images/socials/google-dev.png';
import HFace from './assets/images/socials/hugging-face.png';
import Orcid from './assets/images/socials/orcid.png';

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

  const { t } = useTranslation();
  
  return (
    <>
      <div className='PresentationName DivGlassmorphism'>
        <div className='VerticalCenterer'>
          <p className="PresentationTextHi">{t('PresentationNameHi')}</p>

          <p ref={textRef} className="PresentationTextName">Joul Alessa</p>

          <div className='PresentationNameSocialMediaImages'>
            <a href='https://github.com/Joul-Alessa' target='_blank' rel='noreferrer'>
              <img src={GitHub} alt='GitHub profile'/>
            </a>
            <a href='https://www.linkedin.com/in/joel-alejandro-espinoza-sanchez/' target='_blank' rel='noreferrer'>
              <img src={LinkedIn} alt='LinkedIn profile'/>
            </a>
            <a href='https://www.kaggle.com/joulespinozasanchez' target='_blank' rel='noreferrer'>
              <img src={Kaggle} alt='Kaggle profile'/>
            </a>
            <a href='https://developers.google.com/profile/u/115558684963200671859?hl=es-419&utm_source=developers.google.com' target='_blank' rel='noreferrer'>
              <img src={GoogleDev} alt='Google Developer profile'/>
            </a>
            <a href='https://huggingface.co/Joul24py' target='_blank' rel='noreferrer'>
              <img src={HFace} alt='Hugging Face profile'/>
            </a>
            <a href='https://orcid.org/0009-0004-2139-5109' target='_blank' rel='noreferrer'>
              <img src={Orcid} alt='OrcID profile'/>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default PresentationName
