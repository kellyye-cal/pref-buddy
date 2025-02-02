function isOlderThanWeek(date) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7)

    return date < weekAgo
}

module.exports = {
    isOlderThanWeek,
}