// IMPORTANT: This file is used for server-side Firebase operations.
// It initializes the Admin SDK, which has elevated privileges.
// Do NOT import or use this file on the client-side.

import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';


// This is a simplified check. In a real-world scenario, you'd use
// environment variables and potentially different service accounts for
// different environments (dev, staging, prod).
const isEmulator = process.env.FIRESTORE_EMULATOR_HOST;

let app: App;

if (!getApps().length) {
    if (isEmulator) {
        // When running in the emulator, the SDK can often auto-discover
        // the project ID. If not, you might need to specify it.
        app = initializeApp({
            projectId: 'studio-6166519591-99889'
        });
    } else {
        // For production, use service account credentials.
        // Make sure the GOOGLE_APPLICATION_CREDENTIALS environment variable is set.
        try {
            // Genkit/Vertex AI already handle authentication.
            // We don't need to provide credentials explicitly.
            app = initializeApp();
        } catch (error) {
            console.warn("Failed to initialize Firebase Admin with application default credentials. This is expected in local development without GOOGLE_APPLICATION_CREDENTIALS set.", error);
            // Fallback for local development without credentials
            app = initializeApp({
                projectId: 'studio-6166519591-99889'
            });
        }
    }
} else {
    app = getApps()[0];
}


export const firestore = getFirestore(app);
export const storage = getStorage(app);
