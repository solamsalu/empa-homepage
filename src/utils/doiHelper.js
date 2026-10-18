/**
 * Generates a DOI formatted as: 10.66894/hissab.[Volume][Issue][PageOrder]
 * Example: Vol 29, Issue 1, Page Order 3 -> 10.66894/hissab.290103
 */
export const generateDoi = (paper) => {
    if (!paper) return '';

    const volume = paper.volume_number || paper.volume_no;
    const issue = paper.issue_number || paper.issue_no;
    // const pageOrder = paper.page_order;

    // When Volume, Issue, and Page Order are all available
    // if (volume && issue && pageOrder) {
    //     const v = String(volume).padStart(2, '0');
    //     const i = String(issue).padStart(2, '0');
    //     const p = String(pageOrder).padStart(2, '0');
    //     return `10.66894/hissab.${v}${i}${p}`;
    // }

    // Fallback if page_order is not yet set (uses 2-digit paper ID)
    if (volume && issue) {
        const v = String(volume).padStart(2, '0');
        const i = String(issue).padStart(2, '0');
        const p = String(paper.id).padStart(2, '0');
        return `10.66894/hissab.${v}${i}${p}`;
    }

    // Safety fallback
    return `10.66894/hissab.${paper.id}`;
};