import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import './ExperienceComponent.css'

function ExperienceComponent({ text1, text2, text3, text4, text5, imageUrl }) {
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  const { t } = useTranslation();
  
  var initialDateDisplay;
  var endDateDisplay;
  const initialDate = new Date(text2);
  initialDate.setHours(initialDate.getHours() + 6);
  const initialDateMonth = initialDate.getMonth() + 1;
  const initialDateYear = initialDate.getFullYear();
  console.log(text1 + '   ' + initialDate);
  initialDateDisplay = t('Date' + initialDateMonth) + ' ' + initialDateYear;

  if(text3 == undefined)
  {
    endDateDisplay = t('DateNull');
  }
  else
  {
    const endDate = new Date(text3);
    endDate.setHours(endDate.getHours() + 6);
    const endDateMonth = endDate.getMonth() + 1;
    const endDateYear = endDate.getFullYear();
    endDateDisplay = t('Date' + endDateMonth) + ' ' + endDateYear;
  }

  var url;
  if(imageUrl.medium)
  {
    url = imageUrl.medium.url;
  }
  else
  {
    url = imageUrl.thumbnail.url;
  }

  return (
    <>
      <div className='ExperienceComponent'>
        <div className='ExperienceComponentImageFlex'>
          <div className='ExperienceComponentImage'>
            <img src={apiBaseUrl + url} />
          </div>
        </div>
        <div className='ExperienceComponentText'>
          <p className='ExperienceComponentText1'>{text1}</p>
          <p className='ExperienceComponentText2'>{initialDateDisplay} - {endDateDisplay}</p>
          <p className='ExperienceComponentText3'>{text4}</p>
          <div className='ExperienceComponentText4'><ReactMarkdown>{text5}</ReactMarkdown></div>
        </div>
      </div>
    </>
  )
}

export default ExperienceComponent