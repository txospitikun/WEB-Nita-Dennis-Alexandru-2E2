export function setCookie(name, value, days) 
{
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }

    const cookie_value = name + "=" + (value || "") + expires + "; path=/";
    document.cookie = cookie_value;

}

export function getCookie(name)
{
    const returnedName = name + '=';
    const content = document.cookie.split(';');
    for(let i = 0; i < content.length; i++)
    {
        let currentContent = content[i];
        while(currentContent.charAt(0) === ' ')
        {
            currentContent = currentContent.substring(1, currentContent.length);
        }
        if(currentContent.indexOf(returnedName) === 0)
        {
            return currentContent.substring(returnedName.length, currentContent.length);
        }
        return null;
        
    }
}

export function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
}
