import { NextResponse } from 'next/server'
import { campusLocations } from '@/lib/campus-data'

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      locations: campusLocations,
      total: campusLocations.length
    })
  } catch (error) {
    console.error('Error fetching locations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}