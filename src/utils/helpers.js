export function isTokenValid(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));

    const { username } = JSON.parse(jsonPayload);

    return Boolean(username);
  } catch (e) {
    return false;
  }
}

