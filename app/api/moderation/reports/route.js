import { NextResponse } from 'next/server';
import { verifyToken, isAdmin } from '../../../../lib/auth';

// GET /api/moderation/reports
export async function GET(request) {
  try {
    // 1. Auth check
    const token = request.headers.get('authorization')?.split(' ')[1];
    const user = await verifyToken(token);
    
    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // 2. Get query params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // 3. Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'all'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status filter' },
        { status: 400 }
      );
    }

    // 4. TODO: Fetch reports from database
    // const reports = await getReports({ status, limit, offset });
    // const total = await getReportCount(status);
    
    // Mock data for now
    const mockReports = Array.from({ length: Math.min(limit, 5) }, (_, i) => ({
      id: `report_${offset + i + 1}`,
      contentId: `content_${1000 + i}`,
      reason: 'Inappropriate content',
      reportedBy: `user_${200 + i}`,
      status: status === 'all' ? ['pending', 'approved', 'rejected'][i % 3] : status,
      createdAt: new Date(Date.now() - i * 3600000).toISOString(),
      contentType: i % 2 === 0 ? 'post' : 'comment'
    }));

    // 5. Return reports
    return NextResponse.json({
      success: true,
      data: mockReports,
      pagination: {
        page,
        limit,
        total: 45, // Mock total
        pages: Math.ceil(45 / limit)
      }
    });

  } catch (error) {
    console.error('Get reports error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

// POST /api/moderation/reports (for users to submit reports)
export async function POST(request) {
  try {
    // 1. Auth check (less strict for submission)
    const token = request.headers.get('authorization')?.split(' ')[1];
    const user = token ? await verifyToken(token) : null;
    
    // 2. Get report data
    const { contentId, reason, reportType } = await request.json();
    
    // 3. Validation
    if (!contentId || !reason) {
      return NextResponse.json(
        { error: 'Content ID and reason are required' },
        { status: 400 }
      );
    }

    if (reason.length < 5) {
      return NextResponse.json(
        { error: 'Reason must be at least 5 characters' },
        { status: 400 }
      );
    }

    // 4. TODO: Save report to database
    // await createReport({ contentId, reason, reportType, reportedBy: user?.id });
    
    console.log(`[REPORT] New report for ${contentId}: ${reason}`);

    // 5. Success
    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully',
      reportId: `report_${Date.now()}`,
      timestamp: new Date().toISOString()
    }, { status: 201 });

  } catch (error) {
    console.error('Submit report error:', error);
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}