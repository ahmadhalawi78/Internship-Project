import { NextResponse } from 'next/server';

// Mock data for testing
const mockData = [
  {
    id: '1',
    title: 'iPhone 13 Pro Max',
    description: 'Like new condition, 256GB, Pacific Blue',
    category: 'Electronics',
    type: 'For Trade',
    city: 'New York',
    area: 'Manhattan',
    is_urgent: true,
    created_at: '2024-01-15T10:30:00Z',
    expires_at: '2024-02-15T10:30:00Z'
  },
  {
    id: '2',
    title: 'Samsung Galaxy S23',
    description: 'Brand new, sealed box, 256GB',
    category: 'Electronics',
    type: 'For Sale',
    city: 'London',
    area: 'Soho',
    is_urgent: false,
    created_at: '2024-01-10T14:20:00Z',
    expires_at: '2024-02-10T14:20:00Z'
  },
  {
    id: '3',
    title: 'MacBook Pro 2023',
    description: 'M2 Pro, 16GB RAM, 512GB SSD',
    category: 'Electronics',
    type: 'For Trade',
    city: 'Paris',
    area: 'Champs-Élysées',
    is_urgent: true,
    created_at: '2024-01-05T09:15:00Z',
    expires_at: '2024-01-25T09:15:00Z'
  },
  {
    id: '4',
    title: 'Designer Leather Jacket',
    description: 'Size M, black leather, worn only twice',
    category: 'Clothing',
    type: 'For Sale',
    city: 'Tokyo',
    area: 'Shibuya',
    is_urgent: false,
    created_at: '2024-01-12T16:45:00Z',
    expires_at: '2024-02-12T16:45:00Z'
  },
  {
    id: '5',
    title: 'Professional DSLR Camera',
    description: 'Canon EOS 5D Mark IV with 2 lenses',
    category: 'Electronics',
    type: 'For Trade',
    city: 'Berlin',
    area: 'Mitte',
    is_urgent: true,
    created_at: '2024-01-08T11:20:00Z',
    expires_at: '2024-01-28T11:20:00Z'
  }
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const urgent = searchParams.get('urgent');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 20;
    
    // Start with all mock data
    let filteredData = [...mockData];
    
    // Apply text search
    if (q) {
      const searchLower = q.toLowerCase();
      filteredData = filteredData.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply category filter
    if (category) {
      filteredData = filteredData.filter(item =>
        item.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Apply city filter
    if (city) {
      filteredData = filteredData.filter(item =>
        item.city.toLowerCase().includes(city.toLowerCase())
      );
    }
    
    // Apply urgent filter
    if (urgent === 'true') {
      filteredData = filteredData.filter(item => item.is_urgent === true);
    } else if (urgent === 'false') {
      filteredData = filteredData.filter(item => item.is_urgent === false);
    }
    
    // Sort by newest first
    filteredData.sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    return NextResponse.json({
      success: true,
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: filteredData.length,
        totalPages: Math.ceil(filteredData.length / limit)
      }
    });
    
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      data: []
    }, { status: 500 });
  }
}