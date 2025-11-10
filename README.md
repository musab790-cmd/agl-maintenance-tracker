# AGL MCT Airfield Maintenance Tracker

**Version:** 3.0.6  
**Last Updated:** November 10, 2025  
**Latest Feature:** Mission Time Filtering

---

## 📋 Overview

The AGL MCT Airfield Maintenance Tracker is a comprehensive web-based application designed for managing preventive and corrective maintenance tasks at MCT Airfield. The system features real-time synchronization across all devices using Firebase, photo documentation, PDF reporting, and task management capabilities.

---

## 🌟 Key Features

### Real-Time Synchronization
- ✅ **Multi-Device Sync**: Changes sync instantly between phone, laptop, tablet, and any other device
- ✅ **Firebase Integration**: Cloud-based real-time database for reliable data storage
- ✅ **Automatic Conflict Resolution**: Seamless data merging across devices
- ✅ **Visual Sync Status**: Green indicator shows connection status

### Task Management
- 📅 **PPM Tasks** (Preventive Maintenance):
  - Daily, Weekly, Monthly, Quarterly frequencies
  - Day/Night shift assignments
  - Equipment type tracking
  - Photo documentation
  - Status tracking (Pending, In Progress, Completed, Overdue)

- 🔧 **CM Tasks** (Corrective Maintenance):
  - Work order management
  - Priority levels (Critical, High, Medium, Low)
  - Location tracking
  - Reporter and assignee tracking
  - Photo evidence
  - Status tracking (Open, In Progress, Pending Parts, Resolved)

### Reporting & Documentation
- 📊 **PDF Reports**: Generate comprehensive reports with photo thumbnails
- 🚁 **Mission Time Filtering**: Track task updates during specific time windows (NEW in v3.0.6)
- 📸 **Photo Attachments**: Multiple photos per task with visual previews
- 📈 **Dashboard Statistics**: Real-time overview of task status
- 🔍 **Filtering**: Filter by shift, status, date ranges, and mission time

### User Interface
- 🎨 **Modern Design**: Clean, professional interface
- 📱 **Mobile Responsive**: Works seamlessly on all devices
- 🔄 **View Toggle**: Easy switching between PPM and CM views
- ⚡ **Fast Performance**: Optimized for quick loading and operation

---

## 📁 Project Structure

```
webapp/
├── index.html              # Main application UI
├── app.js                  # Core application logic with Firebase sync
├── styles.css              # Application styling
├── firebase-config.js      # Firebase configuration
├── config.html             # Configuration page for Teams integration
├── import_tasks.html       # Task import utility
├── index.html.backup       # Backup of previous index
│
├── docs/                   # Documentation folder
│   ├── README-v3.0.5.md                # Version-specific documentation
│   ├── DEPLOYMENT-GUIDE-v3.0.5.md      # Deployment instructions
│   ├── TESTING-GUIDE-v3.0.5.md         # Testing procedures
│   ├── FIREBASE-SETUP-GUIDE.md         # Firebase setup instructions
│   ├── SYNC-TESTING-GUIDE.md           # Sync testing procedures
│   ├── MISSION-TIME-FILTERING-GUIDE.md # Mission time filtering guide (NEW)
│   ├── MISSION-TIME-QUICK-REFERENCE.md # Mission time quick reference (NEW)
│   ├── CHANGELOG-v3.0.5.md             # Latest changes
│   ├── CHANGELOG-v3.0.1.md             # Sync fix changes
│   ├── CHANGELOG-v3.0.md               # Firebase integration
│   ├── CHANGELOG-v2.3.2.md             # Previous version changes
│   ├── UPDATE-HISTORY-GUIDE.md         # Update tracking guide
│   ├── FIX-CM-TASKS.md                 # CM tasks fixes
│   ├── FIX-CM-MODAL.md                 # CM modal fixes
│   ├── FIX-CM-DASHBOARD.md             # CM dashboard fixes
│   ├── QUICK-FIX-README.md             # Quick fixes documentation
│   └── manifest.json                   # Teams app manifest
│
├── css/                    # (Legacy folder - can be removed)
└── js/                     # (Legacy folder - can be removed)
```

