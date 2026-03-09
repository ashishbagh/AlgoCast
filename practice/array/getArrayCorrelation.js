function maxArrayCorrelation(a, b) {
    const aSorted = [...a].sort((x, y) => x - y);  // ✅ copy — original 'a' untouched
    const bSorted = [...b].sort((x, y) => x - y);

    let i = aSorted.length - 1;
    let j = bSorted.length - 1;
    let total = 0;

    while (i >= 0 && j >= 0) {
        if (bSorted[j] > aSorted[i]) {
            total += bSorted[j];
            i--;
            j--;
        } else {
            i--;
        }
    }
    return total;
}