// share links: /<script>?text=<input>[&from=<script>]; "from" is only set for
// script -> Latin, so plain Latin links stay short and readable

export const buildShareUrl = (pageUrl, scriptType, text, isLatinToScript) => {
    const url = new URL(pageUrl);
    url.search = '';
    url.hash = '';
    url.searchParams.set('text', text);
    if (!isLatinToScript) url.searchParams.set('from', scriptType);
    return url.toString();
};

// returns {text, isLatinToScript} for a share link on this script's page, otherwise null
export const parseShareParams = (search, scriptType) => {
    const params = new URLSearchParams(search);
    const text = params.get('text');
    if (text === null) return null;
    return {text, isLatinToScript: params.get('from') !== scriptType};
};
