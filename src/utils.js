function formatToDate(dateString) {
    const options = { day: '2-digit', month: 'short', year: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

function trimNumber(number) {
    return number.toFixed(3);
}

export { formatToDate, trimNumber };