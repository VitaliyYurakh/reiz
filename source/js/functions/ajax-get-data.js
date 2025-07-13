export function getAcfFields(ajaxUrl, ajaxAction, params = false ,callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', ajaxUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');


    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 400) {
            const data = JSON.parse(xhr.responseText);
            callback && callback(data);
        } else {
            console.error('Server reached, but it returned an error');
        }
    };

    xhr.onerror = function () {
        console.error('There was a connection error');
    };

    if (params) {
        xhr.send(`action=${ajaxAction}&${params}`);
    } else {
        xhr.send(`action=${ajaxAction}`);
    }
}