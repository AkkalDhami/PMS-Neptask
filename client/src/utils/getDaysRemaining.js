export const getDaysRemaining = (dateStr) => {
    if (!dateStr) return null;
    const deletionDate = new Date(dateStr);
    const now = new Date();
    const diffTime = deletionDate - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};