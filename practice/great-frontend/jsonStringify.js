const escapeMap = { '"': '\\"', '\\': '\\\\' };

function jsonStringify(val) {
    // Types that don't serialize
    if (val === undefined || typeof val === 'function' || typeof val === 'symbol') return undefined;

    if (val === null) return 'null';
    if (typeof val === 'boolean') return String(val);
    if (typeof val === 'number') return isFinite(val) ? String(val) : 'null';
    if (typeof val === 'string') return `"${Array.from(val).map(ch => escapeMap[ch] ?? ch).join('')}"`;

    if (Array.isArray(val)) {
        const items = val.map(item => jsonStringify(item) ?? 'null'); // undefined → "null" in arrays
        return `[${items.join(',')}]`;
    }

    if (typeof val === 'object') {
        const pairs = Object.keys(val)
            .filter(k => jsonStringify(val[k]) !== undefined)          // skip undefined values
            .map(k => `"${k}":${jsonStringify(val[k])}`);
        return `{${pairs.join(',')}}`;
    }
}