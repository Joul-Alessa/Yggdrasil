import './SectionHeader.css'

function SectionHeader({ title, description }) {
  return (
    <>
      <div className='SectionHeader DivGlassmorphism'>
        <div className='VerticalCenterer'>
          <p className="SectionHeaderTitle">{title}</p>

          <p className="SectionHeaderDescription">{description}</p>
        </div>
      </div>
    </>
  )
}

export default SectionHeader
