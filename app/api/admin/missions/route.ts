import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole, Role, requireUserId } from '@/lib/auth';
import { CreateMissionSchema, MissionFilterSchema } from '@/lib/validation';

/**
 * GET /api/admin/missions
 * List all missions with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const authCheck = await requireRole(Role.VIEWER);
    if (authCheck instanceof NextResponse) return authCheck;

    const { searchParams } = new URL(request.url);
    
    // Parse and validate query parameters
    const filterParams = {
      type: searchParams.get('type') || undefined,
      category: searchParams.get('category') || undefined,
      isActive: searchParams.get('isActive') === 'true' ? true : searchParams.get('isActive') === 'false' ? false : undefined,
      isFeatured: searchParams.get('isFeatured') === 'true' ? true : searchParams.get('isFeatured') === 'false' ? false : undefined,
      isScheduled: searchParams.get('isScheduled') === 'true' ? true : searchParams.get('isScheduled') === 'false' ? false : undefined,
      createdBy: searchParams.get('createdBy') || undefined,
      search: searchParams.get('search') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      sortBy: (searchParams.get('sortBy') || 'createdAt') as any,
      sortOrder: (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc',
    };

    const filters = MissionFilterSchema.parse(filterParams);

    // Build where clause
    const where: any = {};
    
    if (filters.type) where.type = filters.type;
    if (filters.category) where.category = filters.category;
    if (filters.isActive !== undefined) where.isActive = filters.isActive;
    if (filters.isFeatured !== undefined) where.isFeatured = filters.isFeatured;
    if (filters.isScheduled !== undefined) where.isScheduled = filters.isScheduled;
    if (filters.createdBy) where.createdBy = filters.createdBy;
    
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { partnerName: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.startDate || filters.endDate) {
      where.startDate = {};
      if (filters.startDate) where.startDate.gte = new Date(filters.startDate);
      if (filters.endDate) where.startDate.lte = new Date(filters.endDate);
    }

    // Get total count
    const totalCount = await prisma.mission.count({ where });

    // Get paginated missions
    const missions = await prisma.mission.findMany({
      where,
      orderBy: { [filters.sortBy]: filters.sortOrder },
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
      include: {
        _count: {
          select: {
            userProgress: true,
          },
        },
      },
    });

    return NextResponse.json({
      missions,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        totalCount,
        totalPages: Math.ceil(totalCount / filters.limit),
      },
    });
  } catch (error) {
    console.error('Get missions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/missions
 * Create a new mission
 */
export async function POST(request: NextRequest) {
  try {
    const authCheck = await requireRole(Role.EDITOR);
    if (authCheck instanceof NextResponse) return authCheck;

    const userId = await requireUserId();
    const body = await request.json();
    
    console.log('Received mission data:', JSON.stringify(body, null, 2));
    
    // Validate request body
    const validatedData = CreateMissionSchema.parse(body);

    // Create mission
    const mission = await prisma.mission.create({
      data: {
        ...validatedData,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        createdBy: userId,
        lastEditedBy: userId,
        requirements: validatedData.requirements as any,
        validationRules: validatedData.validationRules as any,
      },
    });

    return NextResponse.json(mission, { status: 201 });
  } catch (error) {
    console.error('Create mission error:', error);
    
    if (error instanceof Error && 'issues' in error) {
      // Zod validation error
      return NextResponse.json({ 
        error: 'Validation error', 
        details: (error as any).issues 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
