import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";

const corsHandler = cors({ origin: true });
admin.initializeApp();

export const consultationAPI = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      if (request.method !== 'POST') {
        response.status(405).json({ error: 'Method not allowed' });
        return;
      }

      const { name, email, phone, businessType, serviceType, message, area } = request.body;

      // Validation
      if (!name || !email || !phone || !area) {
        response.status(400).json({ error: 'Missing required fields' });
        return;
      }

      // Firestore-এ save করা
      const db = admin.firestore();
      const docRef = await db.collection('consultations').add({
        name,
        email,
        phone,
        businessType,
        serviceType,
        message,
        area,
        createdAt: admin.firestore.Timestamp.now(),
        status: 'pending',
        viewed: false,
      });

      // Email notification পাঠানো (optional - SendGrid/Mailgun দিয়ে)
      console.log('New consultation request:', docRef.id);

      response.json({
        success: true,
        id: docRef.id,
        message: 'আপনার অনুরোধ সফলভাবে জমা হয়েছে',
      });
    } catch (error) {
      console.error('Error:', error);
      response.status(500).json({ error: 'Internal server error' });
    }
  });
});