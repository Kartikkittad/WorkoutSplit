import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/app';
  const redirectTarget = `${origin}${next}`;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Complete — WorkoutSplit</title>
  <style>
    body {
      background: #0F172A;
      color: #FFFFFF;
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      text-align: center;
      padding: 24px;
      box-sizing: border-box;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(255,255,255,0.15);
      border-top-color: #FFE100;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 20px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="spinner"></div>
  <h2 style="font-size: 20px; font-weight: 800; margin: 0 0 8px 0;">Signed in successfully!</h2>
  <p style="font-size: 14px; opacity: 0.7; margin: 0;">Returning to WorkoutSplit...</p>
  <script>
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('auth_channel');
        bc.postMessage({ type: 'LOGIN_SUCCESS' });
      }
      localStorage.setItem('auth_login_timestamp', Date.now().toString());
    } catch(e) {}

    setTimeout(function() {
      try {
        window.close();
      } catch (e) {}

      setTimeout(function() {
        window.location.href = ${JSON.stringify(redirectTarget)};
      }, 150);
    }, 100);
  </script>
</body>
</html>`;

      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }
  }

  // Return to root with an auth error flag if code exchange failed
  return NextResponse.redirect(`${origin}/?auth_error=true`);
}

