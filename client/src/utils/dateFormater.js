export const dateFormater = (dateStr, isFullDate = false) => {
    const date = new Date(dateStr);
    const options = isFullDate
        ? {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            weekday: 'short',
        }
        : {
            year: 'numeric',
            day: 'numeric',
            month: 'long',
        };
    return date.toLocaleDateString(undefined, options);
}