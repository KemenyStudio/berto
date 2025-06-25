import { NextRequest, NextResponse } from 'next/server';
import { hybridFileSystem } from '@/services/hybrid-filesystem';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const uploadPath = formData.get('path') as string || '/home/user';

    if (!files || files.length === 0) {
      return NextResponse.json({ 
        error: 'No files provided' 
      }, { status: 400 });
    }

    const uploadedFiles = [];

    for (const file of files) {
      if (file.size === 0) continue;

      const content = await file.text();
      const fileUpload = {
        name: file.name,
        content,
        path: uploadPath,
        size: file.size,
        type: file.type
      };

      const success = hybridFileSystem.uploadFile(fileUpload);
      if (success) {
        uploadedFiles.push({
          name: file.name,
          size: file.size,
          path: uploadPath
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Uploaded ${uploadedFiles.length} file(s)`,
      files: uploadedFiles
    });

  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload files',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const uploadedFiles = hybridFileSystem.getUploadedFiles();
    
    return NextResponse.json({
      files: uploadedFiles.map(file => ({
        name: file.name,
        path: file.path,
        size: file.size,
        type: file.type
      }))
    });
  } catch (error) {
    console.error('Error fetching uploaded files:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch uploaded files'
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    hybridFileSystem.clearUploadedFiles();
    
    return NextResponse.json({
      success: true,
      message: 'All uploaded files cleared'
    });
  } catch (error) {
    console.error('Error clearing uploaded files:', error);
    return NextResponse.json({ 
      error: 'Failed to clear uploaded files'
    }, { status: 500 });
  }
} 