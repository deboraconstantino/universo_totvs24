function(codeType, content) { 
    if (codeType == 'checkBalance') {
        this.eventTarget.send(codeType, content);
    } else if (codeType == 'setParam') {
        sessionStorage.setItem('param', content);
    }
}