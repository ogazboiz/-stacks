import { NextRequest, NextResponse } from 'next/server';

// ConvertKit configuration
const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, city } = body;

    // Basic validation
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if ConvertKit is configured
    if (!CONVERTKIT_API_KEY || !CONVERTKIT_FORM_ID) {
      console.error('ConvertKit not configured. Please set CONVERTKIT_API_KEY and CONVERTKIT_FORM_ID environment variables.');
      return NextResponse.json(
        { error: 'Service not configured' },
        { status: 500 }
      );
    }

    // Submit to ConvertKit
    const convertKitResponse = await fetch(`https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: CONVERTKIT_API_KEY,
        email: email.toLowerCase().trim(),
        first_name: name.trim(),
        fields: {
          city: city?.trim() || 'Unknown',
          source: 'ParkNotify Landing Page',
          signup_date: new Date().toISOString()
        }
      })
    });

    const convertKitData = await convertKitResponse.json();

    if (!convertKitResponse.ok) {
      console.error('ConvertKit error:', convertKitData);
      
      // Handle duplicate email error
      if (convertKitData.error && convertKitData.error.includes('already subscribed')) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to join waitlist' },
        { status: 500 }
      );
    }

    // Log successful signup
    console.log('New signup to ConvertKit:', {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      city: city?.trim() || 'Unknown',
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { 
        message: 'Successfully joined waitlist!',
        signup: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          city: city?.trim() || 'Unknown',
          timestamp: new Date().toISOString()
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
