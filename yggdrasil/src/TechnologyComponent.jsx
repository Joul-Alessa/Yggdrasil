import './TechnologyComponent.css'

function ProjectComponent({ text, fontColor, backColor }) {
  return (
    <>
      <p className='TechnologyComponentText' style={{
        backgroundColor: backColor,
        color: fontColor,
      }}>{text}</p>
    </>
  )
}

export default ProjectComponent