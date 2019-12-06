const getDateStr = dateStr => {
    if (dateStr === '' || !dateStr)
        return '';
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
}

export default getDateStr;
