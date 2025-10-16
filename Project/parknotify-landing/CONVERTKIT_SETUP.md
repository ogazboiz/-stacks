# ConvertKit Setup Guide

## Step 1: Create ConvertKit Account

1. Go to [ConvertKit.com](https://convertkit.com)
2. Sign up for a free account (up to 1,000 subscribers)
3. Verify your email address

## Step 2: Create a Form

1. In your ConvertKit dashboard, go to "Forms"
2. Click "Create Form"
3. Choose "Landing Page" or "Inline Form"
4. Customize your form:
   - Form name: "ParkNotify Waitlist"
   - Welcome message: "Thanks for joining the ParkNotify waitlist!"
   - Add custom fields:
     - City (text field)
     - Source (hidden field, default: "ParkNotify Landing Page")
5. Save the form

## Step 3: Get Your Credentials

### API Key
1. Go to Account Settings → Advanced Settings
2. Copy your "API Key"

### Form ID
1. Go to your form settings
2. The Form ID is in the URL: `https://app.convertkit.com/forms/[FORM_ID]/edit`
3. Or find it in the form embed code

## Step 4: Set Environment Variables

Create a `.env.local` file in your project root:

```bash
# ConvertKit Configuration
CONVERTKIT_API_KEY=your_actual_api_key_here
CONVERTKIT_FORM_ID=your_actual_form_id_here
```

## Step 5: Test the Integration

1. Start your development server: `npm run dev`
2. Go to your landing page
3. Fill out the waitlist form
4. Check your ConvertKit dashboard to see the new subscriber

## Step 6: Deploy to Production

### Vercel Deployment
1. Add environment variables in Vercel dashboard:
   - Go to your project settings
   - Add `CONVERTKIT_API_KEY` and `CONVERTKIT_FORM_ID`
2. Redeploy your site

### Other Platforms
Add the environment variables in your hosting platform's settings.

## Features Included

- ✅ Email validation
- ✅ Duplicate email handling
- ✅ Custom fields (city, source, signup date)
- ✅ Error handling
- ✅ Loading states
- ✅ Success messages

## Custom Fields Added

- **city**: User's city (optional)
- **source**: Always set to "ParkNotify Landing Page"
- **signup_date**: Timestamp of signup

## Next Steps

1. Set up email automation in ConvertKit
2. Create welcome email sequence
3. Set up launch notification emails
4. Add analytics tracking
5. Create subscriber segments by city

## Troubleshooting

### Common Issues

1. **"Service not configured" error**
   - Check that environment variables are set correctly
   - Restart your development server after adding env vars

2. **"Failed to join waitlist" error**
   - Check your API key is correct
   - Verify the form ID exists
   - Check ConvertKit API status

3. **Duplicate email error**
   - This is normal behavior
   - User will see "Email already registered" message

### Testing

Test with different scenarios:
- Valid email
- Invalid email format
- Duplicate email
- Missing required fields
- Network errors
