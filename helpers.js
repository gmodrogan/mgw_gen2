export const Cookie = {
    get: (e) => {
        e = document.cookie.match(new RegExp("(?:^|; )" + e.replace(/([.$?*|{}()[\]\\/+^])/g, "$1") + "=([^;]*)"));
        return e ? decodeURIComponent(e[1]) : void 0
    },
    set: (e, n, o = {}) => {
        o = {path: "/", ...o}, o.expires instanceof Date && (o.expires = o.expires.toUTCString());
        let c = unescape(encodeURIComponent(e)) + "=" + unescape(encodeURIComponent(n));
        for (var t in o) {
            c += "; " + t;
            var a = o[t];
            !0 !== a && (c += "=" + a)
        }
        document.cookie = c
    },
    rem: (e) => {
        Cookie.set(e, "", {"max-age": -1})
    }
}

export function getWwwFormUrlEncodedData(data) {
    let formBody = [];
    for (let property in data) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(data[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    return formBody.join("&");
}

export async function generateSHA256Hash(inputString) {
    // Encode the input string to a Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(inputString);

    // Hash the data using SHA-256
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);

    // Convert the ArrayBuffer to a Uint8Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // Convert each byte to its hexadecimal representation and join
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    return hashHex;
}

export function generateUrlSafeRandomString(length) {
    // 1. Generate cryptographically secure random bytes
    const randomBytes = new Uint8Array(length);
    crypto.getRandomValues(randomBytes);

    // 2. Convert bytes to a base64 string (not yet URL-safe)
    const base64String = btoa(String.fromCharCode(...randomBytes));

    // 3. Make it URL-safe by replacing problematic characters
    //    and removing padding
    const urlSafeString = base64String
        .replace(/\+/g, '-') // Replace + with -
        .replace(/\//g, '_') // Replace / with _
        .replace(/=+$/, ''); // Remove trailing = padding

    return urlSafeString;
}