const releaseNotesRegex = /```release_note([\s\S]*)```/ig;
module.exports = async ({github, context, core, pr}) => {
  const {body} = pr;
  let reasons = [];
  let warnings = [];
  
  // check that the PR has a release_notes section
  const hasReleaseNotes = releaseNotesRegex.test(body);
  // check for release label
  const releaseLabels = pr.labels.map(l => l.name).filter(l => l.startsWith('release/'));
  
  if (!hasReleaseNotes) {
    warnings.push('* Missing release notes section.');
    core.warning('Missing release notes section');
  }
  if (releaseLabels.length > 0) {
    if (releaseLabels.length > 1) {
      reasons.push('* Too many release labels. Please remove one of the release/* labels from this PR.');
      core.warning('Too many release labels.');
    }
    if (!hasReleaseNotes) {
      reasons.push('* Missing release notes section. You\'ve specified at least one release/* label without any release notes.');
      core.warning('Missing release notes section');
    }
  } else {
    if (hasReleaseNotes) {
      warnings.push('* You\'ve added some release notes but haven\'t added a release/* label.');
      core.warning('Missing release labels.');
    }
  }
  
  core.setOutput('reasons', reasons.join('\n'));
  core.setOutput('warnings', warnings.join('\n'));
    
  if (reasons.length > 0) {
    core.setFailed('Pull request failed to pass validation.');
  }
}
