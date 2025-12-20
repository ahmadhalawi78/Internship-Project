// app/api/admin/moderation/route.js
import { createClient } from '../../../../lib/supabaseServer'
import { NextResponse } from 'next/server'

// POST: Handle moderation actions
export async function POST(request) {
  try {
    const supabase = await createClient()
    const { action, type, id, reason } = await request.json()
    
    // Check admin permissions (you should implement proper auth)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    switch (action) {
      case 'approve_listing':
        await supabase
          .from('listings')
          .update({ status: 'approved' })
          .eq('id', id)
        break
        
      case 'reject_listing':
        await supabase
          .from('listings')
          .update({ 
            status: 'rejected',
            rejection_reason: reason 
          })
          .eq('id', id)
        break
        
      case 'suspend_user':
        await supabase
          .from('profiles')
          .update({ 
            is_suspended: true,
            suspension_reason: reason 
          })
          .eq('id', id)
        break
        
      case 'resolve_report':
        await supabase
          .from('reports')
          .update({ 
            status: 'resolved',
            resolved_at: new Date().toISOString(),
            resolved_by: user.id 
          })
          .eq('id', id)
        break
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}