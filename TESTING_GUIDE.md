# Quick Testing Guide

## Test the Implementation

### Prerequisites
- Application running at http://localhost:3000
- Browser with localStorage enabled
- Developer console open (optional, for debugging)

### Test Scenario 1: Video Generation Flow

1. **Navigate to AI Generator**
   - Scroll to "Creator Studio Beta" section
   - Verify you see "Free Video Generations: 2 of 2 remaining"

2. **First Video Generation**
   - Click "Video" tab (should be selected by default)
   - Verify prompt is pre-filled
   - Click "Generate Free Video"
   - Wait for generation to complete (~30-60 seconds)
   - **Expected:** Counter updates to "1 of 2 remaining"
   - **Expected:** Preview shows video with controls
   - **Expected:** "Download HD" button is visible

3. **Download First Video**
   - Click "Download HD" button
   - **Expected:** File downloads as `krisskross-video-[timestamp].mp4`
   - **Expected:** Video plays in your media player

4. **Second Video Generation**
   - Click "Try Another" button
   - Modify prompt or keep as is
   - Click "Generate Free Video"
   - Wait for generation
   - **Expected:** Counter updates to "0 of 2 remaining"
   - **Expected:** Can preview and download

5. **Third Video Attempt (Limit Reached)**
   - Click "Try Another" button
   - Click "Generate Free Video"
   - **Expected:** Signup modal appears immediately
   - **Expected:** Banner shows "🎉 You've used your free generations!"
   - **Expected:** No generation starts

### Test Scenario 2: Image Generation Flow

1. **Switch to Image Mode**
   - Close signup modal (if open)
   - Click "Image" tab
   - **Expected:** Counter shows "Free Image Generations: 2 of 2 remaining"
   - **Expected:** Video counter is independent (still at 0)

2. **First Image Generation**
   - Verify image prompt is pre-filled
   - Click "Generate Free Image"
   - Wait for generation
   - **Expected:** Counter updates to "1 of 2 remaining"
   - **Expected:** Preview shows generated image
   - **Expected:** "Download HD" button is visible

3. **Download First Image**
   - Click "Download HD" button
   - **Expected:** File downloads as `krisskross-image-[timestamp].png`

4. **Second Image Generation**
   - Click "Try Another"
   - Click "Generate Free Image"
   - **Expected:** Counter updates to "0 of 2 remaining"
   - **Expected:** Can preview and download

5. **Third Image Attempt (Limit Reached)**
   - Click "Try Another"
   - Click "Generate Free Image"
   - **Expected:** Signup modal appears
   - **Expected:** Context banner visible

### Test Scenario 3: Persistence

1. **Refresh Page**
   - Refresh browser (F5 or Cmd+R)
   - Scroll to AI Generator
   - **Expected:** Video counter still shows "0 of 2 remaining"
   - **Expected:** Image counter still shows "0 of 2 remaining"
   - **Expected:** Limits are enforced

2. **Clear localStorage (Reset)**
   - Open browser console
   - Run: `localStorage.removeItem('krisskross_generations')`
   - Refresh page
   - **Expected:** Both counters reset to "2 of 2 remaining"

### Test Scenario 4: UI/UX Details

1. **Counter Visual Feedback**
   - When remaining > 0: Text should be blue/primary color
   - When remaining = 0: Text should be gray/muted

2. **Download Button**
   - Should be prominent (primary blue)
   - Should show download icon
   - Should work without requiring signup

3. **Signup Modal**
   - Should only show context banner when triggered by limit
   - Should not show banner when opened from other CTAs
   - Should be dismissible (X button or click outside)

4. **Mode Switching**
   - Switching between Video/Image should update counter display
   - Should show correct remaining count for each type
   - Should maintain separate limits

### Expected localStorage Data

After using all free generations, check localStorage:
```javascript
// In browser console:
JSON.parse(localStorage.getItem('krisskross_generations'))

// Should return something like:
[
  {
    "type": "video",
    "timestamp": 1735459200000,
    "id": "video-1735459200000-abc123"
  },
  {
    "type": "video",
    "timestamp": 1735459300000,
    "id": "video-1735459300000-def456"
  },
  {
    "type": "image",
    "timestamp": 1735459400000,
    "id": "image-1735459400000-ghi789"
  },
  {
    "type": "image",
    "timestamp": 1735459500000,
    "id": "image-1735459500000-jkl012"
  }
]
```

## Troubleshooting

### Counter Not Updating
- Check browser console for errors
- Verify localStorage is enabled
- Try hard refresh (Cmd+Shift+R)

### Download Not Working
- Check if popup blocker is enabled
- Verify video/image URL is valid
- Check network tab for CORS errors

### Generation Fails
- Check API key is set in `.env.local`
- Verify BytePlus API is responding
- Check console for error messages

### Signup Modal Not Appearing
- Verify you've used both free generations
- Check `remainingGenerations` state in React DevTools
- Clear localStorage and try again

## Debug Commands

```javascript
// Check current state
localStorage.getItem('krisskross_generations')

// Check counts
const counts = JSON.parse(localStorage.getItem('krisskross_generations') || '[]')
console.log('Videos:', counts.filter(r => r.type === 'video').length)
console.log('Images:', counts.filter(r => r.type === 'image').length)

// Reset everything
localStorage.removeItem('krisskross_generations')
location.reload()

// Add fake generations (for testing)
localStorage.setItem('krisskross_generations', JSON.stringify([
  { type: 'video', timestamp: Date.now(), id: 'test-1' },
  { type: 'video', timestamp: Date.now(), id: 'test-2' }
]))
location.reload()
```

## Success Criteria

✅ User can generate 2 videos without signup
✅ User can download both videos
✅ Third video attempt shows signup modal
✅ User can generate 2 images without signup
✅ User can download both images
✅ Third image attempt shows signup modal
✅ Counters are independent (video vs image)
✅ Limits persist across page refreshes
✅ UI updates in real-time
✅ Download functionality works for both types
✅ Signup modal shows context-aware messaging