---

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for Firebase sync)
- Firebase project configured (see Firebase Setup Guide)

### Installation

1. **Clone or Download** this repository to your web server
2. **Configure Firebase**:
   - Open `firebase-config.js`
   - Update with your Firebase project credentials
3. **Deploy**:
   - Upload all files to your web hosting service
   - Ensure `index.html` is set as the default page
4. **Access**:
   - Open the application URL in your browser
   - Check for green "Synced" indicator in top-right corner

### First Time Setup

1. **Verify Connection**: Look for green sync status indicator
2. **Add Test Task**: Create a test PPM or CM task
3. **Test Multi-Device**: Open on another device and verify sync
4. **Configure Users**: Set up user names for assignment tracking

---

## 📖 User Guide

### Adding PPM Tasks

1. Click **"+ Add PPM Task"** button
2. Fill in the form:
   - Description of maintenance task
   - Equipment type
   - Maintenance frequency (Daily/Weekly/Monthly/Quarterly)
   - Due date
   - Shift assignments (Day/Night)
3. (Optional) Upload photos
4. Click **"Add Task"**
5. Task appears immediately and syncs to all devices

### Adding CM Tasks

1. Click **"🔧 CM Tasks"** to switch to CM view
2. Click **"+ Add CM"** button
3. Fill in the form:
   - Work Order number
   - Description of issue
   - Priority level
   - Location
   - Reported by
   - Date reported
   - Status
   - Assigned to
4. (Optional) Upload photos
5. Click **"Add Task"**
6. Task appears in CM view and syncs across devices

### Managing Tasks

- **Edit**: Click the edit icon (✏️) next to any task
- **Delete**: Click the delete icon (🗑️) to remove a task
- **View Photos**: Click the photo icon (📷) to view attached images
- **Update Status**: Use the status dropdown to change task status
- **Assign**: Update assignee fields to assign tasks to team members

### Generating Reports

1. Click **"Generate Report"** button
2. Select date range (From/To dates)
3. Click **"Generate PDF Report"**
4. PDF opens in new tab with:
   - PPM and CM task summaries
   - Photo thumbnails for each task
   - Complete task details
   - Status indicators

### Filtering Tasks

- **PPM View**: Use shift filter (All/Day/Night)
- **CM View**: Use status filter (All/Open/In Progress/etc.)
- Filters apply immediately without page reload

---

## 🔧 Technical Details

### Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Database**: Firebase Realtime Database (v9.22.0)
- **PDF Generation**: jsPDF library (v2.5.1)
- **Teams Integration**: Microsoft Teams JS SDK (v2.19.0)

### Firebase Structure

```
firebase-root/
├── ppmTasks/
│   └── [taskId]/
│       ├── description
│       ├── equipmentType
│       ├── frequency
│       ├── dueDate
│       ├── shift
│       ├── dayShiftAssignee
│       ├── nightShiftAssignee
│       ├── status
│       ├── photos[]
│       └── lastUpdated
│
└── cmTasks/
    └── [taskId]/
        ├── workOrder
        ├── description
        ├── priority
        ├── location
        ├── reportedBy
        ├── dateReported
        ├── status
        ├── assignedTo
        ├── photos[]
        └── lastUpdated
```

### Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🔐 Security Notes

- Firebase security rules should be configured in production
- Current configuration uses open read/write for development
- Implement authentication for production deployment
- Review Firebase console for security recommendations

---

## 📊 Version History

### v3.0.6 (Current) - Mission Time Filtering
- Added mission time report type for operational debriefs
- Filter tasks by exact datetime ranges (not just dates)
- Track task updates during specific mission windows
- Timestamp-based filtering using updatedAt field
- Perfect for mission debriefs, shift handovers, and incident investigation
- See `docs/MISSION-TIME-FILTERING-GUIDE.md` for full details

