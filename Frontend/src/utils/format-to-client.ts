export const FormatToClient = (date?: Date) => {
    if(!date) return '';

    return new Date(date).toLocaleDateString()
}