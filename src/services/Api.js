class Api{
    async getGitPublicRepos(since){
        let responseObj = {since: since, repos: '', isError: false, error: ''};
        return await fetch(gitUrl+since)
        .then((response) => {
        if(response.ok){
            const since = (response.headers.get('link').split(',')[0]).match(/\d+/);
            responseObj.since = since;
            return response.json();
        }else{
            return Object.assign({}, responseObj, {isError: true, 
                error: `${response.status} - ${response.statusText}`});
        }
        })
        .then((response) => {
            if(!response.isError){
                responseObj.repos = response;
            }else{
                responseObj = Object.assign({}, responseObj, response);
            }
            return responseObj;
        })
        .catch((error) => {
            return Object.assign({}, responseObj, {isError: true, error: error});
        });
    }
}

const gitUrl = `https://api.github.com/repositories?since=`;

export default Api = new Api();