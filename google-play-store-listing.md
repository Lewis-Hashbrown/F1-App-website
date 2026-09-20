# Google Play store listing

For `com.f1widget`, the 2026 release. Replaces the old 2025 listing, which named the wrong app,
the wrong season, and claimed the app collects no data.

Copy the text below straight into Play Console.

---

## App name (30 max)

```
F1 Race Widgets
```

19 characters.

## Short description (80 max)

```
Every F1 2026 session on your home screen, in your own time zone. No ads.
```

72 characters.

## Full description (4000 max)

```
Put the whole Formula 1 race weekend on your home screen.

F1 Race Widgets shows every session of the next Grand Prix, converted to your own time zone, without opening anything. Practice, qualifying, sprint and race, all at a glance.

FIVE WIDGET SIZES
Pick the one that fits your home screen. Each has its own design, not a stretched copy of the others.
- 2x2 Compact
- 2x2 Tall
- 3x2 Medium
- 4x2 Wide
- 4x3 Large

YOUR TIME ZONE, AUTOMATICALLY
Session times are converted for you, wherever you are. No working out what 14:00 CET means on a Sunday afternoon. Daylight saving is handled too.

THE WHOLE 2026 SEASON
All 24 rounds are built into the app. Sprint weekends show the sprint sessions in the right order. The widget always moves on to whatever is next.

REMINDERS YOU CHOOSE
Get a notification before the sessions you care about. Pick which ones, and how long before. Turn off the ones you do not want.

WORKS OFFLINE
The calendar lives inside the app. Looking up a session time sends nothing over the internet and works with no signal.

NO ADS, NO TRACKING
No adverts. No analytics. No advertising ID. The schedule, the widgets and the reminders are free and stay free.

TEAM AND DRIVER THEME PACKS
Give your widget your team's colours or your driver's number. 11 teams and 22 drivers, drawn to match every widget size.

Try all 33 themes free for 14 days. Sign in with Google to start it. It ends by itself. There is no subscription, nothing to cancel, and we never ask for payment details to start it.

After that, keep the Standard look for free, or buy the themes you want. Each theme is a one-time payment through Google Play, never a subscription. Buy the full 2026 collection and themes you already own come off the price.

WHAT IS FREE
- Every widget size
- The full 2026 calendar
- Time zone conversion
- Session reminders
- The Standard theme

WHAT COSTS MONEY
- Team and driver Theme Packs, as one-time purchases

PRIVACY
The schedule needs no account and sends nothing. If you start the theme trial you sign in with Google, and we store your account details and trial date so each account gets one trial. You can ask us to delete that at any time. Full details: https://f1-schedule-widgets.netlify.app/privacy-policy.html

F1 Race Widgets is an unofficial app made by an independent developer. It is not associated with, endorsed by, or connected to Formula 1, the FIA, or any team or driver.
```

## What's new (500 max)

```
The 2026 season, and a rebuilt widget.

- All 24 rounds of the 2026 calendar
- Five widget sizes, each with its own design
- Team and driver Theme Packs, with a 14-day free trial
- Clearer reminders, with per-session control
- Widget list now runs smallest to largest
- Faster, tidier home screen

The schedule, widgets and reminders stay free.
```

## Category and rating

- Category: Sports
- Content rating: Everyone
- Contains ads: **No**
- In-app purchases: **Yes** - GBP 1.99 per theme, GBP 4.99 for the collection

## Contact

- Email: Lewisbrown2208@gmail.com
- Website: https://f1-schedule-widgets.netlify.app
- Privacy policy: https://f1-schedule-widgets.netlify.app/privacy-policy.html

---

## Graphics still needed

| Asset | Requirement | Status |
|---|---|---|
| App icon | 512 x 512 PNG | Ready - `design/play_store_icon_512.png` in the app repo |
| Feature graphic | 1024 x 500 PNG or JPEG | **Missing. Play will not publish without it.** |
| Phone screenshots | 2 to 8, PNG or JPEG | Need exporting as PNG |
| Tablet screenshots | Optional | None |

Website screenshots live in `assets/screens/` and `assets/sizes/`, but they are WebP and Play needs
PNG or JPEG, so they need converting before upload.

### Suggested screenshots, in order

1. Widgets on a real home screen - the thing people are actually buying
2. The five sizes side by side
3. A team theme and a driver theme
4. The reminder settings
5. The race schedule page

---

## Data safety form

This must match the privacy policy, or Google can reject or remove the app. The old listing claimed
no data was collected, which is no longer true.

Declare **collected and linked to the user**, for the free trial only:

| Data | Purpose |
|---|---|
| Email address | Account management - one trial per Google account |
| Name | Account management |
| User ID (Firebase) | Account management |
| Approximate location from IP | App functionality and fraud prevention |

Also declare:

- Encrypted in transit: **Yes**
- Users can request deletion: **Yes**, at https://f1-schedule-widgets.netlify.app/privacy-policy.html#delete
- Shared with third parties: **No**
- Used for advertising: **No**
