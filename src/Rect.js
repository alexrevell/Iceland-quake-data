import React from 'react'

function Rect({ children, className, fill, height, i, key, quake, width, x, y }) {
  return (
    <rect
      className={className}
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
    >
      { children }
    </rect>
  )
}

export default Rect
