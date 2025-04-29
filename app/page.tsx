"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loading } from "@/components/loading"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/dashboard')
  }, [router])

  return <Loading />
}
