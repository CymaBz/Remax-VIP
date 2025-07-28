# RE/MAX VIP Belize - Affiliate Landing Page

A modern, responsive landing page for RE/MAX VIP Belize with integrated affiliate tracking and lead management system.

## 📋 **Important: Project Ownership**

**This is YOUR project!** You will:
- ✅ **Create your own Firebase project** (not your developer's)
- ✅ **Own all your data** (leads, affiliates, analytics)
- ✅ **Control your own Firebase account** and settings
- ✅ **Manage your own hosting** and domain
- ✅ **Have full access** to all admin features

Your developer is providing you with the source code only. You will set up and manage your own Firebase backend.

## 🚀 Quick Start Guide

### For Non-Technical Users (FTP Deployment)

If you're using traditional web hosting with FTP, follow these simple steps:

#### 1. Basic Setup (5 minutes)
1. **Set up your own Firebase project** (see detailed instructions below)
2. **Get your Firebase configuration** from your Firebase project
3. **Update the config** in both `index.html` and `admin.html` files
4. **Upload files** to your web server via FTP
5. **Set up email** for notifications
6. **Create admin user** in Firebase Console

#### 2. FTP Upload Instructions
1. Connect to your web server via FTP
2. Upload these files to your website's root directory:
   - `index.html`
   - `admin.html`
   - `images/` folder (with all images)
3. Make sure `index.html` is set as your default page

#### 3. Firebase Setup (One-time)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "RE/MAX VIP Belize" (or your preferred name)
3. Enable these services:
   - **Authentication** (for admin login)
   - **Firestore Database** (for storing data)
   - **Cloud Functions** (for email notifications)
4. Get your Firebase configuration (see details below)

---

## 📋 Detailed Setup Instructions

### Step 1: Firebase Project Setup

#### Create Your Own Firebase Project
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Name: `vip-affiliates-d265a` (or your preferred name)
4. Follow the setup wizard
5. **Important**: This will be YOUR Firebase project, not your developer's

#### Enable Required Services
1. **Authentication**:
   - Go to "Authentication" → "Get started"
   - Enable "Email/Password"
   - Add admin user (email + password)

2. **Firestore Database**:
   - Go to "Firestore Database" → "Create database"
   - Choose "Start in test mode"
   - Select location (choose closest to your users)

3. **Cloud Functions**:
   - Go to "Functions" → "Get started"
   - This enables serverless functions

### Step 2: Get Your Firebase Configuration

1. Go to "Project settings" (gear icon)
2. Scroll to "Your apps" section
3. Click web icon (</>) → "Add app"
4. Name: "RE/MAX VIP Belize"
5. Copy the configuration object (this is YOUR unique configuration)

### Step 3: Update Configuration Files

#### Update `index.html`
1. Open `index.html` in a text editor
2. Find this section (around line 400):
   ```javascript
   const firebaseConfig = {
       apiKey: "AIzaSyB52c9xY0eH7fOy0B0D53_2jxnSurigS1M",
       authDomain: "vip-affiliates-d265a.firebaseapp.com",
       projectId: "vip-affiliates-d265a",
       storageBucket: "vip-affiliates-d265a.appspot.com",
       messagingSenderId: "556620380247",
       appId: "1:556620380247:web:affiliate-system"
   };
   ```
3. **Already updated** with your Firebase project configuration

#### Update `admin.html`
1. Open `admin.html` in a text editor
2. Find the same Firebase config section
3. **Already updated** with your Firebase project configuration

### Step 4: Email Configuration

#### Set Up Gmail for Notifications
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use this app password (not your regular password)

#### Configure Email in Firebase
1. Open terminal/command prompt
2. Install Firebase CLI: `npm install -g firebase-tools`
3. Login to YOUR Firebase project: `firebase login`
4. Set email config for YOUR project:
   ```bash
   firebase functions:config:set email.user="your-email@gmail.com"
   firebase functions:config:set email.pass="your-app-password"
   ```

### Step 5: Deploy to Your Server

#### Option A: FTP Upload (Recommended for non-technical users)
1. **Prepare files**:
   - Ensure all images are in the `images/` folder
   - Check that Firebase config is updated in both HTML files
   
2. **Upload via FTP**:
   - Connect to your web server using FTP client
   - Upload these files to your website root:
     - `index.html`
     - `admin.html`
     - `images/` folder (with all contents)
   
3. **Set permissions**:
   - Make sure `index.html` is readable
   - Ensure images folder is accessible

#### Option B: Firebase Hosting (For technical users)
1. Install dependencies: `cd functions && npm install`
2. Deploy functions to YOUR project: `firebase deploy --only functions`
3. Deploy hosting to YOUR project: `firebase deploy --only hosting`

### Step 6: Create Admin User

1. Go to YOUR Firebase Console → Authentication → Users
2. Click "Add user"
3. Enter admin email and password
4. Remember these credentials for admin panel access

---

## 🎯 How to Use the System

### Landing Page
- **URL**: `your-domain.com` (or `your-domain.com/index.html`)
- **Purpose**: Main landing page for potential buyers
- **Features**: Property showcase, lead capture form, affiliate tracking

### Admin Panel
- **URL**: `your-domain.com/admin.html`
- **Login**: Use the admin credentials you created in Firebase
- **Features**: Manage affiliates, view leads, analytics

### Affiliate Links
- **Format**: `your-domain.com?affiliate=AFFILIATE_ID`
- **Example**: `your-domain.com?affiliate=AFF_ABC123`
- **Usage**: Share these links with affiliates

---

## 📊 Admin Panel Features

### Affiliate Management
1. **Create Affiliate**:
   - Name, email, phone, commission rate
   - System generates unique affiliate ID
   - Copy the generated affiliate link

2. **View Affiliates**:
   - List all active affiliates
   - See lead counts and performance
   - Edit or delete affiliates

### Lead Management
1. **View Leads**:
   - All form submissions with details
   - Filter by affiliate, property type, date
   - Export data to CSV

2. **Lead Details**:
   - Name, phone, email
   - Property preferences
   - Budget and timeframe
   - Affiliate attribution

### Analytics Dashboard
- Total leads and affiliates
- Monthly performance
- Top performing affiliates
- Property type preferences

---

## 🔧 Customization Options

### Update Content
- **Images**: Replace files in `images/` folder
- **Text**: Edit content in HTML files
- **Colors**: Modify CSS variables in the style section

### Modify Form Fields
- Add/remove form fields in `index.html`
- Update dropdown options
- Change validation rules

### Email Notifications
- Recipient email: `chris@remaxvipbelize.com`
- Customize email templates in Firebase Functions
- Add additional recipients if needed

---

## 🛠️ Troubleshooting

### Common Issues

#### Form Not Submitting
- Check Firebase configuration is correct
- Ensure Cloud Functions are deployed
- Verify email configuration is set

#### Admin Panel Not Loading
- Confirm Firebase config in `admin.html`
- Check admin user exists in Firebase Authentication
- Verify internet connection

#### Images Not Displaying
- Ensure `images/` folder is uploaded
- Check file permissions
- Verify image file names match HTML

#### Email Notifications Not Working
- Verify Gmail app password is correct
- Check Firebase Functions are deployed
- Confirm email configuration is set

### Getting Help
1. Check YOUR Firebase Console for error messages
2. Verify all configuration steps are completed
3. Contact your developer for technical support

---

## 📁 File Structure

```
your-website/
├── index.html              # Main landing page
├── admin.html              # Admin panel
├── images/                 # Property images
│   ├── logo.png           # RE/MAX logo
│   ├── hero.jpg           # Hero background
│   ├── condo.jpg          # Condo property
│   ├── residential.jpg    # Residential property
│   └── land.jpg           # Land property
└── README.md              # This file
```

---

## 🔒 Security Notes

- Admin panel requires Firebase authentication
- All data is stored securely in Firebase
- Email credentials are encrypted
- Affiliate tracking is automatic and secure

---

## 📞 Support

For technical support or questions:
- Check this README first
- Review Firebase Console for errors
- Contact your development team

---

**RE/MAX VIP Belize** - Professional Real Estate Solutions in Paradise 