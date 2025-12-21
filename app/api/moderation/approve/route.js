import { NextResponse } from 'next/server';
import { verifyToken, isAdmin } from '@/lib/auth';

// POST /api/moderation/approve
export async function POST(request) {
  try {
    // 1. Authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const user = await verifyToken(token);
    
    // 2. Admin check
    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // 3. Get data
    const { reportId, reason } = await request.json();
    
    // 4. Validation
    if (!reportId) {
      return NextResponse.json(
        { error: 'Report ID is required' },
        { status: 400 }
      );
    }

    // 5. TODO: Add your approval logic here
    // await approveReport(reportId, user.id, reason);
    
    console.log(`[APPROVE] Report ${reportId} by ${user.id}`);

    // 6. Success response
    return NextResponse.json({
      success: true,
      message: 'Content approved',
      data: {
        reportId,
        moderator: user.id,
        action: 'approved',
        timestamp: new Date().toISOString(),
        reason: reason || 'Approved by moderator'
      }
    });

  } catch (error) {
    console.error('Approval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}