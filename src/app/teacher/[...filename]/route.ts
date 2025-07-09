import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string[] }> }
) {
  try {
    const { filename } = await params
    const fullFilename = filename.join('/')
    
    console.log('Incorrect file access attempt:', `/teacher/${fullFilename}`)
    
    // Check if this looks like a submission file (timestamp-userId-filename pattern)
    if (fullFilename.match(/^\d+-[a-f0-9]+-/)) {
      console.log('Redirecting submission file to correct API:', fullFilename)
      return NextResponse.redirect(new URL(`/api/submissions/download/${fullFilename}`, request.url))
    }
    
    // Check if this looks like an assignment file
    console.log('Redirecting assignment file to correct API:', fullFilename)
    return NextResponse.redirect(new URL(`/api/assignments/download/${fullFilename}`, request.url))
    
  } catch (error) {
    console.error('Error in teacher file redirect:', error)
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}
