import React from 'react'

interface Params {
    params: {userId: string}
}
export default function page({params}: Params) {

    const {userId} = params;
  return (
    <div>
        {userId}
    </div>
  )
}
