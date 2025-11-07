<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>403 • Forbidden</title>
    <style>
        :root {
            --bg: #050915;
            --panel: rgba(15, 23, 42, 0.9);
            --panel-border: rgba(148, 163, 184, 0.25);
            --text: #e2e8f0;
            --muted: #94a3b8;
            --accent: #f472b6;
            --accent-strong: #ec4899;
        }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            font-family: "Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            color: var(--text);
            background: radial-gradient(circle at top, #0f172a, var(--bg));
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 3rem 1.5rem;
        }
        main {
            max-width: 540px;
            width: 100%;
            background: var(--panel);
            border: 1px solid var(--panel-border);
            border-radius: 28px;
            padding: 3rem 2.5rem;
            box-shadow: 0 40px 80px rgba(15, 23, 42, 0.65);
            position: relative;
            overflow: hidden;
        }
        main::before,
        main::after {
            content: "";
            position: absolute;
            width: 200px;
            height: 200px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(236, 72, 153, 0.3), transparent 70%);
            filter: blur(8px);
        }
        main::before { top: -60px; right: -60px; }
        main::after { bottom: -80px; left: -40px; background: radial-gradient(circle, rgba(244, 114, 182, 0.25), transparent 75%); }
        .eyebrow {
            letter-spacing: 0.25em;
            font-size: 0.75rem;
            text-transform: uppercase;
            color: var(--muted);
        }
        .status-code {
            font-size: clamp(3.5rem, 12vw, 5rem);
            font-weight: 700;
            margin: 0.8rem 0 0.2rem;
            color: var(--accent);
        }
        h1 {
            font-size: 1.8rem;
            margin: 0 0 1rem;
        }
        p {
            margin: 0 0 2.25rem;
            color: var(--muted);
            line-height: 1.6;
        }
        .actions {
            display: flex;
            gap: 0.75rem;
            flex-wrap: wrap;
        }
        a {
            text-decoration: none;
            font-weight: 600;
            border-radius: 999px;
            padding: 0.85rem 1.5rem;
            border: 1px solid transparent;
            transition: transform 150ms ease, border 150ms ease, background 150ms ease;
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
        }
        .primary {
            background: linear-gradient(120deg, var(--accent), var(--accent-strong));
            color: #3b0a23;
        }
        .ghost {
            border-color: rgba(236, 72, 153, 0.35);
            color: var(--text);
        }
        a:hover {
            transform: translateY(-1px);
        }
        @media (max-width: 480px) {
            main { padding: 2.25rem 1.75rem; }
            .actions { flex-direction: column; }
            a { justify-content: center; }
        }
    </style>
</head>
<body>
<main>
    <div class="eyebrow">Hold up</div>
    <div class="status-code">403</div>
    <h1>You don’t have permission</h1>
    <p>Your account is active, but it doesn’t have access to this resource. If you think that’s a mistake, ask an administrator to update your permissions.</p>
    <div class="actions">
        <a class="primary" href="{{ url('/') }}">Go to dashboard</a>
        <a class="ghost" href="mailto:{{ config('mail.from.address', 'support@example.com') }}">Contact support</a>
    </div>
</main>
</body>
</html>