### v3.0.5 - PDF Photo Thumbnails
- Added visual photo thumbnails to PDF reports
- Both PPM and CM tasks show photo previews
- Improved PDF report layout and organization

### v3.0.1 - Firebase Sync Fix
- Fixed cross-device synchronization issues
- Added sync flag to prevent listener loops
- Improved async save operations

### v3.0 - Firebase Real-Time Sync
- Integrated Firebase Realtime Database
- Multi-device synchronization
- Cloud-based data storage

### v2.3.2 - Enhanced PDF Reports
- Added update history tracking
- Photo evidence tracking in reports
- Assignment information display

---

## 📝 Documentation

Comprehensive documentation available in the `/docs` folder:

- **Setup & Deployment**:
  - `FIREBASE-SETUP-GUIDE.md` - Complete Firebase setup instructions
  - `DEPLOYMENT-GUIDE-v3.0.5.md` - Deployment procedures

- **Testing**:
  - `TESTING-GUIDE-v3.0.5.md` - Testing procedures for v3.0.5
  - `SYNC-TESTING-GUIDE.md` - How to test Firebase sync

- **Version History**:
  - `CHANGELOG-v3.0.5.md` - Latest changes
  - `CHANGELOG-v3.0.1.md` - Sync fix changes
  - `CHANGELOG-v3.0.md` - Firebase integration details
  - `CHANGELOG-v2.3.2.md` - Previous version changes

- **Issue Fixes**:
  - `FIX-CM-TASKS.md` - CM tasks display issues
  - `FIX-CM-MODAL.md` - CM modal form fixes
  - `FIX-CM-DASHBOARD.md` - Dashboard display fixes

---

## 🆘 Troubleshooting

### Sync Status Shows "Offline" or "Error"

1. **Check Internet Connection**: Ensure device is connected
2. **Verify Firebase Config**: Check `firebase-config.js` credentials
3. **Check Browser Console**: Press F12 to view error messages
4. **Firebase Status**: Visit firebase.google.com to check service status

### Tasks Not Appearing on Other Devices

1. **Verify Sync Status**: Both devices should show green "Synced"
2. **Clear Browser Cache**: Hard refresh with Ctrl+Shift+R
3. **Check Firebase Console**: Verify data is being saved
4. **Review Logs**: Check browser console for sync errors

### Photos Not Displaying in PDF

1. **Check Photo Format**: Ensure JPG/PNG format
2. **File Size**: Large files may cause issues (keep under 2MB)
3. **Browser Support**: Try different browser if issues persist

### Cannot Add Tasks

1. **Check Form Fields**: Ensure all required fields are filled
2. **Firebase Connection**: Verify green sync status
3. **Browser Console**: Check for JavaScript errors
4. **Try Different Browser**: Test in alternative browser

---

## 🤝 Support & Maintenance

### Reporting Issues

When reporting issues, please include:
- Browser and version
- Device type (phone/laptop/tablet)
- Steps to reproduce the issue
- Screenshots if applicable
- Browser console errors (F12 > Console tab)

### Regular Maintenance

1. **Monitor Firebase Usage**: Check Firebase console for quota limits
2. **Backup Data**: Export data periodically from Firebase
3. **Update Dependencies**: Keep libraries updated for security
4. **Review Logs**: Check for recurring errors or issues

---

## 📄 License

This application is proprietary software developed for AGL Aviation MCT Airfield operations.

---

## 👥 Credits

**Development**: AGL Aviation Technical Team  
**Firebase Integration**: v3.0 Major Update  
**PDF Enhancements**: v3.0.5 Release

---

## 📞 Contact

For technical support or questions:
- Contact your IT administrator
- Check documentation in `/docs` folder
- Review Firebase Setup Guide for configuration issues

---

**Last Updated**: November 10, 2025  
**Application Version**: 3.0.5  
**Documentation Version**: 1.0
