import React from 'react'

type TitleProps = {
    title: string;
}
export default function Title({ title }: TitleProps) {
  return (
    <h3 className='text-[28px] font-semibold'>{title}</h3>
  )
}
