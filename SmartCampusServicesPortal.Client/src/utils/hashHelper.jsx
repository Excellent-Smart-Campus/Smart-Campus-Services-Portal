function encodeId(id) {
    return btoa(id); // Base64 encode the user ID
}

function decodeId(encodedId) {
    return atob(encodedId); // Base64 decode the user ID
}

export { encodeId, decodeId };
