'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import withoutAuth from '@/HOC/withoutAuth'

function Welcome() {
  const router = useRouter()

  useEffect(() => {
    document.cookie = `loggedIn=false;domain=.storykasa.com;path=/`
    router.push('https://storykasa.com')
  }, [])

  return (
    <></>
  )
}

export default withoutAuth(Welcome)
