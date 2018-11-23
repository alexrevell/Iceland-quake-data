import React from 'react'

function Place({ data, name, textDy, textTransform, textX }) {
  return (
    <g>
      <path className='place' d={data} fill='grey' />
      <text className='place-label'
        dy={textDy}
        x={textX}
        transform={textTransform}
      >
        {name}
      </text>
    </g>
  )
}

export default Place
