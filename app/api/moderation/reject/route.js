import { NextResponse } from 'next/server';
import { verifyToken, isAdmin } from '@/lib/auth';

// POST /api/moderation/reject
export async function POST(request) {
  try {
    // 1. Auth check
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await verifyToken(token);
    
    // 2. Admin check
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // 3. Get data
    const { reportId, reason } = await request.json();
    
    // 4. Validation
    if (!reportId || !reason) {
      return NextResponse.json(
        { error: 'Report ID and reason are required' },
        { status: 400 }
      );
    }

    if (reason.length < 10) {
      return NextResponse.json(
        { error: 'Reason must be at least 10 characters' },
        { status: 400 }
      );
    }

    // 5. TODO: Add rejection logic
    // await rejectReport(reportId, user.id, reason);
    
    console.log(`[REJECT] Report ${reportId} - Reason: ${reason}`);

    // 6. Success
    return NextResponse.json({
      success: true,
      message: 'Content rejected',
      data: {
        reportId,
        moderator: user.id,
        action: 'rejected',
        timestamp: new Date().toISOString(),
        reason
      }
    });

  } catch (error) {
    console.error('Rejection error:', error);
    return NextResponse.json(
      { error: 'Failed to process rejection' },
      { status: 500 }
    );
  }
}