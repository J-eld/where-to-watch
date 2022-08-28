import React from 'react';
import { useRouter } from 'next/router'

interface LinkProps {
  href: string
  children: JSX.Element
}

export default function Link({ href, children }: LinkProps) {
  const router = useRouter();

  // routing through next router prevents reload if routing to a page the user is already on
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    router.push(href)
  }

  return (
    <a href={href} onClick={handleClick}>
      {children}
    </a>
  )
}
