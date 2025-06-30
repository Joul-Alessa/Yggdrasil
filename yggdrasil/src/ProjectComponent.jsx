import { useTranslation } from 'react-i18next';
import './ProjectComponent.css'

function ProjectComponent({ urlLink, text1, text2, text3, imageUrl }) {
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  const { t } = useTranslation();

  var url;
  if(imageUrl.medium)
  {
    url = imageUrl.medium.url;
  }
  else
  {
    url = imageUrl.thumbnail.url;
  }

  var knowMore = '';
  if(text3 != undefined)
  {
    knowMore = t('KnowMore');
  }
  
  return (
    <>
      <a href={urlLink} target="_blank" className='ProjectComponent'>
        <div>
          <div className='ProjectComponentImage'>
            <img src={apiBaseUrl + url} />
          </div>

          <p className='ProjectComponentText1'>{text1}</p>
          <p className='ProjectComponentText2'>{text2}</p>
        </div>
        
        <div>
          <p className='ProjectComponentText3'>{knowMore}</p>
        </div>
      </a>
    </>
  )
}

export default ProjectComponent