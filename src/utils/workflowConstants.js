// export const MANUSCRIPT_STATUS = {
//     SUBMITTED: 'SUBMITTED',
//     REJECTED_INITIAL: 'REJECTED_INITIAL',
//     WITH_ASSOCIATE_EDITOR: 'WITH_ASSOCIATE_EDITOR',
//     REJECTED_TECHNICAL: 'REJECTED_TECHNICAL',
//     UNDER_REVIEW: 'UNDER_REVIEW',
//     REVISION_REQUIRED: 'REVISION_REQUIRED',
//     REVIEW_COMPLETED: 'REVIEW_COMPLETED',
//     DECISION_PENDING: 'DECISION_PENDING',
//     REJECTED_FINAL: 'REJECTED_FINAL',
//     ACCEPTED: 'ACCEPTED',
//     PROD_LANGUAGE_EDITING: 'PROD_LANGUAGE_EDITING',
//     PROD_COPY_LAYOUT: 'PROD_COPY_LAYOUT',
//     PROD_PROOFREADING: 'PROD_PROOFREADING',
//     PROD_READY_TO_PUBLISH: 'PROD_READY_TO_PUBLISH',
//     PUBLISHED: 'PUBLISHED'
// };

// export const ROLES = {
//     ADMIN: 'admin',
//     MEMBER: 'member',
//     AUTHOR: 'author',
//     MANAGING_EDITOR: 'managing_editor',
//     ASSOCIATE_EDITOR: 'associate_editor',
//     EIC: 'editor_in_chief',
//     REVIEWER: 'reviewer',
//     PRODUCTION: 'production_staff'
// };

// export const ARTICLE_TYPES = ['Research Article', 'Review Paper', 'Short Communication', 'Case Study', 'Methodological Note'];
// export const SPECIALIZATIONS = ['Pure Mathematics', 'Applied Mathematics', 'Statistics', 'Computational Mathematics', 'Mathematics Education', 'Data Science', 'Other'];


// src/utils/workflowConstants.js

// export const MANUSCRIPT_STATUS = {
//     // 1. Author Submission
//     SUBMITTED: 'Submitted',
    
//     // 2. Initial Check (Managing Editor)
//     WITH_MANAGING_EDITOR: 'Initial Check',
    
//     // 3. Technical Assessment (Associate Editor)
//     WITH_ASSOCIATE_EDITOR: 'Technical Assessment',
    
//     // 4. Peer Review (Reviewers)
//     UNDER_REVIEW: 'Under Review',
    
//     // 5. Editorial Recommendation (Associate Editor -> EIC)
//     REVIEW_COMPLETED: 'Review Completed', // Waiting for Associate Recommendation
//     DECISION_PENDING: 'Decision Pending', // With EIC
    
//     // 6. Loop / Final Decision
//     REVISION_REQUIRED: 'Revisions Required',
//     REJECTED: 'Reject',
//     REJECTED_FINAL: 'Reject', // Added for clarity

//     ACCEPTED: 'Accepted',
    
//     // 7. Production (Linear Flow)
//     PROD_LANGUAGE_EDITING: 'Production: Language Editing',
//     PROD_COPY_LAYOUT: 'Production: Copy Layout',
//     PROD_PROOFREADING: 'Production: Proof Reading',
//     PROD_READY_TO_PUBLISH: 'Ready to Publish',
//     PUBLISHED: 'PUBLISHED'
// };



// export const ROLES = {
//     ADMIN: 'admin',
//     EIC: 'editor_in_chief',
//     MANAGING_EDITOR: 'managing_editor',
//     ASSOCIATE_EDITOR: 'associate_editor',
//     REVIEWER: 'reviewer',
//     AUTHOR: 'author',
//     MEMBER: 'member',
//     PRODUCTION: 'production_staff'
// };

// export const ARTICLE_TYPES = [
//     'Original Research Article',
//     'Review Paper',
//     'Short Communication',
//     'Policy Brief',
//     'Case Study',
//     'Conference Proceeding'
// ];

// export const SPECIALIZATIONS = [
//     'Pure Mathematics',
//     'Applied Mathematics',
//     'Computational Mathematics',
//     'Statistics',
//     'Mathematics Education',
//     'Data Science'
// ];


