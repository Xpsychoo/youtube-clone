export function getTimeSinceUpload(uploadDate) {
    const now = new Date();
    const uploaded = new Date(uploadDate);
    const diffInSeconds = Math.floor((now - uploaded) / 1000);

    const years = Math.floor(diffInSeconds / (365 * 24 * 60 * 60));
    const months = Math.floor((diffInSeconds % (365 * 24 * 60 * 60)) / (30 * 24 * 60 * 60));
    const days = Math.floor((diffInSeconds % (30 * 24 * 60 * 60)) / (24 * 60 * 60));
    const hours = Math.floor((diffInSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((diffInSeconds % (60 * 60)) / 60);
    const seconds = diffInSeconds % 60;

    let result = "";

    if (years > 0) {
        result = `${years} year${years > 1 ? "s" : ""}`;
    } else if (months > 0) {
        result = `${months} month${months > 1 ? "s" : ""}`;
    } else if (days > 0) {
        result = `${days} day${days > 1 ? "s" : ""}`;
    } else if (hours > 0) {
        result = `${hours} hour${hours > 1 ? "s" : ""}`;
    } else if (minutes > 0) {
        result = `${minutes} minute${minutes > 1 ? "s" : ""}`;
    } else {
        result = `${seconds} second${seconds > 1 ? "s" : ""}`;
    }

    return result;
}

export function timeAgo(date) {
    if (!date || isNaN(new Date(date))) return '';
    return `${getTimeSinceUpload(date)} ago`;
}

const compactFormatter = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });

// 1234567 -> "1.2M". Strings that aren't numbers are returned unchanged.
export function formatCount(value) {
    if (value === null || value === undefined || value === '') return '';
    const n = Number(value);
    return Number.isFinite(n) ? compactFormatter.format(n) : String(value);
}

export function formatNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n.toLocaleString('en') : value ?? '';
}

export function formatDuration(seconds) {
    const total = Number(seconds);
    if (!Number.isFinite(total) || total <= 0) return '';
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = Math.floor(total % 60);
    const pad = (v) => String(v).padStart(2, '0');
    return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

export function formatDate(date) {
    const d = new Date(date);
    return isNaN(d) ? '' : d.toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function toUrl(url) {
    return url?.startsWith('//') ? `https:${url}` : url;
}

// The API returns images as size-ascending arrays (sometimes nested); take the largest.
export function pickImage(images) {
    const list = (Array.isArray(images) ? images.flat() : []).filter((img) => img?.url);
    return toUrl(list[list.length - 1]?.url);
}

export function isVerified(badges) {
    return !!badges?.some((badge) => /VERIFIED|OFFICIAL/.test(badge?.type || ''));
}