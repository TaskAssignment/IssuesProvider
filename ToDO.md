# SERVICE NAMES FROM API's

**Information from repositories**

## github

    {
      id
      full_name
      name
      description
      html_url
      language
      language url*
      
    }

## gitlab

    {
      id
      path_with_namespace
      name
      description
      web_url
    }

## bitbucket

    values
    {
      uuid
      full_name
      name
      description
      links.self
    }

## bugparty

    {
        
    }


## bugzilla 

    {
    
    }


**Information from bugs**

    {
        id
        body
        title
        reporter
        comments
        url
    }
    
 **To do*
 
    {
        get_bug(#,project,criteria)
            - bug description
        get_cand_devs(project)
            - candidate_description                
    }
 