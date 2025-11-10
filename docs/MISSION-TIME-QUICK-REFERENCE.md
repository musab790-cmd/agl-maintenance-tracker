# Mission Time Filtering - Quick Reference Card

**Version:** 3.0.6 | **Date:** November 10, 2025

---

## 🚁 Quick Start (30 seconds)

1. Click **"Generate Report"** button
2. Select **"🚁 Mission Time Report"** from dropdown
3. Set **Mission Start** and **Mission End** times
4. Click **"📄 Generate PDF Report"**

---

## 📋 What It Does

**Shows tasks that were UPDATED during a specific time window**

- ✅ Tasks created
- ✅ Tasks edited
- ✅ Status changed
- ✅ Photos added
- ✅ Assignees changed

---

## 🎯 Common Use Cases

| Scenario | Mission Start | Mission End | Result |
|----------|---------------|-------------|--------|
| **Flight Mission** | 05:00 | 07:00 | Tasks updated during flight |
| **Night Shift** | 20:00 | 08:00 (next day) | Night shift activity |
| **Emergency Response** | Incident time | +3 hours | Emergency maintenance |
| **Last 2 Hours** | Now - 2h | Now | Recent activity |

---

## 🔄 Mission Time vs Date Range

### Date Range Report (Original)
- **Filters by**: Due Date (PPM) or Date Reported (CM)
- **Shows**: Tasks scheduled/reported in date range
- **Example**: "Tasks due this month"

### Mission Time Report (NEW)
- **Filters by**: Last Update Timestamp (updatedAt)
- **Shows**: Tasks modified in time window
- **Example**: "Tasks updated during mission"

---

## ⚙️ Default Settings

When you open Mission Time Report:
- **Mission Start**: 2 hours ago
- **Mission End**: Now
- **Timezone**: Your local timezone
- **Format**: YYYY-MM-DD HH:MM

---

## 📊 Report Contents

### Summary Statistics:
- Total PPM tasks updated
- Total CM tasks updated
- Completion counts
- Priority counts
- Photo counts

### Detailed Lists:
- PPM task details with timestamps
- CM work orders with timestamps
- Photo thumbnails
- Assignee information

---

## 💡 Pro Tips

### Before Mission:
- Brief team on what will be tracked
- Ensure all devices have correct time
- Test report generation

### During Mission:
- Update tasks in real-time
- Upload photos as work progresses
- Use detailed status updates

### After Mission:
- Generate report within 1 hour
- Review during debrief
- Archive PDF with mission records

---

## 🚨 Common Issues

### "No tasks found"
**Solution**: 
- Widen time range
- Verify tasks were actually updated
- Check device clock

### "Missing tasks"
**Solution**:
- Viewing ≠ Updating (only edits count)
- Check mission time range
- Verify timezone

### "Wrong timestamps"
**Solution**:
- Check browser timezone settings
- Refresh page
- Verify device clock

---

## 🔑 Key Fields

### Tasks Now Track:
- **createdAt**: When task was created
- **updatedAt**: Last modification time
- Both fields sync across all devices via Firebase

### Timestamp Format:
```
2025-11-10T06:30:00.000Z
(Year-Month-Day T Hour:Minute:Second.Milliseconds UTC)
```

---

## 📱 Multi-Device Examples

### Scenario: Work Order WO-001

| Device | Time | Action | updatedAt Changes |
|--------|------|--------|-------------------|
| Phone | 05:15 | Create WO-001 | 05:15 |
| Laptop | 06:00 | Assign technician | 06:00 |
| Tablet | 06:45 | Mark in progress | 06:45 |

**Mission Report (05:00-07:00)**: Shows WO-001 with final timestamp 06:45

---

## 🎯 Best Practices

### ✅ DO:
- Set realistic time windows
- Include buffer time (±30 min)
- Update tasks as work happens
- Upload photos immediately
- Review reports promptly

### ❌ DON'T:
- Use too narrow time ranges
- Forget to update task status
- Delay photo uploads
- Ignore timezone differences
- Skip report review

---

## ⏱️ Performance

| Dataset Size | Report Time |
|--------------|-------------|
| <100 tasks | <1 second |
| 100-500 tasks | 1-2 seconds |
| 500+ tasks | 2-5 seconds |

---

## 🔗 Related Documentation

- **Full Guide**: `MISSION-TIME-FILTERING-GUIDE.md`
- **Main README**: `../README.md`
- **Testing Guide**: `TESTING-GUIDE-v3.0.5.md`
- **Firebase Setup**: `FIREBASE-SETUP-GUIDE.md`

---

## 📞 Quick Support

### Report Issues:
1. Note mission time range used
2. Expected vs actual results
3. Browser console errors (F12)
4. Missing task details

### Get Help:
- Read full guide in `docs/`
- Check browser console
- Verify Firebase connection
- Contact administrator

---

## 🎓 Training Checklist

- [ ] Read this quick reference
- [ ] Generate test mission report
- [ ] Verify timestamp display
- [ ] Test with team member
- [ ] Create sample debrief report
- [ ] Archive test report

---

## 📈 Feature Status

- **Version**: 3.0.6
- **Status**: ✅ Production Ready
- **Tested**: ✅ All devices
- **Firebase**: ✅ Fully synced
- **Performance**: ✅ Optimized

---

## 🚀 Quick Commands

### Open Report Modal:
Click "Generate Report" button in header

### Switch to Mission Time:
Select "🚁 Mission Time Report" from dropdown

### Set Default Range (Last 2 Hours):
Automatically set when modal opens

### Generate PDF:
Click "📄 Generate PDF Report"

### Export CSV:
Click "Export CSV Instead" (date range only)

---

## 🎯 Success Indicators

Your mission time report is working if:
- ✅ Tasks show correct update timestamps
- ✅ Photo counts match uploaded photos
- ✅ Status changes are reflected
- ✅ Multi-device updates appear
- ✅ PDF generates within 5 seconds

---

## 💾 Backup & Archive

### Recommended:
- Generate mission reports immediately after missions
- Save PDF reports with mission ID/name
- Archive in central document repository
- Keep for regulatory compliance period

---

**Print this card for quick reference during operations!**

---

**Last Updated**: November 10, 2025  
**Quick Reference Version**: 1.0  
**Compatible With**: AGL Maintenance Tracker v3.0.6+