/**
 * MANUSCRIPT_STATUS
 * These values match the boxes and arrows in the Editorial Workflow flowchart.
 * Use these for badges, progress trackers, and conditional rendering.
 */
export const MANUSCRIPT_STATUS = {
    SUBMITTED: 'Submitted', // Default if not in your list yet
    WITH_MANAGING_EDITOR: 'Initial Check', 
    WITH_ASSOCIATE_EDITOR: 'With Associate Editor', // Matched DB
    UNDER_REVIEW: 'UNDER_REVIEW',                   // Matched DB
    REVIEWS_RECEIVED: 'REVIEWS_RECEIVED', 
    DECISION_PENDING: 'DECISION_PENDING',           // Matched DB
    REVISION_REQUIRED: 'Revisions Required',        // Matched DB
    REJECTED: 'Reject',                             // Matched DB (Singular)
    ACCEPTED: 'Accepted',                           // Matched DB
    PUBLISHED: 'PUBLISHED'                          // Matched DB
};

/**
 * ROLES
 * Used for role-based access control (RBAC) in the frontend UI.
 */
export const ROLES = {
    ADMIN: 'admin',
    EIC: 'editor_in_chief',
    MANAGING_EDITOR: 'managing_editor',
    ASSOCIATE_EDITOR: 'associate_editor',
    REVIEWER: 'reviewer',
    AUTHOR: 'author',
    MEMBER: 'member',
    PRODUCTION: 'production_staff'
};

/**
 * ARTICLE_TYPES
 * Standard options for the submission form.
 */
export const ARTICLE_TYPES = [
    'Original Research Article',
    'Review Paper',
    'Short Communication',
    'Policy Brief',
    'Case Study',
    'Conference Proceeding',
    'Erratum',
    'Special Issue'
];

/**
 * SPECIALIZATIONS
 * Matches the categories used by Associate Editors and for filtering the library.
 */
export const SPECIALIZATIONS = [
    'Pure Mathematics',
    'Applied Mathematics',
    'Computational & Numerical Mathematics',
    'Mathematical Modeling',
    'Mathematics Education',
    'Statistics and Probability',
    'Mathematical Physics',
    'Interdisciplinary Areas',
    'Others'
];

/**
 * HELPER: UI Status Colors
 * Mapping statuses to CSS colors (Bootstrap/Tailwind style)
 */
export const STATUS_COLORS = {
    [MANUSCRIPT_STATUS.SUBMITTED]: 'secondary',
    [MANUSCRIPT_STATUS.UNDER_REVIEW]: 'info',
    [MANUSCRIPT_STATUS.REVISION_REQUIRED]: 'warning',
    [MANUSCRIPT_STATUS.REJECTED]: 'danger',
    [MANUSCRIPT_STATUS.ACCEPTED]: 'success',
    [MANUSCRIPT_STATUS.PUBLISHED]: 'primary',
    [MANUSCRIPT_STATUS.DECISION_PENDING]: 'dark'
};

export const steps = [
    { label: 'Submitted', statuses: [MANUSCRIPT_STATUS.SUBMITTED, MANUSCRIPT_STATUS.WITH_MANAGING_EDITOR] },
    { label: 'Technical', statuses: [MANUSCRIPT_STATUS.WITH_ASSOCIATE_EDITOR] },
    { label: 'Peer Review', statuses: [MANUSCRIPT_STATUS.UNDER_REVIEW, MANUSCRIPT_STATUS.REVIEWS_RECEIVED] },
    { label: 'Recommendation', statuses: [MANUSCRIPT_STATUS.DECISION_PENDING] },
    { label: 'Production', statuses: [MANUSCRIPT_STATUS.ACCEPTED, MANUSCRIPT_STATUS.PROD_LANGUAGE_EDITING, MANUSCRIPT_STATUS.PROD_COPY_LAYOUT, MANUSCRIPT_STATUS.PROD_PROOFREADING] },
    { label: 'Published', statuses: [MANUSCRIPT_STATUS.PUBLISHED] }
];