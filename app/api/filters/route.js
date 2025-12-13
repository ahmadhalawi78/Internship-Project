import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  try {
    // Get unique categories
    const { data: categories } = await supabase
      .from('listings')
      .select('category')
      .eq('status', 'active')
      .not('category', 'is', null);
    
    // Get unique cities
    const { data: cities } = await supabase
      .from('listings')
      .select('city')
      .eq('status', 'active')
      .not('city', 'is', null);
    
    // Get urgent count
    const { data: urgentCount } = await supabase
      .from('listings')
      .select('id', { count: 'exact' })
      .eq('status', 'active')
      .eq('is_urgent', true);
    
    return NextResponse.json({
      success: true,
      filters: {
        categories: [...new Set(categories?.map(c => c.category).filter(Boolean) || [])],
        cities: [...new Set(cities?.map(c => c.city).filter(Boolean) || [])],
        stats: {
          urgent: urgentCount?.length || 0
        }
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      filters: {
        categories: [],
        cities: [],
        stats: { urgent: 0 }
      }
    });
  }
}