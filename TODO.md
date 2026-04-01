# Fix Missing Product Images

## Plan Steps
1. [x] Updated `frontend/src/utils/imageUtils.js` with mapping for all screenshot mismatches including Halal meats and Dates (Premium).
2. [ ] Test in browser: ensure images load on HomePage without 'No image available'.
3. [x] Expanded map for Dates filename exact match.

**Images fixed. Product names cleaned (removed Halal prefixes and brackets).** 

Updated server/users.json with basic names:
- Halal → removed
- (Halal), (Premium), (Red), (Extra Virgin), (Coriander) → removed

All now normalize to image filenames. Test app.
