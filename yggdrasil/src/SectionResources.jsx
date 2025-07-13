import './SectionResources.css'
import ProjectComponent from './ProjectComponent.jsx';

function SectionResources() {
  return (
    <>
      <div className='ProjectsGrid'>
        <ProjectComponent text={"a"}/>
        <ProjectComponent text={"a"}/>
        <ProjectComponent text={"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa a a a a a a a a a a a aaaaaaa a a a a a a a a a a a aaaaaaa a a a a a a a a a a a aaaaaaa"}/>
        <ProjectComponent/>
        <ProjectComponent text={"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa a a a a a a a a a a a aaaaaaa a a a a a a a a a a a aaaaaaa a a a a a a a a a a a aaaaaaa"}/>
      </div>
    </>
  )
}

export default SectionResources