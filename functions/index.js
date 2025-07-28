const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Email configuration
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: functions.config().email.user,
        pass: functions.config().email.pass
    }
});

// Cloud Function to handle lead submissions
exports.submitLead = functions.https.onCall(async (data, context) => {
    try {
        // Validate required fields
        const requiredFields = ['name', 'phone', 'email', 'propertyType', 'timeframe', 'budget'];
        for (const field of requiredFields) {
            if (!data[field]) {
                throw new functions.https.HttpsError('invalid-argument', `Missing required field: ${field}`);
            }
        }

        // Extract affiliate ID
        const affiliateId = data.affiliateId || 'direct';
        
        // Create lead document
        const leadData = {
            name: data.name,
            phone: data.phone,
            email: data.email,
            propertyType: data.propertyType,
            timeframe: data.timeframe,
            budget: data.budget,
            affiliateId: affiliateId,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            userAgent: data.userAgent || '',
            referrer: data.referrer || '',
            status: 'new'
        };

        // Save to Firestore
        const leadRef = await admin.firestore().collection('leads').add(leadData);

        // Update affiliate's lead count
        if (affiliateId !== 'direct') {
            const affiliateRef = admin.firestore().collection('affiliates').where('affiliateId', '==', affiliateId);
            const affiliateSnapshot = await affiliateRef.get();
            
            if (!affiliateSnapshot.empty) {
                const affiliateDoc = affiliateSnapshot.docs[0];
                await affiliateDoc.ref.update({
                    leadsGenerated: admin.firestore.FieldValue.increment(1)
                });
            }
        }

        // Send email notification
        const emailContent = `
            <h2>New Lead Submission - RE/MAX VIP Belize</h2>
            <p><strong>Lead ID:</strong> ${leadRef.id}</p>
            <p><strong>Affiliate ID:</strong> ${affiliateId}</p>
            <hr>
            <h3>Lead Details:</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Property Type:</strong> ${data.propertyType}</p>
            <p><strong>Timeframe:</strong> ${data.timeframe}</p>
            <p><strong>Budget:</strong> ${data.budget}</p>
            <hr>
            <p><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>User Agent:</strong> ${data.userAgent || 'Not provided'}</p>
            <p><strong>Referrer:</strong> ${data.referrer || 'Direct'}</p>
        `;

        const mailOptions = {
            from: functions.config().email.user,
            to: 'chris@remaxvipbelize.com',
            subject: `New Lead: ${data.name} - ${data.propertyType} (${affiliateId})`,
            html: emailContent
        };

        await transporter.sendMail(mailOptions);

        return {
            success: true,
            message: 'Lead submitted successfully',
            leadId: leadRef.id
        };

    } catch (error) {
        console.error('Error submitting lead:', error);
        throw new functions.https.HttpsError('internal', 'Error submitting lead: ' + error.message);
    }
});

// Cloud Function to get analytics data
exports.getAnalytics = functions.https.onCall(async (data, context) => {
    try {
        // Verify admin authentication
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
        }

        const analytics = {};

        // Get total leads
        const leadsSnapshot = await admin.firestore().collection('leads').get();
        analytics.totalLeads = leadsSnapshot.size;

        // Get total affiliates
        const affiliatesSnapshot = await admin.firestore().collection('affiliates').get();
        analytics.totalAffiliates = affiliatesSnapshot.size;

        // Get monthly leads
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyLeadsSnapshot = await admin.firestore()
            .collection('leads')
            .where('timestamp', '>=', startOfMonth)
            .get();
        analytics.monthlyLeads = monthlyLeadsSnapshot.size;

        // Get property type distribution
        const propertyTypes = {};
        leadsSnapshot.forEach(doc => {
            const propertyType = doc.data().propertyType;
            propertyTypes[propertyType] = (propertyTypes[propertyType] || 0) + 1;
        });
        analytics.propertyTypes = propertyTypes;

        // Get top affiliates
        const topAffiliatesSnapshot = await admin.firestore()
            .collection('affiliates')
            .orderBy('leadsGenerated', 'desc')
            .limit(10)
            .get();
        
        analytics.topAffiliates = topAffiliatesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return analytics;

    } catch (error) {
        console.error('Error getting analytics:', error);
        throw new functions.https.HttpsError('internal', 'Error getting analytics: ' + error.message);
    }
});

// Cloud Function to export leads
exports.exportLeads = functions.https.onCall(async (data, context) => {
    try {
        // Verify admin authentication
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
        }

        let query = admin.firestore().collection('leads');

        // Apply filters if provided
        if (data.filters) {
            if (data.filters.affiliateId) {
                query = query.where('affiliateId', '==', data.filters.affiliateId);
            }
            if (data.filters.propertyType) {
                query = query.where('propertyType', '==', data.filters.propertyType);
            }
            if (data.filters.dateFrom) {
                query = query.where('timestamp', '>=', new Date(data.filters.dateFrom));
            }
            if (data.filters.dateTo) {
                query = query.where('timestamp', '<=', new Date(data.filters.dateTo));
            }
        }

        const snapshot = await query.orderBy('timestamp', 'desc').get();
        
        const leads = [];
        snapshot.forEach(doc => {
            const lead = doc.data();
            leads.push({
                id: doc.id,
                name: lead.name,
                email: lead.email,
                phone: lead.phone,
                propertyType: lead.propertyType,
                timeframe: lead.timeframe,
                budget: lead.budget,
                affiliateId: lead.affiliateId,
                timestamp: lead.timestamp.toDate().toISOString(),
                status: lead.status
            });
        });

        return {
            success: true,
            leads: leads,
            count: leads.length
        };

    } catch (error) {
        console.error('Error exporting leads:', error);
        throw new functions.https.HttpsError('internal', 'Error exporting leads: ' + error.message);
    }
});

// Cloud Function to manage affiliates
exports.manageAffiliate = functions.https.onCall(async (data, context) => {
    try {
        // Verify admin authentication
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
        }

        const { action, affiliateData } = data;

        switch (action) {
            case 'create':
                const newAffiliate = {
                    ...affiliateData,
                    affiliateId: generateAffiliateId(),
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    leadsGenerated: 0
                };
                const docRef = await admin.firestore().collection('affiliates').add(newAffiliate);
                return { success: true, affiliateId: docRef.id };

            case 'update':
                await admin.firestore().collection('affiliates').doc(affiliateData.id).update({
                    name: affiliateData.name,
                    email: affiliateData.email,
                    phone: affiliateData.phone,
                    commission: affiliateData.commission
                });
                return { success: true };

            case 'delete':
                await admin.firestore().collection('affiliates').doc(affiliateData.id).delete();
                return { success: true };

            default:
                throw new functions.https.HttpsError('invalid-argument', 'Invalid action');
        }

    } catch (error) {
        console.error('Error managing affiliate:', error);
        throw new functions.https.HttpsError('internal', 'Error managing affiliate: ' + error.message);
    }
});

// Helper function to generate affiliate ID
function generateAffiliateId() {
    return 'AFF_' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Cloud Function to send test email
exports.sendTestEmail = functions.https.onCall(async (data, context) => {
    try {
        const mailOptions = {
            from: functions.config().email.user,
            to: 'chris@remaxvipbelize.com',
            subject: 'Test Email - RE/MAX VIP Belize Admin',
            html: `
                <h2>Test Email</h2>
                <p>This is a test email to verify the email configuration is working correctly.</p>
                <p>Time: ${new Date().toLocaleString()}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Test email sent successfully' };

    } catch (error) {
        console.error('Error sending test email:', error);
        throw new functions.https.HttpsError('internal', 'Error sending test email: ' + error.message);
    }
}); 