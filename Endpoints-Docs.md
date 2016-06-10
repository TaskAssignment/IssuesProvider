## Endpoints  docs 
   
   ** Functions of the API **
   
   - get_bug(#,project,criteria)
        
        - # > number of bugs
        - project > name of the project and service
        - criteria (important bugs)
   
   - get_cand_devs(project)
   
        - project and service 
 
   ** GET_BUG URLS **
   
   http://issuesprovider.herokuapp.com/api/v1/gitlab/2rbdPSvGXzbxYSCUoszC/1206370/bugs
   
   http://localhost:3000/api/v1/service/github/zdr00/repos
   http://localhost:3000/api/v1/service/bitbucket/zdr00/repos
   http://localhost:3000/api/v1/service/gitlab/2rbdPSvGXzbxYSCUoszC/repos
   
   http://localhost:3000/api/v1/service/gitlab/2rbdPSvGXzbxYSCUoszC/1206370/bugs
   http://localhost:3000/api/v1/service/bitbucket/zdr00/menubarmac/bugs
   http://localhost:3000/api/v1/service/github/rails/rails/bugs
   
      -- dev --
   
   http://localhost:3000/api/v1/service/github/rails/rails/users
   http://localhost:3000/api/v1/service/gitlab/2rbdPSvGXzbxYSCUoszC/1206370/users
   http://localhost:3000/api/v1/service/bitbucket/zdr00/menubarmac/users
   
   ** GET_CAND_DEVS(project) **
   
   http://localhost:3000/api/v1/bugzilla/:product/:component/bugs
   http://localhost:3000/api/v1/eclipse/:product/:component/users
   http://localhost:3000/api/v1/bugparty/:product/:component/repos
   
   ** BITBUCKET URLS **

   https://api.bitbucket.org/2.0/repositories/abram
   https://api.bitbucket.org/2.0/repositories/zdr00/menubarmac/issues

   ** GITLAB URLS **

   https://gitlab.com/api/v3/projects/?private_token=2rbdPSvGXzbxYSCUoszC
   https://gitlab.com/api/v3/projects/1206370/members?private_token=2rbdPSvGXzbxYSCUoszC
   https://gitlab.com/api/v3/projects/1206370/issues?private_token=2rbdPSvGXzbxYSCUoszC

   ** BUGPARTY URLS **

   http://localhost:8080/bugparty/:name/bugs
   http://localhost:8080/bugparty/:name/reports
   http://localhost:8080/bugparty/:name/topics/alldates

   ** GITHUB URLS **

   https://api.github.com/users/zdr00/repos?per_page=100
   https://api.github.com/repos/mojombo/grit/issues

   ** BUGZILLA URLS **

   https://bugzilla.mozilla.org/rest/product?names=firefox
   https://bugzilla.mozilla.org/rest/product?names=Thunderbird
   https://bugzilla.mozilla.org/rest/bug?id=12434,43421
   https://bugzilla.mozilla.org/rest/product?names=bugzilla
   https://bugzilla.mozilla.org/rest/bug?id=2436  
   
   https://bugzilla.mozilla.org/rest/bug?component=Activity%20Streams%3A%20Timeline&product=Firefox