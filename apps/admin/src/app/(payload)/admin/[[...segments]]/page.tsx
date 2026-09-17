import configPromise from '@payload-config'
import { Root } from '@payloadcms/next/layouts'
import { generatePageMetadata, renderDashboard } from '@payloadcms/next/views'
import { importMap } from '../importMap'
import React from 'react'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = async ({ params, searchParams }: Args) =>
  generatePageMetadata({ config: configPromise, params, searchParams })

const Page = async ({ params, searchParams }: Args) =>
  renderDashboard({ config: configPromise, importMap, params, searchParams })

export default Page
