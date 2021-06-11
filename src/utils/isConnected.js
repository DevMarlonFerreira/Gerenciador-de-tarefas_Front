const isConnected = () => {
    const isConnected = localStorage.getItem('@todo/macaddress');
    if(isConnected)
        return true;
    else
        return false;
}

export default isConnected