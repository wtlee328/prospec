# API Input Validation Fix

## Issues Resolved

### 1. Empty Fields Being Sent to API

**Problem:** All form fields were being sent to the API, including empty arrays
and undefined values, causing validation errors.

**Solution:** Modified `app/actions/crawl.ts` to filter out empty fields before
sending to the API.

### 2. Email Status Format Mismatch

**Problem:** The UI used "Verified" and "Guessed" (title case), but the API
expects "validated" and "guessed" (lowercase).

**Solution:** Added mapping in `crawl.ts` to convert email status values to the
correct lowercase format:

- "Verified" → "validated"
- "Guessed" → "guessed"

### 3. Revenue Validation Error

**Problem:** Error message indicated `min_revenue` must match allowed values.

**Solution:** The `REVENUE_RANGES` constant in `Finder.tsx` already had the
correct format ("100K", "500K", etc.). The issue was that empty revenue fields
were being sent. This is now fixed by the empty field filtering.

## Changes Made

### File: `app/actions/crawl.ts`

**Key Changes:**

1. Created a helper function `addIfNotEmpty()` that only adds fields to the
   input object if they have values
2. For arrays, only adds them if `length > 0`
3. For strings, only adds them if not empty, null, or undefined
4. Added email status mapping to convert UI values to API-expected values

**Example Output Format:**

```json
{
    "fetch_count": 5,
    "file_name": "Prospects",
    "company_industry": ["luxury goods & jewelry"],
    "contact_job_title": ["Manager"],
    "contact_location": ["new york, us"],
    "email_status": ["validated"]
}
```

## Field Format Reference

### Fields That Must Be Lowercase:

- `contact_location` - e.g., "united states", "new york, us"
- `company_industry` - e.g., "luxury goods & jewelry"
- `email_status` - "validated" or "guessed"

### Fields That Use Title Case:

- `seniority_level` - e.g., "Owner", "Partner", "CXO", "VP"
- `functional_level` - e.g., "Engineering", "Sales", "Marketing"

### Fields With Specific Format:

- `min_revenue` / `max_revenue` - Must be one of: "100K", "500K", "1M", "5M",
  "10M", "25M", "50M", "100M", "500M", "1B", "5B", "10B"
- `size` - e.g., "1-10", "11-50", "51-200"

## Testing

Build verification: ✅ Passed

```bash
npm run build
```

The application now correctly:

1. Only sends fields with actual values to the API
2. Maps email status to the correct lowercase format
3. Sends all other fields in the format expected by the API
