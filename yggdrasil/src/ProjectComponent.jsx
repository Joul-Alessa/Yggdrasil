import { useTranslation } from 'react-i18next';
import TechnologyComponent from './TechnologyComponent.jsx';
import './ProjectComponent.css'

function ProjectComponent({ urlLink, text1, text2, text3, technologies, imageUrl, onClick }) {
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

  var Visit = '';
  if(urlLink != undefined)
  {
    Visit = t('Visit');
  }

  return (
    <>
      <div className='ProjectComponent' onClick={onClick}>
        <div>
          <div className='ProjectComponentImage'>
            <img src={apiBaseUrl + url} />
          </div>

          <p className='ProjectComponentText1'>{text1}</p>

          {technologies.length > 0 && (
            <div className='TechnologyComponent'>
            {technologies.map((exp, index) => (
              <TechnologyComponent
              text={exp.name}
              fontColor={exp.font_color}
              backColor={exp.background_color}/>
            ))}
            </div>
          )}

          <p className='ProjectComponentText2'>{text2}</p>
        </div>
        
        <div>
          <a href={urlLink} target="_blank" onClick={(e) => e.stopPropagation()}>
            <p className='ProjectComponentText3'>{Visit}</p>
          </a>
        </div>
      </div>
    </>
  )
}

export default ProjectComponent