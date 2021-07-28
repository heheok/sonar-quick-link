document.addEventListener('DOMContentLoaded', function() {
    let projectName = "";
    let branchName = "";
    chrome.runtime.onMessage.addListener(function(request, sender) {
        if (request.action == "getSource") {

            const doc = document.createElement('html');
            doc.innerHTML = request.source;
           
            const branchNameRawCollection = doc.querySelectorAll("[data-qa='pr-branches-and-state-styles']");
            if(branchNameRawCollection.length > 0) {
                const branchNameSpanCollection = branchNameRawCollection[0].getElementsByTagName("span");
                if(branchNameSpanCollection.length > 0) {
                    const rawBranchNameArr = branchNameSpanCollection[0].innerText.split(": ");
                    branchName = rawBranchNameArr[1];
                }
                
            }

            const breadCrumbCollection = doc.querySelectorAll("[data-qa='pr-header-page-header-wrapper']");
            if(breadCrumbCollection.length > 0) {
                const breadCrumbLiElement = breadCrumbCollection[0].getElementsByTagName("li");
                if(breadCrumbLiElement.length>0) {
                    projectName = breadCrumbLiElement[2].innerText
                }
                
            }
            
        }

        var newURL = `https://sonarcloud.io/dashboard?branch=${branchName}&id=fireflyon_${projectName}`;
        chrome.tabs.create({ url: newURL });
    });

    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.executeScript(
            tabs[0].id,
            { code: 'var s = document.documentElement.outerHTML; chrome.runtime.sendMessage({action: "getSource", source: s});' }
        );
    });
  }, false);
  