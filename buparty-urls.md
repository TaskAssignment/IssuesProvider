#Routes

def _format(pattern, *args):
    return pattern.format(*map(quote, map(str, args)))

def bugs(project):
    return _format('/bugparty/{}/bugs/', project)

def bug(project, bug_id):
    return _format('/bugparty/{}/bugs/{}', project, bug_id)

def bug_topic_similar(project, bug_id):
    return _format('/bugparty/{}/topics/similar/{}', project, bug_id)

def bug_text_similar(project, bug_id):
    return _format('/bugparty/{}/similar_text/{}', project, bug_id)

def alldates(project):
    return _format('/bugparty/{}/topics/alldates', project)

def reports(project):
    return _format('/bugparty/{}/reports', project)

def lda_report(project, report_id):
    return _format('/bugparty/{}/reports/lda/{}', project, report_id)

def lda_report_file(project, report_id, file):
    return _format('/bugparty/{}/reports/lda/{}/{}', project, report_id, file)

def cluster_report(project, report_id):
    return _format('/bugparty/{}/reports/cluster/{}', project, report_id)

def cluster_csv(project, report_id):
    return _format('/bugparty/{}/reports/cluster/{}/cluster.csv',
                    project, report_id)

def cluster_svg(project, report_id):
    return _format('/bugparty/{}/reports/cluster/{}/silhouette.svg',
                    project, report_id)

def fastrep_matches(project, bug_id, context, rep, count = 25):
    return _format('/bugparty/{}/fastrep/matches/{}/{}/{}/{}',
                    project, bug_id, context, rep, count)
