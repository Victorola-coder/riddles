import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/utils/jwt';

/**
 * POST /api/auth/logout
 * Logout user and clear authentication token
 */
export async function POST(request: NextRequest) {
  try {
    // Try to get user (optional - allows logout even with invalid/missing token)
    let user = null;
    try {
      user = getUserFromRequest(request);
    } catch (error) {
      // Ignore errors - logout should work even without valid token
    }
    
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    // Clear the token cookie (set in login endpoint)
    response.cookies.delete('token');
    
    // Also clear any other auth-related cookies
    response.cookies.delete('auth_token');
    
    // Set cookie to expire immediately
    response.cookies.set({
      name: 'token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0, // Expire immediately
    });

    // Log activity if user was authenticated
    if (user) {
      try {
        const { logActivity } = await import('@/lib/activity-logger');
        await logActivity({
          type: 'user_logout',
          category: 'user',
          title: 'User Logged Out',
          description: `User ${user.email} logged out`,
          userId: user.userId,
        });
      } catch (error) {
        // Don't fail logout if activity logging fails
        console.error('Failed to log logout activity:', error);
      }
    }

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if there's an error, clear cookies
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
    
    response.cookies.delete('token');
    response.cookies.delete('auth_token');
    
    return response;
  }
}
