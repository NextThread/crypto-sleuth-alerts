
// This file is for reference only - actual rules are set in Firebase console
// To fix the permission issues, you need to update your Firebase rules in the Firebase console

/*
// Firestore rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to forum posts
    match /forumPosts/{postId} {
      allow read: if true;
      allow create: if request.resource.data.author.id != null;
      allow delete: if request.auth != null && (request.auth.uid == resource.data.author.id || request.auth.uid == 'admin');
    }
    
    // Add other collection rules as needed
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
*/

export const firebaseRulesInfo = `
To fix permission issues with the community forum, please update your Firebase security rules in the Firebase console:

1. Go to Firebase console (https://console.firebase.google.com/)
2. Select your project "market-mirror-insights"
3. Navigate to Firestore Database > Rules
4. Update the rules to allow guest posting by replacing the current rules with:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to forum posts
    match /forumPosts/{postId} {
      allow read: if true;
      allow create: if true;  // Allow anyone to create posts
      allow delete: if request.auth != null && (request.auth.uid == resource.data.author.id || request.auth.uid == 'admin');
    }
    
    // Add other collection rules as needed
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
`;
