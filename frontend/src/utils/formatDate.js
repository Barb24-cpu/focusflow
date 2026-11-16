
// Format YYYY-MM-DD or ISO date string into something readable like "Nov 20, 2026"
export function formatDate(dateString) {
    if (!dateString) {
        return 'No due date';
    }

    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}


// Helper to check if a task due date has passed
export function isOverdue(dateString, status) {
    if (!dateString || status === 'done') {
        return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dateString);

    return due < today;
}


// Format date for HTML <input type="date"> (YYYY-MM-DD)
export function toInputDateFormat(dateString) {
    if (!dateString) {
        return '';
    }

    return dateString.split('T')[0];
}
